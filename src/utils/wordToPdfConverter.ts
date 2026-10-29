/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { renderAsync } from 'docx-preview';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const MAX_DOCX_FILE_SIZE = 30 * 1024 * 1024; // 30 MB

export interface WordConversionProgress {
  step: 'validating' | 'parsing' | 'rendering' | 'compiling' | 'completed';
  message: string;
  percentage: number;
  currentPage?: number;
  totalPages?: number;
}

export interface WordToPdfResult {
  blob: Blob;
  blobUrl: string;
  filename: string;
  fileSizeBytes: number;
  pageCount: number;
  warnings?: string[];
}

export interface WordToPdfOptions {
  customFilename?: string;
  pageSize?: 'a4' | 'letter';
}

/**
 * Format bytes to human readable format
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Verifies that the file begins with the standard ZIP magic bytes (PK\x03\x04)
 * required for valid Office OpenXML .docx files.
 */
export async function verifyDocxMagicBytes(file: File): Promise<boolean> {
  try {
    const slice = file.slice(0, 4);
    const buffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    return (
      bytes[0] === 0x50 && // 'P'
      bytes[1] === 0x4b && // 'K'
      bytes[2] === 0x03 &&
      bytes[3] === 0x04
    );
  } catch {
    return false;
  }
}

/**
 * Validates a Word file for size, extension, and binary header validity
 */
