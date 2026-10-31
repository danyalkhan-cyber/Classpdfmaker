/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as pdfjsLib from 'pdfjs-dist';
import {
  PDFDocument,
  PDFName,
  PDFNumber,
  PDFRawStream,
  PDFRef,
} from 'pdf-lib';

// Set up the local pdfjs worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

export type CompressionLevel = 'low' | 'recommended' | 'high';

export const MAX_COMPRESS_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export interface CompressProgress {
  step: 'validating' | 'analyzing' | 'optimizing' | 'compiling' | 'completed';
  message: string;
  percentage: number;
  processedImages?: number;
  totalImages?: number;
}

export interface CompressResult {
  blob: Blob;
  blobUrl: string;
  filename: string;
  originalSizeBytes: number;
  compressedSizeBytes: number;
  sizeReducedBytes: number;
  reductionPercentage: number;
  isSmaller: boolean;
  pageCount: number;
  imagesOptimizedCount: number;
  explanation: string;
}

export interface CompressOptions {
  level: CompressionLevel;
  customFilename?: string;
}

/**
 * Format bytes to readable human string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
  const sign = bytes < 0 ? '-' : '';
  return `${sign}${parseFloat((Math.abs(bytes) / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Verify %PDF- header magic bytes
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
 * Fast inspection of PDF file for validity, page count, and password encryption
 */
