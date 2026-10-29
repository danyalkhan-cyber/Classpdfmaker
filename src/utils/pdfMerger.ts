/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PDFDocument } from 'pdf-lib';

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB per file
export const MAX_TOTAL_SIZE_BYTES = 150 * 1024 * 1024; // 150MB total

export interface MergeFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount?: number;
  isInspecting?: boolean;
  error?: string;
}

export interface MergeProgress {
  currentFileIndex: number;
  totalFiles: number;
  currentFilename: string;
  totalPagesMerged: number;
  percentage: number;
  message: string;
}

export interface MergeResult {
  blob: Blob;
  blobUrl: string;
  filename: string;
  fileSizeBytes: number;
  totalPageCount: number;
  fileCount: number;
  filesSummary: { name: string; pageCount: number; sizeBytes: number }[];
}

/**
 * Format bytes to readable human string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Validates the file header starts with %PDF- magic bytes
 */
export async function verifyPdfMagicBytes(file: File): Promise<boolean> {
  try {
    const slice = file.slice(0, 8);
    const buffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const header = String.fromCharCode(...bytes);
    return header.includes('%PDF-');
  } catch {
    return false;
  }
}

/**
 * Fast inspection of a PDF file to detect validity, page count, and password encryption
 */
export async function inspectPdfFile(
  file: File
): Promise<{ isValid: boolean; pageCount?: number; error?: string }> {
  // 1. File size check
  if (file.size === 0) {
    return { isValid: false, error: 'The file is empty (0 bytes).' };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File exceeds the 50MB limit (${formatBytes(file.size)}).`,
    };
  }

  // 2. Extension check
  if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
    return {
      isValid: false,
      error: 'Not a PDF file. Please select a valid .pdf file.',
    };
  }

  // 3. Magic bytes check
  const hasMagicBytes = await verifyPdfMagicBytes(file);
  if (!hasMagicBytes) {
    return {
      isValid: false,
      error: 'File does not contain valid PDF headers. It may be corrupted or renamed.',
    };
  }

  // 4. Try parsing structure with pdf-lib to get page count and catch encryption
  try {
    const arrayBuffer = await file.arrayBuffer();
    // Use ignoreEncryption: false to detect password-locked files
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: false });
    const count = pdfDoc.getPageCount();

    if (count === 0) {
      return { isValid: false, error: 'PDF contains 0 pages.' };
    }

    return { isValid: true, pageCount: count };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (
      msg.toLowerCase().includes('encrypt') ||
      msg.toLowerCase().includes('password') ||
      msg.toLowerCase().includes('secured')
    ) {
      return {
        isValid: false,
        error: 'This PDF is password-protected or encrypted. Please unlock it before merging.',
      };
    }
    return {
      isValid: false,
      error: `Unable to read PDF (${msg.slice(0, 100)}). It might be damaged.`,
    };
  }
}

/**
 * Merges an array of PDF files in the specified order completely in the browser
 */
export async function mergePdfFiles(
  files: File[],
  customFilename?: string,
  onProgress?: (progress: MergeProgress) => void
): Promise<MergeResult> {
  if (!files || files.length < 2) {
    throw new Error('At least 2 PDF files are required to perform a merge.');
  }

  // Total size sanity check
  const totalBytes = files.reduce((acc, f) => acc + f.size, 0);
  if (totalBytes > MAX_TOTAL_SIZE_BYTES) {
    throw new Error(
      `Combined file size (${formatBytes(totalBytes)}) exceeds the ${formatBytes(
        MAX_TOTAL_SIZE_BYTES
      )} browser memory limit. Please merge fewer files at once.`
    );
  }

  onProgress?.({
    currentFileIndex: 0,
    totalFiles: files.length,
    currentFilename: files[0].name,
    totalPagesMerged: 0,
    percentage: 5,
    message: 'Initializing merged PDF document in memory...',
  });

  const mergedDoc = await PDFDocument.create();
  const filesSummary: { name: string; pageCount: number; sizeBytes: number }[] = [];
  let totalPageCounter = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    onProgress?.({
      currentFileIndex: i + 1,
      totalFiles: files.length,
      currentFilename: file.name,
      totalPagesMerged: totalPageCounter,
      percentage: Math.round(10 + (i / files.length) * 75),
      message: `Reading and copying pages from "${file.name}" (${i + 1} of ${files.length})...`,
    });

    // Check magic bytes
    const hasMagicBytes = await verifyPdfMagicBytes(file);
    if (!hasMagicBytes) {
      throw new Error(
        `"${file.name}" is not a valid PDF file (invalid file header). Please remove or replace it.`
      );
    }

    let srcArrayBuffer: ArrayBuffer;
    try {
      srcArrayBuffer = await file.arrayBuffer();
    } catch {
      throw new Error(`Failed to read file data from "${file.name}".`);
    }

    let srcDoc: PDFDocument;
    try {
      srcDoc = await PDFDocument.load(srcArrayBuffer, { ignoreEncryption: false });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (
        msg.toLowerCase().includes('encrypt') ||
        msg.toLowerCase().includes('password') ||
        msg.toLowerCase().includes('secured')
      ) {
        throw new Error(
          `"${file.name}" is password-protected or encrypted. Please remove password protection before merging.`
        );
      }
      throw new Error(`Failed to parse "${file.name}": ${msg}`);
    }

    const pageIndices = srcDoc.getPageIndices();
    if (pageIndices.length === 0) {
      throw new Error(`"${file.name}" has no pages to merge.`);
    }

    // Copy all pages preserving dimensions and orientations
    const copiedPages = await mergedDoc.copyPages(srcDoc, pageIndices);
    for (const page of copiedPages) {
      mergedDoc.addPage(page);
    }

    totalPageCounter += copiedPages.length;
    filesSummary.push({
      name: file.name,
      pageCount: copiedPages.length,
      sizeBytes: file.size,
    });
  }

  onProgress?.({
    currentFileIndex: files.length,
    totalFiles: files.length,
    currentFilename: files[files.length - 1].name,
    totalPagesMerged: totalPageCounter,
    percentage: 90,
    message: 'Compiling merged PDF bytes...',
  });

  // Save the merged document
  const mergedPdfBytes = await mergedDoc.save();

  onProgress?.({
    currentFileIndex: files.length,
    totalFiles: files.length,
    currentFilename: 'Done',
    totalPagesMerged: totalPageCounter,
    percentage: 100,
    message: 'Merge completed successfully!',
  });

  // Construct filename
  let cleanFilename = (customFilename || 'merged-document.pdf').trim();
  if (!cleanFilename.toLowerCase().endsWith('.pdf')) {
    cleanFilename += '.pdf';
  }

  const blob = new Blob([mergedPdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  const blobUrl = URL.createObjectURL(blob);

  return {
    blob,
    blobUrl,
    filename: cleanFilename,
    fileSizeBytes: blob.size,
    totalPageCount: totalPageCounter,
    fileCount: files.length,
    filesSummary,
  };
}
