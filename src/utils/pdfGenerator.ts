import { jsPDF } from 'jspdf';
import { UploadedImage, PdfSettings, ImageFitting, ImageQuality } from '../types';

/**
 * Creates an HTMLCanvasElement with the image rotated by the specified angle
 */
function getRotatedImageData(image: UploadedImage, qualitySetting: ImageQuality, qualityPercent?: number): Promise<{ dataUrl: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const origWidth = img.naturalWidth || img.width;
      const origHeight = img.naturalHeight || img.height;
      const angle = (image.rotation % 360 + 360) % 360;
      const is90or270 = angle === 90 || angle === 270;
      
      const targetWidth = is90or270 ? origHeight : origWidth;
      const targetHeight = is90or270 ? origWidth : origHeight;

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas 2D context not available'));
        return;
      }

      // Draw white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      // Apply rotation transformation
      ctx.save();
      ctx.translate(targetWidth / 2, targetHeight / 2);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.drawImage(img, -origWidth / 2, -origHeight / 2);
      ctx.restore();

      let quality = 0.85;
      if (qualityPercent !== undefined && !isNaN(qualityPercent)) {
        quality = Math.max(0.3, Math.min(1.0, qualityPercent / 100));
      } else if (qualitySetting === 'high') {
        quality = 0.95;
      }

      const mimeType = (image.type === 'image/png' && quality >= 0.99) ? 'image/png' : 'image/jpeg';
      const rotatedDataUrl = canvas.toDataURL(mimeType, quality);

      resolve({
        dataUrl: rotatedDataUrl,
        width: targetWidth,
        height: targetHeight,
      });
    };
    img.onerror = () => {
      reject(new Error(`Failed to load image: ${image.name}`));
    };
    img.src = image.dataUrl;
  });
}

export interface GenerationResult {
  blob: Blob;
  blobUrl: string;
  pageCount: number;
  fileSizeBytes: number;
}

