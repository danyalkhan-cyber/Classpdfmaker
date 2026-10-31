export type PageSize = 'a4' | 'letter' | 'original';
export type PageOrientation = 'portrait' | 'landscape' | 'auto';
export type PageMargin = 'none' | 'small' | 'normal';
export type ImageFitting = 'contain' | 'cover' | 'fill';
export type ImageQuality = 'standard' | 'high' | 'custom';
export type ImagesPerPage = 1 | 2 | 4;

export interface UploadedImage {
  id: string;
  file?: File;
  name: string;
  size: number;
  type: string;
  dataUrl: string;
  originalDataUrl?: string;
  width: number;
  height: number;
  rotation: number; // 0, 90, 180, 270
  brightness?: number; // -100 to 100
  contrast?: number; // -100 to 100
  preset?: string;
}

export interface PdfSettings {
  pageSize: PageSize;
  orientation: PageOrientation;
  margin: PageMargin;
  fitting: ImageFitting;
  quality: ImageQuality;
  qualityPercent: number; // 40 to 100 (e.g. 70, 80, 90)
  imagesPerPage: ImagesPerPage;
  filename: string;
  backgroundColor: string;
  addPageNumbers: boolean;
  addHeader?: boolean;
  studentName?: string;
  courseTitle?: string;
}

export interface ConversionHistoryItem {
  id: string;
  filename: string;
  pageCount: number;
  fileSizeBytes: number;
  createdAt: string;
  pageSize: string;
  orientation: string;
  imagesCount: number;
  previewDataUrl?: string;
  blobUrl?: string;
}
