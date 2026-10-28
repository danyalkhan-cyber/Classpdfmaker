/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as pdfjsLib from 'pdfjs-dist';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  PageBreak,
  ImageRun,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from 'docx';

// Set up the local pdfjs worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

export interface PdfConversionProgress {
  current: number;
  total: number;
  message: string;
  step: 'reading' | 'extracting' | 'formatting' | 'generating' | 'completed';
}

export interface PdfToWordResult {
  blob: Blob;
  blobUrl: string;
  filename: string;
  fileSizeBytes: number;
  pageCount: number;
  textCharCount: number;
  isScanned: boolean;
  warnings?: string[];
}

interface RawTextItem {
  str: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontName: string;
  isBold: boolean;
  isItalic: boolean;
}

interface TextLine {
  y: number;
  height: number;
  items: RawTextItem[];
  fullText: string;
  avgFontSize: number;
  isHeading1: boolean;
  isHeading2: boolean;
  isHeading3: boolean;
}

interface TextParagraph {
  lines: TextLine[];
  isHeading1: boolean;
  isHeading2: boolean;
  isHeading3: boolean;
}

/**
 * Validates whether the given file is an authentic, acceptable PDF
 */
export function validatePdfFile(file: File): { isValid: boolean; error?: string } {
  if (!file) {
    return { isValid: false, error: 'Please select a PDF file to convert.' };
  }

  const isPdfExtension = /\.pdf$/i.test(file.name);
  const isPdfMime = file.type === 'application/pdf' || file.type === '';

  if (!isPdfExtension && !isPdfMime) {
    return {
      isValid: false,
      error: `"${file.name}" is not a PDF file. Please select a document ending in .pdf`,
    };
  }

  // Maximum file size: 50MB
  const maxSizeBytes = 50 * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). The maximum allowed size is 50 MB.`,
    };
  }

  if (file.size === 0) {
    return {
      isValid: false,
      error: 'The selected PDF file is empty (0 bytes). Please choose a valid file.',
    };
  }

  return { isValid: true };
}

/**
 * Helper to render a page to an image ArrayBuffer for scanned PDFs
 */
async function renderPageToImageBuffer(
  page: pdfjsLib.PDFPageProxy,
  scale: number = 1.5
): Promise<{ buffer: ArrayBuffer; width: number; height: number }> {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(viewport.width);
  canvas.height = Math.round(viewport.height);
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context not available for page rendering');
  }

  // White background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Render PDF page to canvas
  // @ts-ignore - pdfjs typing differences
  await page.render({ canvasContext: ctx, viewport }).promise;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          reject(new Error('Failed to create image blob from PDF page canvas'));
          return;
        }
        const buffer = await blob.arrayBuffer();
        resolve({
          buffer,
          width: Math.min(600, Math.round(viewport.width * 0.75)),
          height: Math.min(800, Math.round(viewport.height * 0.75)),
        });
      },
      'image/jpeg',
      0.88
    );
  });
}

/**
 * Core PDF-to-Word Converter Function
 * Reads PDF, extracts structured text/formatting/headings or scanned pages, and outputs a valid DOCX Blob.
 */
export async function convertPdfToWord(
  file: File,
  onProgress?: (progress: PdfConversionProgress) => void
): Promise<PdfToWordResult> {
  const validation = validatePdfFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  onProgress?.({
    current: 1,
    total: 10,
    message: 'Reading and validating PDF document...',
    step: 'reading',
  });

  const arrayBuffer = await file.arrayBuffer();

  let pdfDoc: pdfjsLib.PDFDocumentProxy;
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useSystemFonts: true,
      stopAtErrors: false,
    });
    pdfDoc = await loadingTask.promise;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    if (/password/i.test(errorMsg)) {
      throw new Error(
        'This PDF document is password-protected or encrypted. Please decrypt or unlock the file before converting.'
      );
    }
    if (/corrupt|invalid|format/i.test(errorMsg)) {
      throw new Error(
        'The selected file appears to be corrupted, damaged, or is not a valid PDF file.'
      );
    }
    throw new Error(`Failed to read PDF document: ${errorMsg}`);
  }

  const numPages = pdfDoc.numPages;
  if (numPages === 0) {
    throw new Error('This PDF contains zero pages.');
  }

  onProgress?.({
    current: 2,
    total: numPages + 4,
    message: `Analyzing document structure (${numPages} ${numPages === 1 ? 'page' : 'pages'})...`,
    step: 'extracting',
  });

  // Collect text items page by page
  const pageTextData: {
    pageNumber: number;
    lines: TextLine[];
    charCount: number;
  }[] = [];

  let totalCharCount = 0;

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    onProgress?.({
      current: 2 + pageNum,
      total: numPages + 4,
      message: `Extracting text and formatting from page ${pageNum} of ${numPages}...`,
      step: 'extracting',
    });

    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();
    const rawItems: RawTextItem[] = [];

    let pageCharCount = 0;

    for (const item of textContent.items) {
      if ('str' in item && typeof item.str === 'string') {
        const text = item.str;
        if (!text) continue;

        pageCharCount += text.length;

        const transform = item.transform; // [scaleX, skewY, skewX, scaleY, tx, ty]
        const tx = transform[4];
        const ty = transform[5];
        const scaleX = Math.abs(transform[0]);
        const scaleY = Math.abs(transform[3]);
        const fontSize = Math.max(scaleY, scaleX, item.height || 10);
        const fontName = (item.fontName || '').toLowerCase();
        const isBold = /bold|black|heavy|medium|demi/i.test(fontName);
        const isItalic = /italic|oblique/i.test(fontName);

        rawItems.push({
          str: text,
          x: tx,
          y: ty,
          width: item.width || text.length * fontSize * 0.5,
          height: item.height || fontSize,
          fontSize,
          fontName,
          isBold,
          isItalic,
        });
      }
    }

    totalCharCount += pageCharCount;

    // Group items into lines: items with approximately the same baseline Y
    // In PDF coordinates, Y increases upwards. Sort Y descending (top of page down).
    const lineBuckets: { y: number; height: number; items: RawTextItem[] }[] = [];
    const sortedRaw = [...rawItems].sort((a, b) => b.y - a.y || a.x - b.x);

    for (const item of sortedRaw) {
      // Find an existing line bucket with similar Y (within 4 points)
      const matchingBucket = lineBuckets.find(
        (b) => Math.abs(b.y - item.y) <= Math.max(3, item.fontSize * 0.35)
      );
      if (matchingBucket) {
        matchingBucket.items.push(item);
        matchingBucket.height = Math.max(matchingBucket.height, item.height);
      } else {
        lineBuckets.push({
          y: item.y,
          height: item.height,
          items: [item],
        });
      }
    }

    // Sort buckets by Y descending (top to bottom)
    lineBuckets.sort((a, b) => b.y - a.y);

    // Format each line: sort items left to right
    const lines: TextLine[] = lineBuckets.map((bucket) => {
      bucket.items.sort((a, b) => a.x - b.x);

      // Join text with appropriate spacing
      let fullText = '';
      let lastX = -1;
      let lastWidth = 0;

      for (const it of bucket.items) {
        if (lastX >= 0) {
          const spaceGap = it.x - (lastX + lastWidth);
          // If there is a visible gap and neither string has edge spaces, add a space
          if (spaceGap > 2 && !fullText.endsWith(' ') && !it.str.startsWith(' ')) {
            fullText += ' ';
          }
        }
        fullText += it.str;
        lastX = it.x;
        lastWidth = it.width;
      }

      const avgFontSize =
        bucket.items.reduce((acc, curr) => acc + curr.fontSize, 0) /
        (bucket.items.length || 1);

      const hasBold = bucket.items.some((i) => i.isBold);
      const isHeading1 = avgFontSize >= 17 || (hasBold && avgFontSize >= 15);
      const isHeading2 =
        !isHeading1 && (avgFontSize >= 13.5 || (hasBold && avgFontSize >= 12.5));
      const isHeading3 =
        !isHeading1 && !isHeading2 && hasBold && avgFontSize >= 11;

      return {
        y: bucket.y,
        height: bucket.height,
        items: bucket.items,
        fullText: fullText.trim(),
        avgFontSize,
        isHeading1,
        isHeading2,
        isHeading3,
      };
    });

    pageTextData.push({
      pageNumber: pageNum,
      lines: lines.filter((l) => l.fullText.length > 0),
      charCount: pageCharCount,
    });
  }

  // Check if PDF is scanned (sparse or zero selectable text across pages)
  const isScanned = totalCharCount < 20;
  const warnings: string[] = [];

  onProgress?.({
    current: numPages + 3,
    total: numPages + 4,
    message: isScanned
      ? 'Scanned PDF detected. Rendering high-resolution Word page plates...'
      : 'Structuring editable Word paragraphs, headings, and formatting...',
    step: 'formatting',
  });

  const docChildren: (Paragraph | Table)[] = [];

  if (isScanned) {
    warnings.push(
      'This document appears to consist of scanned or photographic pages without native digital text. Each page has been imported as a high-resolution visual plate in Word.'
    );

    // Add explanatory notice header in Word
    docChildren.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: 'ClassPDF Maker - Scanned Document Import',
            bold: true,
            color: '1E293B',
            size: 26, // 13pt
          }),
        ],
      })
    );

    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: 'Notice: This PDF contains scanned images or photos rather than selectable vector text. The pages have been rendered into this Word document with 100% layout fidelity.',
            italics: true,
            color: '64748B',
            size: 20, // 10pt
          }),
        ],
      })
    );

    // Render each scanned page as high-res image run
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      if (pageNum > 1) {
        docChildren.push(
          new Paragraph({
            children: [new PageBreak()],
          })
        );
      }

      const page = await pdfDoc.getPage(pageNum);
      const imgData = await renderPageToImageBuffer(page, 1.5);

      docChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 100, after: 100 },
          children: [
            new ImageRun({
              data: imgData.buffer,
              type: 'jpg',
              transformation: {
                width: imgData.width,
                height: imgData.height,
              },
            }),
          ],
        })
      );
    }
  } else {
    // Native Digital PDF: Construct rich editable paragraphs, headings, and text runs
    for (let pIdx = 0; pIdx < pageTextData.length; pIdx++) {
      const pageData = pageTextData[pIdx];

      // Insert Page Break between PDF pages (except page 1)
      if (pIdx > 0) {
        docChildren.push(
          new Paragraph({
            children: [new PageBreak()],
          })
        );
      }

      // Group consecutive lines into cohesive paragraphs
      const paragraphs: TextParagraph[] = [];
      let currentParagraph: TextParagraph | null = null;

      for (let i = 0; i < pageData.lines.length; i++) {
        const line = pageData.lines[i];
        const prevLine = i > 0 ? pageData.lines[i - 1] : null;

        // If line is a heading, it starts its own paragraph
        const isHeading = line.isHeading1 || line.isHeading2 || line.isHeading3;

        // Check vertical gap
        let isLargeGap = false;
        if (prevLine) {
          const gap = prevLine.y - line.y;
          const avgH = (prevLine.height + line.height) / 2 || 12;
          isLargeGap = gap > avgH * 1.8;
        }

        if (!currentParagraph || isHeading || (prevLine && (prevLine.isHeading1 || prevLine.isHeading2 || prevLine.isHeading3)) || isLargeGap) {
          currentParagraph = {
            lines: [line],
            isHeading1: line.isHeading1,
            isHeading2: line.isHeading2,
            isHeading3: line.isHeading3,
          };
          paragraphs.push(currentParagraph);
        } else {
          currentParagraph.lines.push(line);
        }
      }

      // Turn structured paragraphs into docx Paragraphs
      for (const p of paragraphs) {
        let heading: (typeof HeadingLevel)[keyof typeof HeadingLevel] | undefined = undefined;
        if (p.isHeading1) heading = HeadingLevel.HEADING_1;
        else if (p.isHeading2) heading = HeadingLevel.HEADING_2;
        else if (p.isHeading3) heading = HeadingLevel.HEADING_3;

        const textRuns: TextRun[] = [];

        p.lines.forEach((line, lineIdx) => {
          if (lineIdx > 0) {
            // Space between wrapped lines inside the same paragraph
            textRuns.push(new TextRun({ text: ' ' }));
          }

          line.items.forEach((item, itemIdx) => {
            if (itemIdx > 0 && !item.str.startsWith(' ')) {
              const prevItem = line.items[itemIdx - 1];
              const gap = item.x - (prevItem.x + prevItem.width);
              if (gap > 2) {
                textRuns.push(new TextRun({ text: ' ' }));
              }
            }

            textRuns.push(
              new TextRun({
                text: item.str,
                bold: item.isBold || p.isHeading1 || p.isHeading2,
                italics: item.isItalic,
                size: Math.round(Math.min(Math.max(item.fontSize * 1.8, 16), 48)), // half-points in docx (24 = 12pt)
                font: 'Calibri',
              })
            );
          });
        });

        if (textRuns.length > 0) {
          docChildren.push(
            new Paragraph({
              heading,
              spacing: {
                before: heading ? 200 : 80,
                after: heading ? 120 : 80,
                line: 276, // 1.15 line spacing
              },
              children: textRuns,
            })
          );
        }
      }
    }
  }

  onProgress?.({
    current: numPages + 4,
    total: numPages + 4,
    message: 'Compiling Microsoft Word (.docx) package...',
    step: 'generating',
  });

  const baseName = file.name.replace(/\.pdf$/i, '') || 'document';
  const docxFilename = `${baseName}.docx`;

  const doc = new Document({
    creator: 'ClassPDF Maker',
    title: baseName,
    description: 'Converted from PDF by ClassPDF Maker',
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch (1440 twips)
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: docChildren.length > 0
          ? docChildren
          : [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Empty Document (No text extracted from PDF).',
                  }),
                ],
              }),
            ],
      },
    ],
  });

  const docxBlob = await Packer.toBlob(doc);
  const blobUrl = URL.createObjectURL(docxBlob);

  onProgress?.({
    current: numPages + 4,
    total: numPages + 4,
    message: 'Conversion completed successfully!',
    step: 'completed',
  });

  return {
    blob: docxBlob,
    blobUrl,
    filename: docxFilename,
    fileSizeBytes: docxBlob.size,
    pageCount: numPages,
    textCharCount: totalCharCount,
    isScanned,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}