export async function generatePdfFromImages(
  images: UploadedImage[],
  settings: PdfSettings,
  onProgress?: (current: number, total: number, message: string) => void
): Promise<GenerationResult> {
  if (images.length === 0) {
    throw new Error('No images selected for conversion.');
  }

  const total = images.length;
  onProgress?.(0, total, 'Preparing images and document...');

  // Standard sizes in millimeters [width, height] in portrait
  const standardDimensions: Record<'a4' | 'letter', [number, number]> = {
    a4: [210, 297],
    letter: [215.9, 279.4],
  };

  const marginValues: Record<'none' | 'small' | 'normal', number> = {
    none: 0,
    small: 8,
    normal: 16,
  };

  const isNoneMargin = settings.margin === 'none';
  const marginMm = isNoneMargin ? 0 : (marginValues[settings.margin] ?? 8);
  const imagesPerPage = settings.imagesPerPage;

  // Process all images to handle rotation and quality
  const processedImages: Array<{ dataUrl: string; width: number; height: number; originalName: string }> = [];

  for (let i = 0; i < images.length; i++) {
    onProgress?.(i + 1, total, `Processing image ${i + 1} of ${total}: ${images[i].name}...`);
    const processed = await getRotatedImageData(images[i], settings.quality, settings.qualityPercent);
    processedImages.push({
      ...processed,
      originalName: images[i].name,
    });
  }

  onProgress?.(total, total, 'Composing PDF pages...');

  let doc: jsPDF | null = null;
  let pageCount = 0;

  // Chunk images according to imagesPerPage
  const pagesData: Array<typeof processedImages> = [];
  for (let i = 0; i < processedImages.length; i += imagesPerPage) {
    pagesData.push(processedImages.slice(i, i + imagesPerPage));
  }

  for (let pageIdx = 0; pageIdx < pagesData.length; pageIdx++) {
    const pageImgs = pagesData[pageIdx];

    // Determine page width and height in mm
    let pageWidthMm = 210;
    let pageHeightMm = 297;
    let pageOrientation: 'portrait' | 'landscape' = 'portrait';

    if (settings.pageSize === 'original') {
      // In original size mode, base dimension on the first image on this page (72 DPI ~ 0.352778 mm/px)
      const pxToMm = 25.4 / 96; // 96 DPI CSS standard
      pageWidthMm = Math.max(50, pageImgs[0].width * pxToMm);
      pageHeightMm = Math.max(50, pageImgs[0].height * pxToMm);
      pageOrientation = pageWidthMm >= pageHeightMm ? 'landscape' : 'portrait';
    } else {
      const baseDims = standardDimensions[settings.pageSize];
      if (settings.orientation === 'portrait') {
        pageWidthMm = baseDims[0];
        pageHeightMm = baseDims[1];
        pageOrientation = 'portrait';
      } else if (settings.orientation === 'landscape') {
        pageWidthMm = baseDims[1];
        pageHeightMm = baseDims[0];
        pageOrientation = 'landscape';
      } else {
        // Automatic orientation based on the first image's aspect ratio
        const isWide = pageImgs[0].width > pageImgs[0].height;
        if (isWide) {
          pageWidthMm = baseDims[1];
          pageHeightMm = baseDims[0];
          pageOrientation = 'landscape';
        } else {
          pageWidthMm = baseDims[0];
          pageHeightMm = baseDims[1];
          pageOrientation = 'portrait';
        }
      }
    }

    // Initialize document on first page or add page
    if (!doc) {
      doc = new jsPDF({
        orientation: pageOrientation,
        unit: 'mm',
        format: settings.pageSize === 'original' ? [pageWidthMm, pageHeightMm] : settings.pageSize,
        compress: true,
      });
    } else {
      doc.addPage(
        settings.pageSize === 'original' ? [pageWidthMm, pageHeightMm] : settings.pageSize,
        pageOrientation
      );
    }
    pageCount++;

    // Optional student header (only if explicitly enabled with non-empty info)
    let topReservedMm = marginMm;
    if (settings.addHeader && (settings.studentName?.trim() || settings.courseTitle?.trim())) {
      topReservedMm = Math.max(marginMm, 10);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139); // Slate-500
      
      const headerText = [
        settings.studentName ? settings.studentName.trim() : '',
        settings.courseTitle ? settings.courseTitle.trim() : '',
        new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
      ].filter(Boolean).join('  ·  ');

      const headerX = marginMm > 0 ? marginMm : 6;
      doc.text(headerText, headerX, 6);
      
      // Hairline divider
      doc.setDrawColor(226, 232, 240); // Slate-200
      doc.setLineWidth(0.2);
      doc.line(headerX, 8, pageWidthMm - headerX, 8);
    }

    // For None margin, exactly 0 on all four sides. For Small and Normal, equal margin on all four sides.
    const bottomReservedMm = marginMm;

    // Available drawing area
    const availableWidth = Math.max(10, pageWidthMm - marginMm * 2);
    const availableHeight = Math.max(10, pageHeightMm - topReservedMm - bottomReservedMm);

    // Compute grid layout for images on this page
    if (pageImgs.length === 1) {
      const img = pageImgs[0];
      drawImageInSlot(doc, img, marginMm, topReservedMm, availableWidth, availableHeight, settings.fitting);
    } else if (pageImgs.length === 2) {
      // 2 images: split vertically or horizontally based on page orientation
      const gap = marginMm === 0 ? 0 : 4;
      if (pageOrientation === 'portrait') {
        const slotHeight = (availableHeight - gap) / 2;
        drawImageInSlot(doc, pageImgs[0], marginMm, topReservedMm, availableWidth, slotHeight, settings.fitting);
        drawImageInSlot(doc, pageImgs[1], marginMm, topReservedMm + slotHeight + gap, availableWidth, slotHeight, settings.fitting);
      } else {
        const slotWidth = (availableWidth - gap) / 2;
        drawImageInSlot(doc, pageImgs[0], marginMm, topReservedMm, slotWidth, availableHeight, settings.fitting);
        drawImageInSlot(doc, pageImgs[1], marginMm + slotWidth + gap, topReservedMm, slotWidth, availableHeight, settings.fitting);
      }
    } else if (pageImgs.length === 3 || pageImgs.length === 4) {
      // 2x2 grid
      const gap = marginMm === 0 ? 0 : 4;
      const slotWidth = (availableWidth - gap) / 2;
      const slotHeight = (availableHeight - gap) / 2;

      drawImageInSlot(doc, pageImgs[0], marginMm, topReservedMm, slotWidth, slotHeight, settings.fitting);
      drawImageInSlot(doc, pageImgs[1], marginMm + slotWidth + gap, topReservedMm, slotWidth, slotHeight, settings.fitting);
      if (pageImgs[2]) {
        drawImageInSlot(doc, pageImgs[2], marginMm, topReservedMm + slotHeight + gap, slotWidth, slotHeight, settings.fitting);
      }
      if (pageImgs[3]) {
        drawImageInSlot(doc, pageImgs[3], marginMm + slotWidth + gap, topReservedMm + slotHeight + gap, slotWidth, slotHeight, settings.fitting);
      }
    }

    // Add page numbering if enabled
    if (settings.addPageNumbers) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184); // Slate-400
      const footerText = `Page ${pageCount} of ${pagesData.length}`;
      const textWidth = doc.getTextWidth(footerText);
      const footerY = marginMm > 0 
        ? pageHeightMm - (marginMm / 2) + 1 
        : pageHeightMm - 2.5;
      doc.text(footerText, (pageWidthMm - textWidth) / 2, footerY);
    }
  }

  if (!doc) {
    throw new Error('PDF document could not be initialized.');
  }

  const pdfBlob = doc.output('blob');
  const blobUrl = URL.createObjectURL(pdfBlob);

  return {
    blob: pdfBlob,
    blobUrl,
    pageCount,
    fileSizeBytes: pdfBlob.size,
  };
}

/**
 * Calculates correct position and dimensions to fit an image into a bounding box
 */
function drawImageInSlot(
  doc: jsPDF,
  img: { dataUrl: string; width: number; height: number },
  slotX: number,
  slotY: number,
  slotW: number,
  slotH: number,
  fitting: ImageFitting
) {
  const imgAspect = img.width / img.height;
  const slotAspect = slotW / slotH;

  let drawW = slotW;
  let drawH = slotH;
  let drawX = slotX;
  let drawY = slotY;

  if (fitting === 'contain') {
    if (imgAspect > slotAspect) {
      // Image is wider than slot: clamp width, scale height
      drawW = slotW;
      drawH = slotW / imgAspect;
      drawY = slotY + (slotH - drawH) / 2;
    } else {
      // Image is taller than slot: clamp height, scale width
      drawH = slotH;
      drawW = slotH * imgAspect;
      drawX = slotX + (slotW - drawW) / 2;
    }
  } else if (fitting === 'cover') {
    // Fill the slot, keeping aspect ratio
    if (imgAspect > slotAspect) {
      drawH = slotH;
      drawW = slotH * imgAspect;
      drawX = slotX + (slotW - drawW) / 2;
    } else {
      drawW = slotW;
      drawH = slotW / imgAspect;
      drawY = slotY + (slotH - drawH) / 2;
    }
  }
  // If fitting === 'fill', it uses full slotW and slotH directly

  const format = img.dataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG';
  doc.addImage(img.dataUrl, format, drawX, drawY, drawW, drawH, undefined, 'FAST');
}
