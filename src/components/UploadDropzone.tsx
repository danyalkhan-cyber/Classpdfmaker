import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, ShieldCheck, AlertCircle, FileCheck2, Sparkles, Plus } from 'lucide-react';
import { UploadedImage } from '../types';
import { createSampleNotes } from '../utils/sampleNotes';

interface UploadDropzoneProps {
  onImagesAdded: (newImages: UploadedImage[]) => void;
  currentCount: number;
  maxCount?: number;
  maxSizeBytes?: number; // default 25MB
  isCompact?: boolean;
}

const SUPPORTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB per image
const MAX_TOTAL_IMAGES = 100;

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  onImagesAdded,
  currentCount,
  maxCount = MAX_TOTAL_IMAGES,
  maxSizeBytes = MAX_FILE_SIZE,
  isCompact = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoadingSamples, setIsLoadingSamples] = useState(false);

  const processFiles = async (fileList: FileList | File[]) => {
    setErrorMessage(null);
    const files = Array.from(fileList);

    if (files.length === 0) return;

    if (currentCount + files.length > maxCount) {
      setErrorMessage(`Limit exceeded: You can upload a maximum of ${maxCount} images in one PDF. You currently have ${currentCount}.`);
      return;
    }

    const validImages: UploadedImage[] = [];
    const errors: string[] = [];

    for (const file of files) {
      // Validate file type
      if (!SUPPORTED_TYPES.includes(file.type.toLowerCase()) && !/\.(jpe?g|png|webp)$/i.test(file.name)) {
        errors.push(`"${file.name}" is not a supported format (JPG, PNG, WEBP only).`);
        continue;
      }

      // Validate file size
      if (file.size > maxSizeBytes) {
        errors.push(`"${file.name}" is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max size is 25MB.`);
        continue;
      }

      try {
        const imageItem = await readFileAsImage(file);
        validImages.push(imageItem);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Corrupted or unreadable image file';
        errors.push(`Could not read "${file.name}": ${msg}`);
      }
    }

    if (errors.length > 0) {
      setErrorMessage(errors.join(' '));
    }

    if (validImages.length > 0) {
      onImagesAdded(validImages);
    }
  };

  const readFileAsImage = (file: File): Promise<UploadedImage> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const img = new Image();
        img.onload = () => {
          resolve({
            id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            file,
            name: file.name,
            size: file.size,
            type: file.type || 'image/jpeg',
            dataUrl,
            width: img.width,
            height: img.height,
            rotation: 0,
          });
        };
        img.onerror = () => {
          reject(new Error('Corrupted or invalid image data'));
        };
        img.src = dataUrl;
      };
      reader.onerror = () => {
        reject(new Error('Failed to read file from disk'));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer?.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
      // Reset input value so re-uploading the same file works
      e.target.value = '';
    }
  };

  const handleLoadSamples = async () => {
    setIsLoadingSamples(true);
    try {
      const sampleNotes = await createSampleNotes();
      onImagesAdded(sampleNotes);
    } finally {
      setIsLoadingSamples(false);
    }
  };

  if (isCompact) {
    return (
      <div className="w-full">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleFileInputChange}
        />
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex items-center justify-between p-4 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
            isDragOver
              ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
              : 'border-slate-300 dark:border-[#232B45] bg-white dark:bg-[#171D32] hover:border-indigo-500/70 hover:bg-slate-50 dark:hover:bg-[#1C243E]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-[#F8FAFC]">
                Add more note photos or scanned pages
              </p>
              <p className="text-xs text-slate-500 dark:text-[#A7B0C5]">
                Drag and drop here, or browse files (JPG, PNG, WEBP up to 25MB)
              </p>
            </div>
          </div>
          <button
            type="button"
            className="px-3.5 py-1.5 text-xs font-semibold text-indigo-600 dark:text-[#22D3EE] bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-500/30 rounded-lg hover:bg-indigo-100 transition-colors whitespace-nowrap"
          >
            Browse Images
          </button>
        </div>

        {errorMessage && (
          <div className="mt-3 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-3xl border-2 border-dashed p-8 md:p-12 text-center transition-all ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/40 scale-[1.01]'
            : 'border-slate-300/90 dark:border-[#232B45] bg-white dark:bg-[#171D32] hover:border-indigo-500/70 hover:bg-slate-50/80 dark:hover:bg-[#1B233C] shadow-sm'
        }`}
      >
        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 shadow-xs">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-[#F8FAFC] mb-2">
            Drag & drop assignment photos here
          </h3>
          <p className="text-sm text-slate-600 dark:text-[#A7B0C5] mb-6 leading-relaxed">
            Upload pictures of handwritten notes, assignments, scanned textbook pages, or study flashcards to combine into a high-quality PDF.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 active:scale-[0.98] rounded-xl shadow-md shadow-indigo-600/25 transition-all hover:scale-[1.02]"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Upload Images</span>
            </button>

            <button
              type="button"
              onClick={handleLoadSamples}
              disabled={isLoadingSamples}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-[#F8FAFC] bg-slate-100 dark:bg-[#111827] hover:bg-slate-200 dark:hover:bg-[#1E2640] rounded-xl border border-slate-200/90 dark:border-[#232B45] transition-all"
            >
              <Sparkles className="w-4 h-4 text-indigo-500 dark:text-[#22D3EE]" />
              <span>{isLoadingSamples ? 'Loading...' : 'Try Sample Notes'}</span>
            </button>
          </div>

          {/* Formats and constraints */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-[#A7B0C5]">
            <span className="flex items-center gap-1">
              <FileCheck2 className="w-3.5 h-3.5 text-indigo-500 dark:text-[#22D3EE]" />
              JPG, JPEG, PNG, WEBP
            </span>
            <span aria-hidden="true">·</span>
            <span>Up to 25 MB per photo</span>
            <span aria-hidden="true">·</span>
            <span>Up to 100 images per PDF</span>
          </div>
        </div>
      </div>

      {/* Error feedback banner */}
      {errorMessage && (
        <div className="mt-4 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-200 text-xs rounded-xl flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-500" />
          <div className="flex-1 leading-normal">{errorMessage}</div>
        </div>
      )}

      {/* Privacy Notice Card */}
      <div className="mt-4 p-3.5 rounded-xl bg-slate-100/70 dark:bg-[#111827]/70 border border-slate-200/80 dark:border-[#232B45] flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 mt-0.5 text-indigo-600 dark:text-[#22D3EE] shrink-0" />
        <div className="text-xs text-slate-600 dark:text-[#A7B0C5] leading-relaxed">
          <span className="font-semibold text-slate-800 dark:text-[#F8FAFC]">100% In-Browser Privacy:</span>{' '}
          All photos, notebook pages, and PDFs are converted directly on your device. Your assignments and personal notes are never uploaded to any remote server or stored in third-party clouds.
        </div>
      </div>
    </div>
  );
};
