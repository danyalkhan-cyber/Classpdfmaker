import React from 'react';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Shield,
  Layers,
  ArrowRight,
  Sparkles,
  Zap,
  Sliders,
  Image as ImageIcon,
  Minimize2,
  FileType,
  Files,
  ArrowDown
} from 'lucide-react';
import { UploadDropzone } from './UploadDropzone';
import { AdPlacement } from './AdPlacement';
import { PdfToWordSection } from './PdfToWordSection';
import { WordToPdfSection } from './WordToPdfSection';
import { MergePdfSection } from './MergePdfSection';
import { CompressPdfSection } from './CompressPdfSection';
import { UploadedImage } from '../types';

interface HomeHeroProps {
  onImagesAdded: (newImages: UploadedImage[]) => void;
  onGoToConvert: () => void;
  imagesCount: number;
  showAds?: boolean;
  onSelectTab?: (tab: 'home' | 'convert' | 'files' | 'about' | 'contact' | 'privacy' | 'terms' | 'pdf-to-word' | 'word-to-pdf' | 'merge-pdf' | 'compress-pdf') => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onImagesAdded,
  onGoToConvert,
  imagesCount,
  showAds = true,
  onSelectTab,
}) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const tools = [
    {
      id: 'image-to-pdf',
      title: 'Image to PDF',
      description: 'Combine note photos, textbook scans, and images into formatted PDFs with custom page sizes.',
      icon: ImageIcon,
      badge: 'Core Tool',
      action: () => scrollToSection('image-to-pdf-dropzone'),
    },
    {
      id: 'merge-pdf',
      title: 'Merge PDF',
      description: 'Combine multiple PDF files into a single unified document with drag-and-drop page ordering.',
      icon: Files,
      badge: 'Popular',
      action: () => scrollToSection('merge-pdf'),
    },
    {
      id: 'compress-pdf',
      title: 'Compress PDF',
      description: 'Shrink large PDF files to fit upload quotas while preserving crisp reading quality.',
      icon: Minimize2,
      badge: 'New',
      action: () => scrollToSection('compress-pdf'),
    },
    {
      id: 'word-to-pdf',
      title: 'Word to PDF',
      description: 'Transform Microsoft Word .docx documents into clean, portable PDFs directly in-browser.',
      icon: FileType,
      badge: 'New',
      action: () => scrollToSection('word-to-pdf'),
    },
    {
      id: 'pdf-to-word',
      title: 'PDF to Word',
      description: 'Extract and convert PDF pages into editable .docx Word files for easy study editing.',
      icon: FileText,
      badge: 'Fast',
      action: () => scrollToSection('pdf-to-word'),
    },
  ];

  return (
    <div className="space-y-12 py-8 relative">
      {/* Subtle SaaS Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Header Area */}
      <div className="text-center max-w-3xl mx-auto space-y-5 px-4">
        {/* Brand Logo Emblem */}
        <div className="flex justify-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur-md opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white dark:bg-[#171D32] p-2 shadow-lg border border-slate-200/90 dark:border-[#232B45] flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <img
                src="/assets/aistudio/website_logo_fdd01625.png"
                alt="ClassPDF Maker"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Quiet Editorial Kicker */}
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500 dark:text-[#A7B0C5]">
          <span>Browser-Based Document Toolkit</span>
          <span aria-hidden="true">·</span>
          <span className="text-indigo-600 dark:text-[#22D3EE] font-semibold">100% In-Browser Privacy</span>
          <span aria-hidden="true">·</span>
          <span>Zero Sign-In</span>
        </div>

        {/* Section Headline */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-[#F8FAFC] leading-[1.12]">
          Your Documents.{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-500 dark:from-indigo-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">
            Perfectally Converted.
          </span>
        </h1>

        {/* Supporting Description */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-[#A7B0C5] max-w-2xl mx-auto leading-relaxed">
          Convert photos, handwritten notes, and documents into PDFs or use our suite of free browser-based PDF tools. Safe, instant, and completely private.
        </p>

        {/* Hero Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => scrollToSection('image-to-pdf-dropzone')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-xl shadow-md shadow-indigo-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Convert Images to PDF</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('tools-grid')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-[#F8FAFC] bg-white dark:bg-[#171D32] hover:bg-slate-50 dark:hover:bg-[#1E2640] border border-slate-200 dark:border-[#232B45] rounded-xl transition-all"
          >
            <span>Explore All 5 PDF Tools</span>
            <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Reserved Ad Placement: Below the main introduction & separated from tools */}
      <AdPlacement
        slotType="leaderboard"
        slotId="hero-below-intro"
        showAds={showAds}
        className="my-1"
      />

      {/* Section 4: PDF Tools Cards (Consistent SaaS Component System) */}
      <div id="tools-grid" className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC]">
              Document Conversion Tools
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#A7B0C5]">
              Select a specialized browser tool to process your files securely
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
            5 Free Tools
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                type="button"
                onClick={tool.action}
                className="flex flex-col justify-between p-5 text-left bg-white dark:bg-[#171D32] hover:bg-slate-50 dark:hover:bg-[#1B233C] border border-slate-200/90 dark:border-[#232B45] hover:border-indigo-500/50 dark:hover:border-indigo-500/50 rounded-2xl transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:text-cyan-500 dark:group-hover:text-[#22D3EE] flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-[#111827] text-slate-600 dark:text-[#A7B0C5] border border-slate-200/60 dark:border-[#232B45]">
                      {tool.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-[#F8FAFC] group-hover:text-indigo-600 dark:group-hover:text-[#22D3EE] transition-colors flex items-center gap-1.5">
                      <span>{tool.title}</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-[#A7B0C5] mt-1 line-clamp-2 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-[#232B45]/60 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:text-cyan-500 dark:group-hover:text-[#22D3EE]">
                  <span>Launch Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Drag-and-Drop Area for Image to PDF */}
      <div id="image-to-pdf-dropzone" className="max-w-4xl mx-auto px-4 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-[#F8FAFC]">
              Image to PDF Converter
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-[#A7B0C5]">
            JPG, PNG, WEBP up to 25MB
          </span>
        </div>

        <UploadDropzone
          onImagesAdded={onImagesAdded}
          currentCount={imagesCount}
        />

        {imagesCount > 0 && (
          <div className="mt-4 p-4 rounded-2xl bg-indigo-50/70 dark:bg-[#171D32] border border-indigo-200/80 dark:border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">
                  {imagesCount} {imagesCount === 1 ? 'image' : 'images'} ready for conversion
                </p>
                <p className="text-[11px] text-slate-500 dark:text-[#A7B0C5]">
                  Reorder pages, configure margins & paper size in the workspace.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onGoToConvert}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-xl shadow-sm transition-all hover:scale-[1.02]"
            >
              <span>Continue to Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Feature Section: PDF to Word Converter */}
      <PdfToWordSection id="pdf-to-word" />

      {/* Feature Section: Word to PDF Converter */}
      <WordToPdfSection id="word-to-pdf" />

      {/* Feature Section: Merge PDF Tool */}
      <MergePdfSection id="merge-pdf" />

      {/* Feature Section: Compress PDF Tool */}
      <CompressPdfSection id="compress-pdf" />

      {/* 4 Feature Highlights */}
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-[#171D32] rounded-2xl border border-slate-200/80 dark:border-[#232B45] space-y-2.5 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">
            Custom Page Formats
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-[#A7B0C5] leading-relaxed">
            Choose A4, US Letter, or auto-fit to original note dimensions. Support 1, 2, or 4 images per page.
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-[#171D32] rounded-2xl border border-slate-200/80 dark:border-[#232B45] space-y-2.5 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-[#22D3EE] flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">
            Instant Client-Side Speed
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-[#A7B0C5] leading-relaxed">
            No uploading over slow internet. Conversion compiles directly in memory using your local hardware.
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-[#171D32] rounded-2xl border border-slate-200/80 dark:border-[#232B45] space-y-2.5 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Sliders className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">
            Reorder & Rotate
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-[#A7B0C5] leading-relaxed">
            Effortlessly rearrange page sequence, rotate misoriented camera photos, and preview zoomed pages.
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-[#171D32] rounded-2xl border border-slate-200/80 dark:border-[#232B45] space-y-2.5 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">
            100% Client-Side Privacy
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-[#A7B0C5] leading-relaxed">
            Your files and images stay in your browser. Nothing is ever uploaded or stored on external servers.
          </p>
        </div>
      </div>

      {/* Reserved Bottom Placement */}
      <AdPlacement slotType="footer-banner" slotId="page-bottom" showAds={showAds} />
    </div>
  );
};

