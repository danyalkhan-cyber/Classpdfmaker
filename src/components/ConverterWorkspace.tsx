import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  AlertCircle,
  Plus,
  ArrowRight,
  ShieldCheck,
  Download
} from 'lucide-react';
import { UploadDropzone } from './UploadDropzone';
import { ImageList } from './ImageList';
import { PdfSettingsPanel } from './PdfSettingsPanel';
import { AdPlacement } from './AdPlacement';
import { UploadedImage, PdfSettings } from '../types';

interface ConverterWorkspaceProps {
  images: UploadedImage[];
  settings: PdfSettings;
  onImagesAdded: (newImages: UploadedImage[]) => void;
  onRemoveImage: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onRotateImage: (id: string) => void;
  onPreviewImage: (image: UploadedImage) => void;
  onReorderImages: (startIndex: number, endIndex: number) => void;
  onClearAllImages: () => void;
  onUpdateSettings: (settings: PdfSettings) => void;
  onResetSettings: () => void;
  onStartConversion: () => void;
  isConverting: boolean;
  showAds?: boolean;
}

export const ConverterWorkspace: React.FC<ConverterWorkspaceProps> = ({
  images,
  settings,
  onImagesAdded,
  onRemoveImage,
  onMoveUp,
  onMoveDown,
  onRotateImage,
  onPreviewImage,
  onReorderImages,
  onClearAllImages,
  onUpdateSettings,
  onResetSettings,
  onStartConversion,
  isConverting,
  showAds = true,
}) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleConvertClick = () => {
    setValidationError(null);
    if (images.length === 0) {
      setValidationError('Please upload at least one image before converting to PDF.');
      return;
    }
    if (!settings.filename.trim()) {
      setValidationError('Please enter a valid PDF filename (e.g. Computer_Network_Assignment.pdf).');
      return;
    }
    onStartConversion();
  };

  const totalImageBytes = images.reduce((acc, img) => acc + img.size, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Reserved Top Ad Placement */}
      <AdPlacement slotType="leaderboard" slotId="workspace-top-leaderboard" showAds={showAds} />

      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Image to PDF Converter
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Organize handwritten notes, configure page layout, and compile your document
          </p>
        </div>

        {images.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleConvertClick}
              disabled={isConverting}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 active:bg-sky-700 rounded-xl shadow-md shadow-sky-600/30 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isConverting ? 'Processing PDF...' : `Convert ${images.length} Images to PDF`}</span>
            </button>
          </div>
        )}
      </div>

      {validationError && (
        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs rounded-xl flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Main Grid: Left is Images & Upload, Right is PDF Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Queue & Dropzone */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {images.length === 0 ? (
            <div className="space-y-4">
              <UploadDropzone
                onImagesAdded={onImagesAdded}
                currentCount={images.length}
              />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Compact dropzone to add more pages */}
              <UploadDropzone
                onImagesAdded={onImagesAdded}
                currentCount={images.length}
                isCompact
              />

              {/* Image List with drag/drop, rotate, remove */}
              <ImageList
                images={images}
                onRemove={onRemoveImage}
                onMoveUp={onMoveUp}
                onMoveDown={onMoveDown}
                onRotate={onRotateImage}
                onPreview={onPreviewImage}
                onReorder={onReorderImages}
                onClearAll={onClearAllImages}
              />
            </div>
          )}
        </div>

        {/* Right Column: PDF Customization Panel & Action Button */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-20">
          <PdfSettingsPanel
            settings={settings}
            onChange={onUpdateSettings}
            onReset={onResetSettings}
            imageCount={images.length}
            totalImageBytes={totalImageBytes}
          />

          {images.length > 0 && (
            <button
              type="button"
              onClick={handleConvertClick}
              disabled={isConverting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 active:bg-sky-700 rounded-2xl shadow-lg shadow-sky-600/30 transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>Convert to PDF</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {/* Reserved Sidebar Ad Placement */}
          <AdPlacement slotType="rectangle" slotId="workspace-sidebar" showAds={showAds} />
        </div>
      </div>
    </div>
  );
};
