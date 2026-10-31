import React, { useState } from 'react';
import {
  Settings2,
  RotateCcw,
  FileCheck,
  FileText,
  Layout,
  Maximize2,
  Sliders,
  Sparkles,
  Info,
  Eye,
  SplitSquareVertical,
  CheckCircle2
} from 'lucide-react';
import { PdfSettings, PageSize, PageOrientation, PageMargin, ImageFitting, ImageQuality, ImagesPerPage, UploadedImage } from '../types';
import { QualityPreviewModal } from './QualityPreviewModal';

interface PdfSettingsPanelProps {
  settings: PdfSettings;
  onChange: (updated: PdfSettings) => void;
  onReset: () => void;
  imageCount: number;
  totalImageBytes: number;
  images?: UploadedImage[];
}

export const PdfSettingsPanel: React.FC<PdfSettingsPanelProps> = ({
  settings,
  onChange,
  onReset,
  imageCount,
  totalImageBytes,
  images = [],
}) => {
  const [showFidelityModal, setShowFidelityModal] = useState<boolean>(false);

  const updateSetting = <K extends keyof PdfSettings>(key: K, value: PdfSettings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  const currentQualityPct = settings.qualityPercent ?? (settings.quality === 'high' ? 95 : 85);

  const handleSliderChange = (newPercent: number) => {
    onChange({
      ...settings,
      qualityPercent: newPercent,
      quality: newPercent >= 90 ? 'high' : 'standard',
    });
  };

  // Real-time dynamic estimation of PDF output size based on quality slider
  const estimatePdfSize = () => {
    if (imageCount === 0) return '0 KB';
    // Compression curve factor
    const qFactor = Math.max(0.18, Math.min(0.95, (currentQualityPct / 100) * 0.72 + 0.12));
    const estimated = totalImageBytes * qFactor + 8000;
    if (estimated < 1024 * 1024) {
      return `~${Math.round(estimated / 1024)} KB`;
    }
    return `~${(estimated / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Estimated savings
  const estimatedSavingsPct = Math.max(10, Math.min(85, Math.round((1 - ((currentQualityPct / 100) * 0.72 + 0.12)) * 100)));

  return (
    <div className="bg-white dark:bg-[#171D32] rounded-3xl border border-slate-200/80 dark:border-[#232B45] p-5 md:p-6 space-y-6">
      {/* Title & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#232B45]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/40 flex items-center justify-center">
            <Settings2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#F8FAFC]">
              PDF Document Customization
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#A7B0C5]">
              Format pages for university assignment guidelines
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-500 dark:text-[#A7B0C5] hover:text-slate-800 dark:hover:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-[#1E2640] rounded-lg transition-colors cursor-pointer"
          title="Reset to default settings"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Filename input */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-[#A7B0C5] mb-1.5">
          PDF Filename
        </label>
        <div className="relative">
          <input
            type="text"
            value={settings.filename}
            onChange={(e) => updateSetting('filename', e.target.value)}
            placeholder="Computer_Network_Assignment.pdf"
            className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#232B45] rounded-xl text-slate-900 dark:text-[#F8FAFC] placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 font-mono"
          />
          <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-mono pointer-events-none">
            .pdf
          </span>
        </div>
      </div>

      {/* Grid of Standard Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Page Size */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-[#A7B0C5] mb-1.5">
            Page Size
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-[#111827] border border-slate-200/50 dark:border-[#232B45] rounded-xl">
            {(
              [
                { id: 'a4', label: 'A4' },
                { id: 'letter', label: 'Letter' },
                { id: 'original', label: 'Original' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => updateSetting('pageSize', opt.id as PageSize)}
                className={`py-1.5 px-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  settings.pageSize === opt.id
                    ? 'bg-white dark:bg-[#171D32] text-indigo-600 dark:text-cyan-400 shadow-xs border border-slate-200/60 dark:border-[#232B45]'
                    : 'text-slate-600 dark:text-[#A7B0C5] hover:text-slate-900 dark:hover:text-[#F8FAFC]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
            {settings.pageSize === 'a4'
              ? 'Standard European / Global academic paper (210 × 297 mm)'
              : settings.pageSize === 'letter'
              ? 'North American standard format (8.5 × 11 in)'
              : 'Auto-adapts to exact pixel dimensions of each note'}
          </p>
        </div>

        {/* Orientation */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-[#A7B0C5] mb-1.5">
            Orientation
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-[#111827] border border-slate-200/50 dark:border-[#232B45] rounded-xl">
            {(
              [
                { id: 'portrait', label: 'Portrait' },
                { id: 'landscape', label: 'Landscape' },
                { id: 'auto', label: 'Auto' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => updateSetting('orientation', opt.id as PageOrientation)}
                className={`py-1.5 px-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  settings.orientation === opt.id
                    ? 'bg-white dark:bg-[#171D32] text-indigo-600 dark:text-cyan-400 shadow-xs border border-slate-200/60 dark:border-[#232B45]'
                    : 'text-slate-600 dark:text-[#A7B0C5] hover:text-slate-900 dark:hover:text-[#F8FAFC]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
            {settings.orientation === 'auto'
              ? 'Detects vertical vs horizontal photos per page'
              : `${settings.orientation} layout for all pages`}
          </p>
        </div>

        {/* Margins */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-[#A7B0C5] mb-1.5">
            Margins
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-[#111827] border border-slate-200/50 dark:border-[#232B45] rounded-xl">
            {(
              [
                { id: 'none', label: 'None' },
                { id: 'small', label: 'Small' },
                { id: 'normal', label: 'Normal' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => updateSetting('margin', opt.id as PageMargin)}
                className={`py-1.5 px-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  settings.margin === opt.id
                    ? 'bg-white dark:bg-[#171D32] text-indigo-600 dark:text-cyan-400 shadow-xs border border-slate-200/60 dark:border-[#232B45]'
                    : 'text-slate-600 dark:text-[#A7B0C5] hover:text-slate-900 dark:hover:text-[#F8FAFC]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
            {settings.margin === 'none'
              ? 'Edge-to-edge full bleed'
              : settings.margin === 'small'
              ? '8mm clean margin'
              : '16mm academic binding margin'}
          </p>
        </div>

        {/* Image Fitting */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-[#A7B0C5] mb-1.5">
            Image Fitting
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-[#111827] border border-slate-200/50 dark:border-[#232B45] rounded-xl">
            {(
              [
                { id: 'contain', label: 'Fit Page' },
                { id: 'cover', label: 'Cover' },
                { id: 'fill', label: 'Stretch' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => updateSetting('fitting', opt.id as ImageFitting)}
                className={`py-1.5 px-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  settings.fitting === opt.id
                    ? 'bg-white dark:bg-[#171D32] text-indigo-600 dark:text-cyan-400 shadow-xs border border-slate-200/60 dark:border-[#232B45]'
                    : 'text-slate-600 dark:text-[#A7B0C5] hover:text-slate-900 dark:hover:text-[#F8FAFC]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
            Fit Page preserves aspect ratio and prevents any cropping.
          </p>
        </div>

        {/* Real-Time Image Quality & Compression Slider */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-700 dark:text-[#A7B0C5]">
              Image Quality &amp; Compression
            </label>

            <button
              type="button"
              onClick={() => setShowFidelityModal(true)}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-bold text-indigo-600 dark:text-[#22D3EE] bg-indigo-50 dark:bg-cyan-950/60 border border-indigo-200 dark:border-cyan-800/60 rounded-lg hover:bg-indigo-100 dark:hover:bg-cyan-900/60 transition-colors cursor-pointer"
              title="Open real-time visual fidelity and compression inspector"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Fidelity</span>
            </button>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-[#111827] border border-slate-200/80 dark:border-[#232B45] rounded-2xl space-y-2.5">
            {/* Level indicator & status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black font-mono text-indigo-600 dark:text-[#22D3EE]">
                  {currentQualityPct}%
                </span>
                <span className="text-xs text-slate-500 dark:text-[#A7B0C5]">
                  Quality
                </span>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  currentQualityPct >= 95
                    ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700/60'
                    : currentQualityPct >= 85
                    ? 'text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/60 border-cyan-300 dark:border-cyan-700/60'
                    : currentQualityPct >= 75
                    ? 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-700/60'
                    : 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700/60'
                }`}
              >
                {currentQualityPct >= 95
                  ? 'Max Sharpness'
                  : currentQualityPct >= 85
                  ? 'Crisp Notes'
                  : currentQualityPct >= 75
                  ? 'Balanced'
                  : 'High Compression'}
              </span>
            </div>

            {/* Range Slider */}
            <div className="space-y-1">
              <input
                type="range"
                min="40"
                max="100"
                step="1"
                value={currentQualityPct}
                onChange={(e) => handleSliderChange(Number(e.target.value))}
                aria-label="Image compression quality slider"
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-[#22D3EE] focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>40% (Small Size)</span>
                <span>70%</span>
                <span>85%</span>
                <span>100% (Lossless)</span>
              </div>
            </div>

            {/* Quick Presets (70%, 80%, 90%, 95%) */}
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[
                { val: 70, label: '70%' },
                { val: 80, label: '80%' },
                { val: 90, label: '90%' },
                { val: 95, label: '95%' },
              ].map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => handleSliderChange(p.val)}
                  className={`py-1 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer ${
                    currentQualityPct === p.val
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs'
                      : 'bg-white dark:bg-[#171D32] text-slate-600 dark:text-[#A7B0C5] border-slate-200 dark:border-[#232B45] hover:text-slate-900 dark:hover:text-[#F8FAFC]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Visual Fidelity Inspector Trigger */}
            <button
              type="button"
              onClick={() => setShowFidelityModal(true)}
              className="w-full py-2 px-3 rounded-xl bg-indigo-50/70 hover:bg-indigo-100 dark:bg-[#171D32] dark:hover:bg-[#1E2640] border border-indigo-200/80 dark:border-[#232B45] text-indigo-700 dark:text-[#22D3EE] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span>Inspect Visual Fidelity (Live Before vs After)</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            {currentQualityPct >= 90
              ? 'Preserves fine mathematical equations, subscripts, and detailed handwriting.'
              : currentQualityPct >= 75
              ? 'Optimal balance of clear text readability with ~60% smaller file size.'
              : 'Maximum compression for portals with strict <5MB upload limits.'}
          </p>
        </div>

        {/* Images per Page */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-[#A7B0C5] mb-1.5">
            Images per PDF Page
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-[#111827] border border-slate-200/50 dark:border-[#232B45] rounded-xl">
            {(
              [
                { id: 1, label: '1 (Default)' },
                { id: 2, label: '2 Pages' },
                { id: 4, label: '4 (Grid)' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => updateSetting('imagesPerPage', opt.id as ImagesPerPage)}
                className={`py-1.5 px-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  settings.imagesPerPage === opt.id
                    ? 'bg-white dark:bg-[#171D32] text-indigo-600 dark:text-cyan-400 shadow-xs border border-slate-200/60 dark:border-[#232B45]'
                    : 'text-slate-600 dark:text-[#A7B0C5] hover:text-slate-900 dark:hover:text-[#F8FAFC]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
            {settings.imagesPerPage === 1 ? '1 image per page' : `Compact multi-page layout (${settings.imagesPerPage} per sheet)`}
          </p>
        </div>
      </div>

      {/* Page Numbering Option */}
      <div className="pt-4 border-t border-slate-100 dark:border-[#232B45]">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={settings.addPageNumbers}
            onChange={(e) => updateSetting('addPageNumbers', e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded border-slate-300 dark:border-[#232B45] focus:ring-indigo-500"
          />
          <span className="text-xs font-medium text-slate-700 dark:text-[#A7B0C5]">
            Add "Page X of Y" Footer
          </span>
        </label>
      </div>

      {/* Summary Footer bar */}
      <div className="pt-3 border-t border-slate-100 dark:border-[#232B45] flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-[#A7B0C5] font-mono">
        <div className="flex items-center gap-3">
          <span>Target pages: {Math.ceil(imageCount / settings.imagesPerPage) || 0}</span>
          <span aria-hidden="true">·</span>
          <span>Estimated size: {estimatePdfSize()}</span>
        </div>
        <div className="text-[11px] text-slate-400 dark:text-slate-500">
          White background · Clean vector text rendering
        </div>
      </div>

      {/* Real-time Quality & Visual Fidelity Preview Modal */}
      <QualityPreviewModal
        isOpen={showFidelityModal}
        onClose={() => setShowFidelityModal(false)}
        settings={settings}
        onUpdateQuality={handleSliderChange}
        images={images}
      />
    </div>
  );
};