export async function inspectPdfForCompression(
  file: File
): Promise<{ isValid: boolean; pageCount?: number; error?: string }> {
  if (!file) {
    return { isValid: false, error: 'No file selected.' };
  }

  if (file.size === 0) {
    return { isValid: false, error: 'The file is empty (0 bytes).' };
  }

  if (file.size > MAX_COMPRESS_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size (${formatBytes(file.size)}) exceeds the 50MB browser limit.`,
    };
  }

  const isPdf =
    file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
  if (!isPdf) {
    return {
      isValid: false,
      error: 'Unsupported file type. Please select a valid PDF file.',
    };
  }

  const hasMagicBytes = await verifyPdfMagicBytes(file);
  if (!hasMagicBytes) {
    return {
      isValid: false,
      error: 'File does not contain a valid %PDF- header. It may be damaged or renamed.',
    };
  }

  try {
    const buf = await file.arrayBuffer();
    const doc = await PDFDocument.load(buf, { ignoreEncryption: false });
    const pageCount = doc.getPageCount();
    if (pageCount === 0) {
      return { isValid: false, error: 'PDF contains 0 pages.' };
    }
    return { isValid: true, pageCount };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (
      msg.toLowerCase().includes('encrypt') ||
      msg.toLowerCase().includes('password') ||
      msg.toLowerCase().includes('secured')
    ) {
      return {
        isValid: false,
        error:
          'This PDF is password-protected or encrypted. Please remove password protection before compressing.',
      };
    }
    return {
      isValid: false,
      error: `Could not parse PDF (${msg.slice(0, 100)}). File might be corrupted.`,
    };
  }
}

/**
 * Re-encodes a JPEG image buffer via HTML5 Canvas with downsampling and compression quality
 */
async function compressJpegImage(
  jpegBytes: Uint8Array,
  origWidth: number,
  origHeight: number,
  level: CompressionLevel
): Promise<{ compressedBytes: Uint8Array; newWidth: number; newHeight: number } | null> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }

  try {
    const exactSlice = jpegBytes.buffer.slice(
      jpegBytes.byteOffset,
      jpegBytes.byteOffset + jpegBytes.byteLength
    );
    const blob = new Blob([exactSlice as ArrayBuffer], { type: 'image/jpeg' });
    let bmp: ImageBitmap | null = null;

    if ('createImageBitmap' in window) {
      try {
        bmp = await createImageBitmap(blob);
      } catch {
        bmp = null;
      }
    }

    let naturalW = origWidth;
    let naturalH = origHeight;

    if (bmp) {
      naturalW = bmp.width;
      naturalH = bmp.height;
    }

    // Determine target dimensions and JPEG quality based on level
    let maxDimension = 1500;
    let quality = 0.65;

    if (level === 'low') {
      maxDimension = 2000;
      quality = 0.80;
    } else if (level === 'recommended') {
      maxDimension = 1400;
      quality = 0.65;
    } else if (level === 'high') {
      maxDimension = 1000;
      quality = 0.45;
    }

    let targetW = naturalW;
    let targetH = naturalH;

    if (targetW > maxDimension || targetH > maxDimension) {
      if (targetW >= targetH) {
        targetH = Math.max(1, Math.round((targetH * maxDimension) / targetW));
        targetW = maxDimension;
      } else {
        targetW = Math.max(1, Math.round((targetW * maxDimension) / targetH));
        targetH = maxDimension;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bmp?.close?.();
      return null;
    }

    // White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetW, targetH);

    if (bmp) {
      ctx.drawImage(bmp, 0, 0, targetW, targetH);
      bmp.close?.();
    } else {
      const imgUrl = URL.createObjectURL(blob);
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, targetW, targetH);
          URL.revokeObjectURL(imgUrl);
          resolve();
        };
        img.onerror = () => {
          URL.revokeObjectURL(imgUrl);
          reject(new Error('Image decode failed'));
        };
        img.src = imgUrl;
      });
    }

    const compressedBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/jpeg', quality);
    });

    canvas.width = 0;
    canvas.height = 0;

    if (!compressedBlob) return null;

    const arrayBuf = await compressedBlob.arrayBuffer();
    const compressedBytes = new Uint8Array(arrayBuf);

    if (compressedBytes.length < jpegBytes.length) {
      return {
        compressedBytes,
        newWidth: targetW,
        newHeight: targetH,
      };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Attempts in-place optimization of indirect image streams in the PDFDocument
 */
async function tryInPlaceOptimization(
  arrayBuffer: ArrayBuffer,
  level: CompressionLevel,
  onProgress?: (progress: CompressProgress) => void
): Promise<{ bytes: Uint8Array; imagesOptimizedCount: number } | null> {
  try {
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: false });

    const imageStreams: {
      ref: PDFRef;
      stream: PDFRawStream;
      width: number;
      height: number;
      filterName: string;
    }[] = [];

    for (const [ref, obj] of pdfDoc.context.enumerateIndirectObjects()) {
      if (obj instanceof PDFRawStream) {
        const subtypeObj = pdfDoc.context.lookup(obj.dict.get(PDFName.of('Subtype')));
        if (subtypeObj && subtypeObj.toString() === '/Image') {
          const filterObj = pdfDoc.context.lookup(obj.dict.get(PDFName.of('Filter')));
          const widthObj = pdfDoc.context.lookup(obj.dict.get(PDFName.of('Width')));
          const heightObj = pdfDoc.context.lookup(obj.dict.get(PDFName.of('Height')));

          const filterName = filterObj ? filterObj.toString() : '';
          const width = widthObj ? parseInt(widthObj.toString(), 10) || 0 : 0;
          const height = heightObj ? parseInt(heightObj.toString(), 10) || 0 : 0;

          imageStreams.push({
            ref,
            stream: obj,
            width,
            height,
            filterName,
          });
        }
      }
    }

    let imagesOptimizedCount = 0;

    if (imageStreams.length > 0) {
      onProgress?.({
        step: 'optimizing',
        message: `Analyzing ${imageStreams.length} embedded image resource(s)...`,
        percentage: 35,
        totalImages: imageStreams.length,
        processedImages: 0,
      });

      for (let i = 0; i < imageStreams.length; i++) {
        const imgItem = imageStreams[i];
        const isJpeg =
          imgItem.filterName.includes('/DCTDecode') ||
          (imgItem.stream.contents[0] === 0xff && imgItem.stream.contents[1] === 0xd8);

        if (isJpeg && imgItem.stream.contents.length > 1024) {
          const compressed = await compressJpegImage(
            imgItem.stream.contents,
            imgItem.width,
            imgItem.height,
            level
          );

          if (compressed) {
            imgItem.stream.dict.set(
              PDFName.of('Length'),
              PDFNumber.of(compressed.compressedBytes.length)
            );
            if (compressed.newWidth > 0 && compressed.newHeight > 0) {
              imgItem.stream.dict.set(
                PDFName.of('Width'),
                PDFNumber.of(compressed.newWidth)
              );
              imgItem.stream.dict.set(
                PDFName.of('Height'),
                PDFNumber.of(compressed.newHeight)
              );
            }
            imgItem.stream.dict.set(PDFName.of('Filter'), PDFName.of('DCTDecode'));
            imgItem.stream.dict.set(PDFName.of('ColorSpace'), PDFName.of('DeviceRGB'));
            imgItem.stream.dict.delete(PDFName.of('DecodeParms'));

            const newStream = PDFRawStream.of(
              imgItem.stream.dict,
              compressed.compressedBytes
            );
            pdfDoc.context.assign(imgItem.ref, newStream);
            imagesOptimizedCount++;
          }
        }
      }
    }

    // Clean up unnecessary metadata
    try {
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('ClassPDF Maker');
      pdfDoc.setCreator('ClassPDF Maker');
    } catch {
      // Ignore metadata cleanup errors
    }

    const savedBytes = await pdfDoc.save({ useObjectStreams: true });
    return { bytes: savedBytes, imagesOptimizedCount };
  } catch {
    return null;
  }
}

/**
 * High-fidelity Page Canvas Compression via pdfjsLib + pdf-lib
 * Renders each PDF page at a controlled DPI and re-encodes pages with modern JPEG compression.
 * Perfect for scanned documents, FlateDecode PDFs, image-based notes, and high-DPI exports.
 */
async function compressViaPageRendering(
  arrayBuffer: ArrayBuffer,
  level: CompressionLevel,
  onProgress?: (progress: CompressProgress) => void
): Promise<{ bytes: Uint8Array; pageCount: number } | null> {
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
      stopAtErrors: false,
    });
    const pdfJsDoc = await loadingTask.promise;
    const numPages = pdfJsDoc.numPages;

    if (numPages === 0) return null;

    // Parameters mapped to compression level
    let scale = 1.4;
    let quality = 0.65;

    if (level === 'low') {
      scale = 1.8; // ~130 DPI, sharp notes and text
      quality = 0.80;
    } else if (level === 'recommended') {
      scale = 1.4; // ~100 DPI, optimal balance
      quality = 0.65;
    } else if (level === 'high') {
      scale = 1.1; // ~80 DPI, maximum size reduction
      quality = 0.45;
    }

    const pageImages: {
      bytes: Uint8Array;
      pageWidthPt: number;
      pageHeightPt: number;
    }[] = [];

    for (let p = 1; p <= numPages; p++) {
      onProgress?.({
        step: 'optimizing',
        message: `Compressing page ${p} of ${numPages}...`,
        percentage: Math.round(25 + (p / numPages) * 60),
        totalImages: numPages,
        processedImages: p,
      });

      const page = await pdfJsDoc.getPage(p);
      const baseViewport = page.getViewport({ scale: 1.0 });
      const scaledViewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      canvas.width = Math.round(scaledViewport.width);
      canvas.height = Math.round(scaledViewport.height);
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas 2D context not available');
      }

      // Draw clean background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render PDF page content
      // @ts-ignore - pdfjs typing differences
      await page.render({ canvasContext: ctx, viewport: scaledViewport }).promise;

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), 'image/jpeg', quality);
      });

      canvas.width = 0;
      canvas.height = 0;

      if (!blob) {
        throw new Error(`Failed to encode compressed page ${p}`);
      }

      const imgBuf = await blob.arrayBuffer();
      pageImages.push({
        bytes: new Uint8Array(imgBuf),
        pageWidthPt: baseViewport.width,
        pageHeightPt: baseViewport.height,
      });
    }

    onProgress?.({
      step: 'compiling',
      message: 'Compiling compressed pages into document...',
      percentage: 90,
    });

    // Assemble new PDF using pdf-lib
    const newDoc = await PDFDocument.create();

    for (const pageItem of pageImages) {
      const embeddedJpg = await newDoc.embedJpg(pageItem.bytes);
      const newPage = newDoc.addPage([pageItem.pageWidthPt, pageItem.pageHeightPt]);
      newPage.drawImage(embeddedJpg, {
        x: 0,
        y: 0,
        width: pageItem.pageWidthPt,
        height: pageItem.pageHeightPt,
      });
    }

    const compiledBytes = await newDoc.save({ useObjectStreams: true });
    return { bytes: compiledBytes, pageCount: numPages };
  } catch (err) {
    console.warn('Page rendering compression fallback error:', err);
    return null;
  }
}

/**
 * Compresses a PDF file completely in the browser:
 * 1. Analyzes document and tests in-place stream optimization
 * 2. If in-place achieves substantial reduction (e.g. >= 10%), uses in-place result
 * 3. Otherwise runs page-level re-encoding to compress Flate/scanned/image-heavy documents
 * 4. Honestly reports file size reduction and metrics
 */
export async function compressPdfFile(
  file: File,
  options: CompressOptions,
  onProgress?: (progress: CompressProgress) => void
): Promise<CompressResult> {
  const originalSizeBytes = file.size;

  onProgress?.({
    step: 'validating',
    message: 'Validating PDF document...',
    percentage: 10,
  });

  const inspection = await inspectPdfForCompression(file);
  if (!inspection.isValid) {
    throw new Error(inspection.error || 'Invalid PDF file.');
  }

  onProgress?.({
    step: 'analyzing',
    message: 'Analyzing PDF resources and image structures...',
    percentage: 20,
  });

  const arrayBuffer = await file.arrayBuffer();
  const pageCount = inspection.pageCount || 1;

  // Step 1: Attempt In-Place stream optimization
  const inPlaceResult = await tryInPlaceOptimization(arrayBuffer, options.level, onProgress);

  let chosenBytes: Uint8Array | null = null;
  let imagesOptimizedCount = inPlaceResult?.imagesOptimizedCount || 0;
  let methodUsed: 'in-place' | 'rendered' = 'in-place';

  const inPlaceLength = inPlaceResult?.bytes.length || Infinity;
  const inPlaceSignificant = inPlaceLength < originalSizeBytes * 0.90; // At least 10% reduction

  if (inPlaceSignificant) {
    chosenBytes = inPlaceResult!.bytes;
    methodUsed = 'in-place';
  } else {
    // Step 2: Run Page Canvas Re-Encoding (handles scanned PDFs, FlateDecode images, canvas notes, etc.)
    const renderedResult = await compressViaPageRendering(arrayBuffer, options.level, onProgress);
    const renderedLength = renderedResult?.bytes.length || Infinity;

    if (renderedLength < originalSizeBytes) {
      if (inPlaceLength < renderedLength && inPlaceLength < originalSizeBytes) {
        chosenBytes = inPlaceResult!.bytes;
        methodUsed = 'in-place';
      } else {
        chosenBytes = renderedResult!.bytes;
        methodUsed = 'rendered';
        imagesOptimizedCount = pageCount;
      }
    } else if (inPlaceLength < originalSizeBytes) {
      chosenBytes = inPlaceResult!.bytes;
      methodUsed = 'in-place';
    } else {
      // Neither method could reduce the size (document is already minimal)
      chosenBytes = new Uint8Array(arrayBuffer);
    }
  }

  onProgress?.({
    step: 'compiling',
    message: 'Finalizing compressed document...',
    percentage: 95,
  });

  const compressedSizeBytes = chosenBytes ? chosenBytes.length : originalSizeBytes;
  const sizeReducedBytes = originalSizeBytes - compressedSizeBytes;
  const reductionPercentage =
    originalSizeBytes > 0 && sizeReducedBytes > 0
      ? ((originalSizeBytes - compressedSizeBytes) / originalSizeBytes) * 100
      : 0;
  const isSmaller = sizeReducedBytes > 0 && reductionPercentage >= 0.5;

  let explanation = '';
  if (isSmaller) {
    if (methodUsed === 'rendered') {
      explanation = `Successfully reduced file size by ${reductionPercentage.toFixed(
        1
      )}% (${formatBytes(
        sizeReducedBytes
      )} saved) by optimizing scanned/page image streams and compacting PDF structures.`;
    } else if (imagesOptimizedCount > 0) {
      explanation = `Successfully reduced file size by ${reductionPercentage.toFixed(
        1
      )}% (${formatBytes(
        sizeReducedBytes
      )} saved) by optimizing ${imagesOptimizedCount} embedded image(s) and compacting object streams.`;
    } else {
      explanation = `Successfully reduced file size by ${reductionPercentage.toFixed(
        1
      )}% (${formatBytes(
        sizeReducedBytes
      )} saved) by compacting PDF object streams and structure.`;
    }
  } else {
    explanation =
      'This document is already highly optimized. Re-encoding could not achieve a smaller file size without degrading document content.';
  }

  // Construct filename
  let outName = (
    options.customFilename ||
    `${file.name.replace(/\.[^/.]+$/, '')}-compressed`
  ).trim();
  if (!outName.toLowerCase().endsWith('.pdf')) {
    outName += '.pdf';
  }

  const finalBuffer = chosenBytes
    ? chosenBytes.buffer.slice(
        chosenBytes.byteOffset,
        chosenBytes.byteOffset + chosenBytes.byteLength
      )
    : arrayBuffer;

  const blob = new Blob([finalBuffer as ArrayBuffer], {
    type: 'application/pdf',
  });
  const blobUrl = URL.createObjectURL(blob);

  onProgress?.({
    step: 'completed',
    message: 'PDF compression completed!',
    percentage: 100,
  });

  return {
    blob,
    blobUrl,
    filename: outName,
    originalSizeBytes,
    compressedSizeBytes,
    sizeReducedBytes: Math.max(0, sizeReducedBytes),
    reductionPercentage: parseFloat(reductionPercentage.toFixed(1)),
    isSmaller,
    pageCount,
    imagesOptimizedCount,
    explanation,
  };
}
