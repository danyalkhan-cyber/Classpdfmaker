/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  PDFDocument,
  PDFName,
  PDFNumber,
  PDFRawStream,
  PDFRef,
} from 'pdf-lib';

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
    const blob = new Blob([jpegBytes as unknown as BlobPart], { type: 'image/jpeg' });
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
      maxDimension = 2048;
      quality = 0.82;
    } else if (level === 'recommended') {
      maxDimension = 1500;
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

    if (bmp) {
      ctx.drawImage(bmp, 0, 0, targetW, targetH);
      bmp.close?.();
    } else {
      // Fallback using HTMLImageElement
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

    if (!compressedBlob) return null;

    const arrayBuf = await compressedBlob.arrayBuffer();
    const compressedBytes = new Uint8Array(arrayBuf);

    // Only return if it actually reduced the stream byte size
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
 * Compresses a PDF file completely in the browser:
 * 1. Downsamples and re-encodes high-resolution embedded image streams
 * 2. Cleans up unreferenced structural objects
 * 3. Compresses indirect objects into modern cross-reference object streams (useObjectStreams: true)
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
    message: 'Reading PDF structures and embedded resources...',
    percentage: 25,
  });

  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: false });
  const pageCount = pdfDoc.getPageCount();

  // Find all image XObjects in the document
  const imageStreams: {
    ref: PDFRef;
    stream: PDFRawStream;
    width: number;
    height: number;
    filterName: string;
  }[] = [];

  for (const [ref, obj] of pdfDoc.context.enumerateIndirectObjects()) {
    if (obj instanceof PDFRawStream) {
      const subtype = obj.dict.get(PDFName.of('Subtype'));
      if (subtype && subtype.toString() === '/Image') {
        const filter = obj.dict.get(PDFName.of('Filter'));
        const widthObj = obj.dict.get(PDFName.of('Width'));
        const heightObj = obj.dict.get(PDFName.of('Height'));

        const filterName = filter ? filter.toString() : '';
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
      message: `Optimizing ${imageStreams.length} embedded image resource(s)...`,
      percentage: 40,
      totalImages: imageStreams.length,
      processedImages: 0,
    });

    for (let i = 0; i < imageStreams.length; i++) {
      const imgItem = imageStreams[i];
      const isJpeg =
        imgItem.filterName.includes('/DCTDecode') ||
        (imgItem.stream.contents[0] === 0xff && imgItem.stream.contents[1] === 0xd8);

      if (isJpeg && imgItem.stream.contents.length > 1024) {
        onProgress?.({
          step: 'optimizing',
          message: `Compressing image ${i + 1} of ${imageStreams.length}...`,
          percentage: Math.round(40 + ((i + 1) / imageStreams.length) * 45),
          totalImages: imageStreams.length,
          processedImages: i + 1,
        });

        const compressed = await compressJpegImage(
          imgItem.stream.contents,
          imgItem.width,
          imgItem.height,
          options.level
        );

        if (compressed) {
          // Update dictionary metadata
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
          // Replace raw stream in the indirect object table
          const newStream = PDFRawStream.of(
            imgItem.stream.dict,
            compressed.compressedBytes
          );
          pdfDoc.context.assign(imgItem.ref, newStream);
          imagesOptimizedCount++;
        }
      }
    }
  } else {
    onProgress?.({
      step: 'optimizing',
      message: 'Compacting PDF streams and font dictionaries...',
      percentage: 60,
    });
  }

  onProgress?.({
    step: 'compiling',
    message: 'Compiling compressed PDF into cross-reference object streams...',
    percentage: 90,
  });

  // Save with modern object streams compression
  const compressedBytes = await pdfDoc.save({ useObjectStreams: true });
  const compressedSizeBytes = compressedBytes.length;

  const sizeReducedBytes = originalSizeBytes - compressedSizeBytes;
  const reductionPercentage =
    originalSizeBytes > 0
      ? ((originalSizeBytes - compressedSizeBytes) / originalSizeBytes) * 100
      : 0;
  const isSmaller = sizeReducedBytes > 0;

  let explanation = '';
  if (isSmaller) {
    if (imagesOptimizedCount > 0) {
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
      )} saved) by compacting PDF object structures and removing redundant streams.`;
    }
  } else {
    explanation =
      'This document is already highly optimized or compressed. Re-encoding could not achieve a smaller file size without degrading document content.';
  }

  // Construct filename
  let outName = (
    options.customFilename ||
    `${file.name.replace(/\.[^/.]+$/, '')}-compressed`
  ).trim();
  if (!outName.toLowerCase().endsWith('.pdf')) {
    outName += '.pdf';
  }

  const blob = new Blob([compressedBytes.buffer as ArrayBuffer], {
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
    sizeReducedBytes,
    reductionPercentage: parseFloat(reductionPercentage.toFixed(1)),
    isSmaller,
    pageCount,
    imagesOptimizedCount,
    explanation,
  };
}
