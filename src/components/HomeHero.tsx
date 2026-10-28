import React from 'react';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Shield,
  Layers,
  ArrowRight,
  FileCheck2,
  Sparkles,
  Zap,
  Sliders
} from 'lucide-react';
import { UploadDropzone } from './UploadDropzone';
import { AdPlacement } from './AdPlacement';
import { PdfToWordSection } from './PdfToWordSection';
import { UploadedImage } from '../types';

interface HomeHeroProps {
  onImagesAdded: (newImages: UploadedImage[]) => void;
  onGoToConvert: () => void;
  imagesCount: number;
  onOpenAuthModal: () => void;
  showAds?: boolean;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onImagesAdded,
  onGoToConvert,
  imagesCount,
  onOpenAuthModal,
  showAds = true,
}) => {
  return (
    <div className="space-y-10 py-6">
      {/* Hero Header Area */}
      <div className="text-center max-w-3xl mx-auto space-y-4 px-4">
        {/* Brand Logo Emblem */}
        <div className="flex justify-center">
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-sky-400 to-blue-600 rounded-3xl blur-xs opacity-20 group-hover:opacity-35 transition duration-300"></div>
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white dark:bg-slate-800 p-1.5 shadow-md border border-slate-200/80 dark:border-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <img
                src="/assets/aistudio/website_logo_fdd01625.png"
                alt="ClassPDF Maker"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Micro-kicker */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/70 border border-sky-100 dark:border-sky-900/60 px-3 py-1 rounded-full shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          <span>Free Public Document Converter · No Sign-in Required</span>
        </div>

        {/* Section 4 Prominent Heading */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          Convert Your Images into PDF
        </h1>

        {/* Section 4 Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Upload your class notes, assignments, and document photos to create a PDF in seconds.
        </p>
      </div>

      {/* Reserved Ad Placement: Below the main introduction & separated from upload dropzone */}
      <AdPlacement
        slotType="leaderboard"
        slotId="hero-below-intro"
        showAds={showAds}
        className="my-1"
      />

      {/* Main Drag-and-Drop Area */}
      <div className="max-w-4xl mx-auto px-4">
        <UploadDropzone
          onImagesAdded={onImagesAdded}
          currentCount={imagesCount}
        />

        {imagesCount > 0 && (
          <div className="mt-4 p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {imagesCount} {imagesCount === 1 ? 'image' : 'images'} ready for conversion
                </p>
                <p className="text-[11px] text-slate-500">
                  Review page sequence, adjust margins & page format in the converter workspace.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onGoToConvert}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-sm transition-all hover:scale-[1.02]"
            >
              <span>Continue to Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* New Feature Section: PDF to Word Converter */}
      <PdfToWordSection id="pdf-to-word" />

      {/* 4 Feature Highlights */}
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-bold text-slate-900 dark:text-white">
            Custom Page Formats
          </h2>
          <p className="text-[11px] text-slate-500 leading-normal">
            Choose A4, US Letter, or auto-fit to original note dimensions. Support 1, 2, or 4 images per page.
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-bold text-slate-900 dark:text-white">
            Instant Client-Side Speed
          </h2>
          <p className="text-[11px] text-slate-500 leading-normal">
            No uploading over slow campus Wi-Fi. Conversion happens directly on your CPU/GPU in fractions of a second.
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Sliders className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-bold text-slate-900 dark:text-white">
            Reorder & Rotate
          </h2>
          <p className="text-[11px] text-slate-500 leading-normal">
            Effortlessly rearrange misplaced pages, rotate sideways camera snaps, and inspect high-resolution zooms.
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-bold text-slate-900 dark:text-white">
            Personal & Classmate Modes
          </h2>
          <p className="text-[11px] text-slate-500 leading-normal">
            Keep uploads strictly in temporary memory or attach student assignment identifiers for course submission.
          </p>
        </div>
      </div>

      {/* Reserved Bottom Placement */}
      <AdPlacement slotType="footer-banner" slotId="page-bottom" showAds={showAds} />
    </div>
  );
};
