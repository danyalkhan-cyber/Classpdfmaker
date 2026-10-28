export interface FilterOptions {
  brightness: number; // -100 to 100, default 0
  contrast: number; // -100 to 100, default 0
  preset: 'original' | 'clean_scan' | 'magic_color' | 'grayscale' | 'chalkboard';
}

export interface CropRect {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
}

/**
 * Applies filters (brightness, contrast, and document presets) to an image
 * and returns the processed dataUrl and dimensions.
 */
export async function applyFiltersAndCrop(
  sourceDataUrl: string,
  filterOpts: FilterOptions,
  cropRect?: CropRect
): Promise<{ dataUrl: string; width: number; height: number; sizeBytes: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const origW = img.naturalWidth || img.width;
        const origH = img.naturalHeight || img.height;

        // Calculate crop bounds in source pixels
        let sx = 0;
        let sy = 0;
        let sw = origW;
        let sh = origH;

        if (cropRect) {
          sx = Math.max(0, Math.min(origW - 10, (cropRect.x / 100) * origW));
          sy = Math.max(0, Math.min(origH - 10, (cropRect.y / 100) * origH));
          sw = Math.max(10, Math.min(origW - sx, (cropRect.width / 100) * origW));
          sh = Math.max(10, Math.min(origH - sy, (cropRect.height / 100) * origH));
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.round(sw);
        canvas.height = Math.round(sh);
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Canvas 2D context unavailable'));
          return;
        }

        // Apply CSS filters on context
        let cssFilterParts: string[] = [];

        // Brightness: 0 -> 100%, 50 -> 150%, -50 -> 50%
        const brightnessPct = 100 + filterOpts.brightness;
        cssFilterParts.push(`brightness(${Math.max(0, brightnessPct)}%)`);

        // Contrast: 0 -> 100%, 50 -> 150%, -50 -> 50%
        const contrastPct = 100 + filterOpts.contrast;
        cssFilterParts.push(`contrast(${Math.max(0, contrastPct)}%)`);

        if (filterOpts.preset === 'grayscale') {
          cssFilterParts.push('grayscale(100%)');
        } else if (filterOpts.preset === 'clean_scan') {
          // B&W scan look: high contrast, slight brightness boost, full grayscale
          cssFilterParts.push('grayscale(100%)');
          cssFilterParts.push('contrast(160%)');
          cssFilterParts.push('brightness(110%)');
        } else if (filterOpts.preset === 'magic_color') {
          // Vibrance for handwriting ink (blue/red ballpoint pens)
          cssFilterParts.push('contrast(125%)');
          cssFilterParts.push('saturate(140%)');
          cssFilterParts.push('brightness(105%)');
        } else if (filterOpts.preset === 'chalkboard') {
          cssFilterParts.push('invert(100%)');
          cssFilterParts.push('contrast(120%)');
        }

        ctx.filter = cssFilterParts.join(' ');

        // Draw cropped section
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);

        // Optional post-processing for Clean Scan to whiten paper backgrounds
        if (filterOpts.preset === 'clean_scan') {
          try {
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imgData.data;
            for (let i = 0; i < data.length; i += 4) {
              const r = data[i];
              const g = data[i + 1];
              const b = data[i + 2];
              const lum = 0.299 * r + 0.587 * g + 0.114 * b;
              
              // Thresholding: whiten light-grey paper, darken ink
              if (lum > 185) {
                data[i] = 255;
                data[i + 1] = 255;
                data[i + 2] = 255;
              } else if (lum < 110) {
                data[i] = Math.max(0, r - 30);
                data[i + 1] = Math.max(0, g - 30);
                data[i + 2] = Math.max(0, b - 30);
              }
            }
            ctx.putImageData(imgData, 0, 0);
          } catch {
            // Ignore if cross-origin restrictions apply
          }
        }

        const resultDataUrl = canvas.toDataURL('image/jpeg', 0.92);
        const approxSize = Math.round((resultDataUrl.length * 3) / 4);

        resolve({
          dataUrl: resultDataUrl,
          width: canvas.width,
          height: canvas.height,
          sizeBytes: approxSize,
        });
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error('Failed to load image for editing'));
    img.src = sourceDataUrl;
  });
}