export async function validateDocxFile(
  file: File
): Promise<{ isValid: boolean; error?: string }> {
  if (!file) {
    return { isValid: false, error: 'No file was provided.' };
  }

  if (file.size === 0) {
    return { isValid: false, error: 'The selected file is empty (0 bytes).' };
  }

  if (file.size > MAX_DOCX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size (${formatBytes(file.size)}) exceeds the ${formatBytes(
        MAX_DOCX_FILE_SIZE
      )} limit. Please select a smaller document.`,
    };
  }

  const lowerName = file.name.toLowerCase();

  // Handle legacy .doc format
  if (lowerName.endsWith('.doc') && !lowerName.endsWith('.docx')) {
    return {
      isValid: false,
      error:
        'Legacy binary Word (.doc) format is not supported directly. Please open your document in Microsoft Word or Google Docs and save/export as modern Word (.docx) format.',
    };
  }

  if (!lowerName.endsWith('.docx')) {
    return {
      isValid: false,
      error: 'Unsupported file type. Please upload a valid Word document (.docx).',
    };
  }

  // Check magic bytes
  const hasMagicBytes = await verifyDocxMagicBytes(file);
  if (!hasMagicBytes) {
    return {
      isValid: false,
      error:
        'File does not have a valid Office OpenXML structure (invalid PK header). The file may be corrupted or renamed from another format.',
    };
  }

  return { isValid: true };
}

/**
 * Converts a .docx Word document to a PDF in the browser using client-side docx-preview,
 * html2canvas, and jsPDF.
 */
export async function convertWordToPdf(
  file: File,
  options: WordToPdfOptions = {},
  onProgress?: (progress: WordConversionProgress) => void
): Promise<WordToPdfResult> {
  // Step 1: Validation
  onProgress?.({
    step: 'validating',
    message: 'Validating Word document structure...',
    percentage: 10,
  });

  const validation = await validateDocxFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error || 'Invalid Word document.');
  }

  // Step 2: Read & Parse DOCX
  onProgress?.({
    step: 'parsing',
    message: 'Parsing document content, styles, and tables...',
    percentage: 25,
  });

  // Create isolated offscreen container for rendering
  const container = document.createElement('div');
  container.className = 'docx-render-container';
  container.style.position = 'fixed';
  container.style.left = '-99999px';
  container.style.top = '0';
  container.style.width = '820px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#000000';
  container.style.zIndex = '-9999';
  container.style.pointerEvents = 'none';
  container.style.opacity = '1';
  container.style.boxSizing = 'border-box';
  document.body.appendChild(container);

  try {
    // Render DOCX into DOM elements with breakPages enabled
    await renderAsync(file, container, container, {
      inWrapper: true,
      ignoreWidth: false,
      ignoreHeight: false,
      breakPages: true,
      experimental: true,
      useBase64URL: true,
      renderHeaders: true,
      renderFooters: true,
    });

    onProgress?.({
      step: 'parsing',
      message: 'Processing typography, embedded images, and layouts...',
      percentage: 45,
    });

    // Wait for embedded images to decode
    const images = Array.from(container.querySelectorAll('img'));
    if (images.length > 0) {
      await Promise.all(
        images.map((img) =>
          img.complete
            ? Promise.resolve()
            : img.decode().catch(() => Promise.resolve())
        )
      );
    }

    // Small delay to ensure CSS calculations are complete
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Step 3: Identify pages/sections in rendered DOM
    let pageElements = Array.from(
      container.querySelectorAll<HTMLElement>('section.docx, .docx-wrapper > section, .docx-page')
    );

    // If no distinct section elements were found, use the wrapper or container directly
    const wrapper = container.querySelector<HTMLElement>('.docx-wrapper') || container;
    const hasDistinctPages = pageElements.length > 0;

    onProgress?.({
      step: 'rendering',
      message: hasDistinctPages
        ? `Rendering ${pageElements.length} document page(s) to PDF...`
        : 'Rendering document layout...',
      percentage: 55,
      totalPages: hasDistinctPages ? pageElements.length : 1,
    });

    const pageSize = options.pageSize || 'a4';
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: pageSize,
      compress: true,
    });

    const pdfPageWidth = pdf.internal.pageSize.getWidth(); // e.g. 210mm for A4
    const pdfPageHeight = pdf.internal.pageSize.getHeight(); // e.g. 297mm for A4

    let totalPagesGenerated = 0;

    if (hasDistinctPages) {
      for (let i = 0; i < pageElements.length; i++) {
        const pageEl = pageElements[i];

        onProgress?.({
          step: 'rendering',
          message: `Rendering page ${i + 1} of ${pageElements.length}...`,
          percentage: Math.round(55 + ((i + 1) / pageElements.length) * 30),
          currentPage: i + 1,
          totalPages: pageElements.length,
        });

        const canvas = await html2canvas(pageEl, {
          scale: 2, // High resolution for crisp text and tables
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: 820,
        });

        if (i > 0) {
          pdf.addPage(pageSize, 'portrait');
        }

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const imgHeightMm = (canvas.height * pdfPageWidth) / canvas.width;

        // Draw image onto PDF page
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfPageWidth, Math.min(imgHeightMm, pdfPageHeight));
        totalPagesGenerated++;
      }
    } else {
      // Continuous document: render entire wrapper and slice into multiple pages if needed
      const canvas = await html2canvas(wrapper, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 820,
      });

      const totalHeightMm = (canvas.height * pdfPageWidth) / canvas.width;
      let heightLeftMm = totalHeightMm;
      let positionMm = 0;

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      pdf.addImage(imgData, 'JPEG', 0, positionMm, pdfPageWidth, totalHeightMm);
      heightLeftMm -= pdfPageHeight;
      totalPagesGenerated = 1;

      while (heightLeftMm > 2) {
        positionMm = -(totalPagesGenerated * pdfPageHeight);
        pdf.addPage(pageSize, 'portrait');
        pdf.addImage(imgData, 'JPEG', 0, positionMm, pdfPageWidth, totalHeightMm);
        heightLeftMm -= pdfPageHeight;
        totalPagesGenerated++;
      }
    }

    // Step 4: Compiling PDF
    onProgress?.({
      step: 'compiling',
      message: 'Compiling high-fidelity PDF document...',
      percentage: 95,
      totalPages: totalPagesGenerated,
    });

    const pdfBlob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);

    // Construct filename
    let outName = (options.customFilename || file.name.replace(/\.[^/.]+$/, '')).trim();
    if (!outName.toLowerCase().endsWith('.pdf')) {
      outName += '.pdf';
    }

    onProgress?.({
      step: 'completed',
      message: 'Word to PDF conversion complete!',
      percentage: 100,
      totalPages: totalPagesGenerated,
    });

    return {
      blob: pdfBlob,
      blobUrl,
      filename: outName,
      fileSizeBytes: pdfBlob.size,
      pageCount: totalPagesGenerated,
      warnings: [
        'Client-side conversion preserves headings, text formatting, tables, lists, and images. Complex multi-column floating text frames or specialized Word macros may have minor stylistic variations.',
      ],
    };
  } finally {
    // Always clean up offscreen DOM elements
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }
}
