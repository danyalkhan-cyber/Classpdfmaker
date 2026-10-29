import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Crop,
  Sliders,
  Sparkles,
  Check,
  Undo2,
  Sun,
  Contrast as ContrastIcon,
  Layers,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { UploadedImage } from '../types';
import { applyFiltersAndCrop, FilterOptions, CropRect } from '../utils/imageEditor';

interface ImagePreviewModalProps {
  image: UploadedImage | null;
  onClose: () => void;
  onRotate?: (id: string) => void;
  onSaveImage?: (updated: UploadedImage) => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  image,
  onClose,
  onRotate,
  onSaveImage,
}) => {
  const [activeTab, setActiveTab] = useState<'view' | 'crop' | 'filter'>('view');
  const [zoom, setZoom] = useState(1);

  // Filters state
  const [brightness, setBrightness] = useState<number>(0);
  const [contrast, setContrast] = useState<number>(0);
  const [preset, setPreset] = useState<FilterOptions['preset']>('original');

  // Crop state (percentages 0-100)
  const [cropRect, setCropRect] = useState<CropRect>({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });
  const [aspectRatioPreset, setAspectRatioPreset] = useState<'free' | '1:1' | '4:3' | '3:4' | 'a4'>('free');

  // Preview state
  const [previewDataUrl, setPreviewDataUrl] = useState<string>('');
  const [isApplying, setIsApplying] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  // Working image data URL (which might have been cropped or filtered)
  const [currentDataUrl, setCurrentDataUrl] = useState<string>('');
  const [originalDataUrl, setOriginalDataUrl] = useState<string>('');

  // Dragging crop box
  const cropContainerRef = useRef<HTMLDivElement>(null);
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const [dragStart, setDragStart] = useState<{ mouseX: number; mouseY: number; startX: number; startY: number } | null>(null);

  useEffect(() => {
    if (image) {
      const orig = image.originalDataUrl || image.dataUrl;
      setOriginalDataUrl(orig);
      setCurrentDataUrl(image.dataUrl);
      setPreviewDataUrl(image.dataUrl);
      setBrightness(image.brightness || 0);
      setContrast(image.contrast || 0);
      setPreset((image.preset as FilterOptions['preset']) || 'original');
      setCropRect({ x: 0, y: 0, width: 100, height: 100 });
      setZoom(1);
      setActiveTab('view');
    }
  }, [image]);

  if (!image) return null;

  // Re-generate filtered preview when filter values change
  const updateFilterPreview = async (
    b: number = brightness,
    c: number = contrast,
    p: FilterOptions['preset'] = preset
  ) => {
    try {
      const result = await applyFiltersAndCrop(currentDataUrl, {
        brightness: b,
        contrast: c,
        preset: p,
      });
      setPreviewDataUrl(result.dataUrl);
    } catch {
      // Fallback
    }
  };

  const handleBrightnessChange = (val: number) => {
    setBrightness(val);
    updateFilterPreview(val, contrast, preset);
  };

  const handleContrastChange = (val: number) => {
    setContrast(val);
    updateFilterPreview(brightness, val, preset);
  };

  const handlePresetSelect = (selected: FilterOptions['preset']) => {
    setPreset(selected);
    let newB = brightness;
    let newC = contrast;
    if (selected === 'clean_scan') {
      newB = 10;
      newC = 35;
    } else if (selected === 'magic_color') {
      newB = 10;
      newC = 25;
    } else if (selected === 'original') {
      newB = 0;
      newC = 0;
    }
    setBrightness(newB);
    setContrast(newC);
    updateFilterPreview(newB, newC, selected);
  };

  // Crop Presets
  const applyPresetMargins = (marginPercent: number) => {
    setCropRect({
      x: marginPercent,
      y: marginPercent,
      width: 100 - marginPercent * 2,
      height: 100 - marginPercent * 2,
    });
  };

  const applyCropRatio = (ratio: 'free' | '1:1' | '4:3' | '3:4' | 'a4') => {
    setAspectRatioPreset(ratio);
    if (ratio === 'free') {
      setCropRect({ x: 0, y: 0, width: 100, height: 100 });
      return;
    }

    let targetRatio = 1; // W / H
    if (ratio === '1:1') targetRatio = 1;
    if (ratio === '4:3') targetRatio = 4 / 3;
    if (ratio === '3:4') targetRatio = 3 / 4;
    if (ratio === 'a4') targetRatio = 1 / 1.414; // A4 portrait

    const imageAspect = image.width / image.height;
    if (targetRatio > imageAspect) {
      // Clamp width to 100%, reduce height
      const h = Math.round((100 / targetRatio) * imageAspect);
      const y = Math.round((100 - h) / 2);
      setCropRect({ x: 0, y, width: 100, height: h });
    } else {
      // Clamp height to 100%, reduce width
      const w = Math.round((100 * targetRatio) / imageAspect);
      const x = Math.round((100 - w) / 2);
      setCropRect({ x, y: 0, width: w, height: 100 });
    }
  };

  // Execute Crop
  const handleExecuteCrop = async () => {
    setIsApplying(true);
    try {
      const result = await applyFiltersAndCrop(
        currentDataUrl,
        { brightness: 0, contrast: 0, preset: 'original' },
        cropRect
      );
      setCurrentDataUrl(result.dataUrl);
      setPreviewDataUrl(result.dataUrl);
      setCropRect({ x: 0, y: 0, width: 100, height: 100 });
      setActiveTab('view');
    } finally {
      setIsApplying(false);
    }
  };

  // Save all changes to the parent page item
  const handleSaveChanges = async () => {
    if (!onSaveImage) return;
    setIsApplying(true);
    try {
      const finalResult = await applyFiltersAndCrop(
        currentDataUrl,
        { brightness, contrast, preset }
      );

      const updated: UploadedImage = {
        ...image,
        dataUrl: finalResult.dataUrl,
        originalDataUrl: originalDataUrl || image.dataUrl,
        width: finalResult.width,
        height: finalResult.height,
        size: finalResult.sizeBytes,
        brightness,
        contrast,
        preset,
      };

      onSaveImage(updated);
      setSavedFeedback(true);
      setTimeout(() => {
        setSavedFeedback(false);
        onClose();
      }, 700);
    } finally {
      setIsApplying(false);
    }
  };

  // Revert back to original
  const handleRevertAll = () => {
    setCurrentDataUrl(originalDataUrl);
    setPreviewDataUrl(originalDataUrl);
    setBrightness(0);
    setContrast(0);
    setPreset('original');
    setCropRect({ x: 0, y: 0, width: 100, height: 100 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-5xl max-h-[94vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 gap-3 shrink-0">
          <div className="truncate">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {image.name}
              </h3>
              {savedFeedback && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md">
                  <Check className="w-3 h-3" /> Saved!
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              {image.width} × {image.height} px · {(image.size / 1024).toFixed(1)} KB · {image.rotation}° rotation
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('view')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'view'
                  ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Inspect</span>
            </button>
            <button
              onClick={() => setActiveTab('crop')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'crop'
                  ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Crop className="w-3.5 h-3.5" />
              <span>Crop Tool</span>
            </button>
            <button
              onClick={() => setActiveTab('filter')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'filter'
                  ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Brightness & Filters</span>
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1 shrink-0">
            {onRotate && (
              <button
                onClick={() => onRotate(image.id)}
                className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Rotate 90°"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Center Viewport */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[360px] sm:min-h-[460px]">
          {/* Main Visual Canvas Area (9 cols on large screen) */}
          <div className="lg:col-span-8 xl:col-span-9 bg-slate-100/90 dark:bg-slate-950/90 relative flex items-center justify-center p-4 overflow-auto">
            {activeTab === 'crop' ? (
              /* Crop Area with interactive bounding box */
              <div
                ref={cropContainerRef}
                className="relative max-w-full max-h-[60vh] select-none"
              >
                <img
                  src={currentDataUrl}
                  alt={image.name}
                  referrerPolicy="no-referrer"
                  className="max-h-[60vh] max-w-full object-contain pointer-events-none rounded"
                />

                {/* Dark Mask for uncropped areas */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.65)',
                    clipPath: `polygon(
                      0% 0%, 100% 0%, 100% 100%, 0% 100%,
                      0% ${cropRect.y}%,
                      ${cropRect.x}% ${cropRect.y}%,
                      ${cropRect.x}% ${cropRect.y + cropRect.height}%,
                      ${cropRect.x + cropRect.width}% ${cropRect.y + cropRect.height}%,
                      ${cropRect.x + cropRect.width}% ${cropRect.y}%,
                      0% ${cropRect.y}%
                    )`,
                  }}
                />

                {/* Crop Box Frame with 8 handles */}
                <div
                  className="absolute border-2 border-sky-400 bg-sky-500/10 cursor-move"
                  style={{
                    left: `${cropRect.x}%`,
                    top: `${cropRect.y}%`,
                    width: `${cropRect.width}%`,
                    height: `${cropRect.height}%`,
                  }}
                >
                  {/* Grid lines inside crop box */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                    <div className="border-r border-b border-sky-300/30" />
                    <div className="border-r border-b border-sky-300/30" />
                    <div className="border-b border-sky-300/30" />
                    <div className="border-r border-b border-sky-300/30" />
                    <div className="border-r border-b border-sky-300/30" />
                    <div className="border-b border-sky-300/30" />
                    <div className="border-r border-sky-300/30" />
                    <div className="border-r border-sky-300/30" />
                    <div />
                  </div>

                  {/* Corner indicator dots */}
                  <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-sky-500 rounded-xs" />
                  <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-sky-500 rounded-xs" />
                  <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-sky-500 rounded-xs" />
                  <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-sky-500 rounded-xs" />
                </div>
              </div>
            ) : (
              /* Normal / Filter Preview Viewport */
              <div
                className="transition-transform duration-200 origin-center max-w-full max-h-full flex items-center justify-center"
                style={{
                  transform: `scale(${zoom}) rotate(${image.rotation}deg)`,
                }}
              >
                <img
                  src={previewDataUrl || currentDataUrl}
                  alt={image.name}
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-md"
                />
              </div>
            )}

            {/* Zoom pill in view mode */}
            {activeTab === 'view' && (
              <div className="absolute bottom-4 left-4 flex items-center gap-1 p-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-md">
                <button
                  onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                  className="p-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-300 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Zoom out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-mono w-12 text-center text-slate-700 dark:text-slate-300">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                  className="p-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-300 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Zoom in"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoom(1)}
                  className="px-2 py-1 text-[11px] text-slate-500 hover:text-slate-900 rounded"
                >
                  Reset
                </button>
              </div>
            )}
          </div>

          {/* Right Editing Panel (3 cols on large screen) */}
          <div className="lg:col-span-4 xl:col-span-3 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900 overflow-y-auto space-y-6">
            {activeTab === 'crop' && (
              /* Crop Controls */
              <div className="space-y-5">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Crop Preset Ratios
                  </h4>
                  <div className="grid grid-cols-3 gap-1.5 mt-2">
                    {(
                      [
                        { id: 'free', label: 'Freeform' },
                        { id: '1:1', label: '1:1 Square' },
                        { id: '4:3', label: '4:3 Photo' },
                        { id: '3:4', label: '3:4 Portrait' },
                        { id: 'a4', label: 'A4 Page' },
                      ] as const
                    ).map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => applyCropRatio(r.id)}
                        className={`py-1.5 px-2 text-xs font-medium rounded-lg border transition-all ${
                          aspectRatioPreset === r.id
                            ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Quick Desk Trim
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Remove background edges from desk or table
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => applyPresetMargins(5)}
                      className="py-1.5 px-3 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      Trim 5% Margins
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPresetMargins(10)}
                      className="py-1.5 px-3 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      Trim 10% Margins
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleExecuteCrop}
                    disabled={isApplying}
                    className="w-full py-2.5 px-4 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Crop className="w-3.5 h-3.5" />
                    <span>Apply Crop Section</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'filter' && (
              /* Filter & Brightness Controls */
              <div className="space-y-6">
                {/* Document Enhancer Presets */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Document Presets
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      type="button"
                      onClick={() => handlePresetSelect('clean_scan')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        preset === 'clean_scan'
                          ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-200 ring-1 ring-sky-500'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xs font-bold flex items-center justify-between">
                        <span>Clean Scan (B&W High Contrast)</span>
                        <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Whitens grey notebook paper, darkens pencil and pen ink.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePresetSelect('magic_color')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        preset === 'magic_color'
                          ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-200 ring-1 ring-sky-500'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xs font-bold flex items-center justify-between">
                        <span>Magic Color (Enhanced Ink)</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Boosts colored diagrams, highlighters, and charts.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePresetSelect('grayscale')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        preset === 'grayscale'
                          ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-200 ring-1 ring-sky-500'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xs font-bold">Grayscale</div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Neutralizes yellow desk lamp cast.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePresetSelect('original')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        preset === 'original' && brightness === 0 && contrast === 0
                          ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-200 ring-1 ring-sky-500'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xs font-bold">Original Natural Photo</div>
                    </button>
                  </div>
                </div>

                {/* Brightness Slider */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      <span>Brightness</span>
                    </label>
                    <span className="text-xs font-mono text-slate-500 tabular-nums">
                      {brightness > 0 ? `+${brightness}` : brightness}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={-60}
                    max={60}
                    value={brightness}
                    onChange={(e) => handleBrightnessChange(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>

                {/* Contrast Slider */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <ContrastIcon className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Contrast</span>
                    </label>
                    <span className="text-xs font-mono text-slate-500 tabular-nums">
                      {contrast > 0 ? `+${contrast}` : contrast}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={-50}
                    max={80}
                    value={contrast}
                    onChange={(e) => handleContrastChange(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {activeTab === 'view' && (
              /* View / Inspect details */
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Note Page Metadata
                  </h4>
                  <div className="space-y-1 text-[11px] text-slate-500 font-mono">
                    <p>Filename: {image.name}</p>
                    <p>Width: {image.width}px</p>
                    <p>Height: {image.height}px</p>
                    <p>Rotation: {image.rotation}°</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleRevertAll}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Revert to Raw Photo</span>
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>

            {onSaveImage && (
              <button
                type="button"
                onClick={handleSaveChanges}
                disabled={isApplying}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-6 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 active:bg-sky-700 rounded-xl shadow-xs transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save to PDF Queue</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
