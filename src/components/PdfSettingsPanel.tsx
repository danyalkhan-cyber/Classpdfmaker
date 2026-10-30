import React from 'react';
import {
  Settings2,
  RotateCcw,
  FileCheck,
  FileText,
  Layout,
  Maximize2,
  Sliders,
  Sparkles,
  Info
} from 'lucide-react';
import { PdfSettings, PageSize, PageOrientation, PageMargin, ImageFitting, ImageQuality, ImagesPerPage } from '../types';

interface PdfSettingsPanelProps {
  settings: PdfSettings;
  onChange: (updated: PdfSettings) => void;
  onReset: () => void;
  imageCount: number;
  totalImageBytes: number;
}

export const PdfSettingsPanel: React.FC<PdfSettingsPanelProps> = ({
  settings,
  onChange,
  onReset,
  imageCount,
  totalImageBytes,
}) => {
  const updateSetting = <K extends keyof PdfSettings>(key: K, value: PdfSettings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  // Rough estimation of PDF output size
  const estimatePdfSize = () => {
    if (imageCount === 0) return '0 KB';
    const factor = settings.quality === 'high' ? 0.85 : 0.45;
    const estimated = totalImageBytes * factor + 5000;
    if (estimated < 1024 * 1024) {
      return `~${Math.round(estimated / 1024)} KB`;
    }
    return `~${(estimated / (1024 * 1024)).toFixed(1)} MB`;
  };

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

        {/* Image Quality */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-[#A7B0C5] mb-1.5">
            Image Quality &amp; Compression
          </label>
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-[#111827] border border-slate-200/50 dark:border-[#232B45] rounded-xl">
            {(
              [
                { id: 'standard', label: 'Standard (Compact)' },
                { id: 'high', label: 'High (Sharp Notes)' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => updateSetting('quality', opt.id as ImageQuality)}
                className={`py-1.5 px-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  settings.quality === opt.id
                    ? 'bg-white dark:bg-[#171D32] text-indigo-600 dark:text-cyan-400 shadow-xs border border-slate-200/60 dark:border-[#232B45]'
                    : 'text-slate-600 dark:text-[#A7B0C5] hover:text-slate-900 dark:hover:text-[#F8FAFC]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
            {settings.quality === 'high' ? 'Best for tiny handwritten formulas' : 'Optimal for submission portals with file size caps'}
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
    </div>
  );
};
