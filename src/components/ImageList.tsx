import React from 'react';
import {
  Trash2,
  RotateCw,
  ChevronUp,
  ChevronDown,
  Eye,
  GripVertical,
  CheckCircle2,
  Crop,
  Sliders
} from 'lucide-react';
import { UploadedImage } from '../types';

interface ImageListProps {
  images: UploadedImage[];
  onRemove: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onRotate: (id: string) => void;
  onPreview: (image: UploadedImage) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
  onClearAll: () => void;
}

export const ImageList: React.FC<ImageListProps> = ({
  images,
  onRemove,
  onMoveUp,
  onMoveDown,
  onRotate,
  onPreview,
  onReorder,
  onClearAll,
}) => {
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      onReorder(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const totalBytes = images.reduce((sum, img) => sum + img.size, 0);

  return (
    <div className="w-full space-y-4">
      {/* List Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Page Order & Image Queue
          </h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
            {images.length} {images.length === 1 ? 'Page' : 'Pages'}
          </span>
          <span className="text-xs text-slate-500 font-mono tabular-nums">
            ({formatSize(totalBytes)})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        Reorder pages by dragging cards or clicking the Up / Down arrows. Each image corresponds to a page in the generated PDF.
      </p>

      {/* Grid of Image Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {images.map((image, index) => {
          const isDragging = draggedIndex === index;
          const displayWidth = (image.rotation % 180 === 90) ? image.height : image.width;
          const displayHeight = (image.rotation % 180 === 90) ? image.width : image.height;

          return (
            <div
              key={image.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`group relative bg-white dark:bg-slate-900 rounded-xl border transition-all duration-150 flex flex-col overflow-hidden ${
                isDragging
                  ? 'opacity-40 border-sky-500 scale-95 shadow-inner'
                  : 'border-slate-200/80 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 hover:shadow-md'
              }`}
            >
              {/* Card Top: Page badge & Reorder handle */}
              <div className="p-2.5 pb-1 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <div
                    className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                    title="Drag to reorder"
                  >
                    <GripVertical className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    Page {index + 1}
                  </span>
                </div>

                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => onMoveUp(index)}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Move page up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === images.length - 1}
                    onClick={() => onMoveDown(index)}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Move page down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Image Thumbnail Container */}
              <div
                className="relative mx-2.5 my-1.5 aspect-[3/4] bg-slate-100 dark:bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer border border-slate-200/50 dark:border-slate-800/80"
                onClick={() => onPreview(image)}
                title="Click to view full preview"
              >
                <img
                  src={image.dataUrl}
                  alt={image.name}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain transition-transform duration-200"
                  style={{
                    transform: `rotate(${image.rotation}deg)`,
                  }}
                />

                {/* Hover overlay with action icons */}
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreview(image);
                    }}
                    className="p-2 bg-white/90 text-slate-900 hover:bg-white rounded-full shadow-md hover:scale-105 transition-transform"
                    title="Inspect Note Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRotate(image.id);
                    }}
                    className="p-2 bg-white/90 text-slate-900 hover:bg-white rounded-full shadow-md hover:scale-105 transition-transform"
                    title="Rotate 90° Clockwise"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(image.id);
                    }}
                    className="p-2 bg-rose-600 text-white hover:bg-rose-500 rounded-full shadow-md hover:scale-105 transition-transform"
                    title="Remove this page"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {image.rotation > 0 && (
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 text-[10px] font-mono bg-slate-900/70 text-white rounded">
                    {image.rotation}°
                  </span>
                )}
              </div>

              {/* Card Bottom: File Info & Quick Toolbar */}
              <div className="p-2.5 pt-1 mt-auto">
                <p className="text-xs font-medium text-slate-800 dark:text-slate-100 truncate" title={image.name}>
                  {image.name}
                </p>
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 font-mono tabular-nums">
                  <span>{displayWidth}×{displayHeight}px</span>
                  <span>{formatSize(image.size)}</span>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onPreview(image)}
                    className="inline-flex items-center gap-1 text-[11px] text-sky-600 dark:text-sky-400 hover:text-sky-700 py-0.5 px-1 rounded hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-colors font-medium"
                    title="Crop, adjust brightness, contrast, and document scan filters"
                  >
                    <Sliders className="w-3 h-3" />
                    <span>Crop & Filter</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onRotate(image.id)}
                      className="inline-flex items-center gap-0.5 text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-800 py-0.5 px-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Rotate 90° Clockwise"
                    >
                      <RotateCw className="w-3 h-3" />
                      <span>Rotate</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onRemove(image.id)}
                      className="inline-flex items-center text-[11px] text-rose-500 hover:text-rose-700 py-0.5 px-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Remove image"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
