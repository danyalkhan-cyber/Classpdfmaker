/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  Image as ImageIcon,
  Minimize2,
  FileSpreadsheet,
  Layers,
  Scissors,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Download,
  Upload,
  Sun,
  Moon,
  ExternalLink,
  Laptop,
  Check,
  Heart,
  HelpCircle,
  Mail,
  X,
  ChevronRight,
  Sliders,
  RotateCcw,
  Eye
} from 'lucide-react';

interface SasicoDesignPreviewProps {
  onBackToLive: () => void;
}

export const SasicoDesignPreview: React.FC<SasicoDesignPreviewProps> = ({
  onBackToLive,
}) => {
  // In-preview theme toggle (defaults to Sasico signature light theme, supports dark preview)
  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');

  // Preview interactive modal state for tool cards
  const [activeModalTool, setActiveModalTool] = useState<{
    title: string;
    description: string;
    icon: React.ReactNode;
    features: string[];
    badge: string;
    badgeColor?: string;
  } | null>(null);

  // Interactive mock tab state for hero showcase
  const [heroToolTab, setHeroToolTab] = useState<'image-pdf' | 'compress' | 'word'>('image-pdf');
  const [compressSlider, setCompressSlider] = useState<number>(65);

  const isDark = previewTheme === 'dark';

  const tools = [
    {
      id: 'image-to-pdf',
      title: 'Image to PDF',
      description: 'Convert homework photos, textbook scans, and notes into clean, submission-ready PDF documents.',
      badge: 'Popular',
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900',
      icon: <ImageIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      gradient: 'from-blue-600 to-indigo-600',
      features: ['Multi-page grid layout', 'Customizable 0mm to 16mm margins', 'Desk shadow trimming & rotation'],
    },
    {
      id: 'compress-pdf',
      title: 'Compress PDF',
      description: 'Reduce document size dramatically for easy email sharing and LMS uploads without losing text clarity.',
      badge: 'High Reduction',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900',
      icon: <Minimize2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      gradient: 'from-emerald-600 to-teal-600',
      features: ['3 compression strength levels', 'In-place XObject stream downsampling', 'Honest before/after byte metrics'],
    },
    {
      id: 'pdf-to-word',
      title: 'PDF to Word',
      description: 'Convert read-only PDF files into editable Microsoft Word (.docx) documents with intact paragraphs.',
      badge: 'Editable DOCX',
      badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900',
      icon: <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      gradient: 'from-indigo-600 to-purple-600',
      features: ['Paragraph & heading preservation', 'Table layout structure parsing', 'Direct .docx file export'],
    },
    {
      id: 'merge-pdf',
      title: 'Merge PDF',
      description: 'Combine multiple lecture slides, syllabus sheets, and research papers into a single organized file.',
      badge: 'Instant Combine',
      badgeColor: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-900',
      icon: <Layers className="w-6 h-6 text-sky-600 dark:text-sky-400" />,
      gradient: 'from-sky-600 to-blue-600',
      features: ['Drag & drop reordering', 'Per-file page count inspection', 'Zero quality degradation'],
    },
    {
      id: 'split-pdf',
      title: 'Split PDF',
      description: 'Extract individual pages, separate chapters, or split multipage PDF books into custom segments.',
      badge: 'Concept',
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900',
      icon: <Scissors className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      gradient: 'from-amber-600 to-orange-600',
      features: ['Page range selection', 'Single-page extraction', 'Zip bundle download'],
    },
    {
      id: 'pdf-to-image',
      title: 'PDF to Image',
      description: 'Render every PDF sheet into high-resolution PNG or JPEG images suitable for presentations and sharing.',
      badge: 'Concept',
      badgeColor: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-900',
      icon: <FileSpreadsheet className="w-6 h-6 text-violet-600 dark:text-violet-400" />,
      gradient: 'from-violet-600 to-fuchsia-600',
      features: ['High DPI canvas rasterization', 'Transparent background support', 'Batch image extraction'],
    },
  ];

  const features = [
    {
      icon: <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      title: 'Fast Processing',
      description: 'Instant client-side execution powered by WebAssembly & HTML5 Canvas without waiting in remote server queues.',
    },
    {
      icon: <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      title: 'Simple Interface',
      description: 'Zero learning curve. Drag, drop, adjust margins or quality with intuitive visual controls, and export in 1 click.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      title: 'Secure Document Handling',
      description: 'Total privacy. Your academic documents, study notes, and assignments never upload to an external cloud server.',
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
      title: 'High-Quality Results',
      description: 'Vector-sharp text rendering, true font preservation, and uncompressed graphics tailored for assignment guidelines.',
    },
    {
      icon: <Laptop className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      title: 'Browser-Friendly Experience',
      description: 'Fully responsive and lightweight across smartphones, tablets, Chromebooks, MacBooks, and Windows PCs.',
    },
    {
      icon: <Download className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      title: 'Easy Downloads',
      description: 'No email registration, credit cards, or hidden watermarks. Your converted files download immediately.',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Upload your document',
      description: 'Drag & drop photos, Word files, or existing PDFs into the browser workspace.',
      color: 'from-blue-600 to-indigo-600',
    },
    {
      step: '02',
      title: 'Choose your PDF tool',
      description: 'Select your operation—convert, compress, reorder pages, or customize margins.',
      color: 'from-indigo-600 to-cyan-500',
    },
    {
      step: '03',
      title: 'Download your result',
      description: 'Get your clean, optimized document instantly without waiting or watermarks.',
      color: 'from-cyan-500 to-emerald-500',
    },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 font-sans ${isDark ? 'bg-[#0B1120] text-slate-100' : 'bg-[#FAFCFF] text-slate-800'}`}>
      {/* Top Banner: Concept Notice & Return Link */}
      <aside
        aria-label="Design Preview Notice"
        className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white px-4 py-2.5 text-xs font-medium sticky top-0 z-50 shadow-md flex items-center justify-between"
      >
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] uppercase font-bold tracking-wider">
              Design Preview
            </span>
            <span className="hidden sm:inline">
              Sasico-inspired modern SaaS concept for ClassPDF Maker (Interactive Mockup).
            </span>
            <span className="sm:hidden">Sasico Design Preview</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setPreviewTheme(isDark ? 'light' : 'dark')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer text-[11px]"
              title="Toggle preview theme"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-blue-200" />}
              <span>{isDark ? 'Preview Light Mode' : 'Preview Dark Mode'}</span>
            </button>

            <button
              onClick={onBackToLive}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white text-blue-700 hover:bg-blue-50 font-bold transition-all shadow-xs cursor-pointer text-xs"
            >
              <span>← Back to Current Website</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Sasico-Inspired Modern Header */}
      <header className={`sticky top-9 z-40 w-full transition-colors backdrop-blur-md border-b ${isDark ? 'bg-[#0B1120]/85 border-slate-800/80' : 'bg-white/85 border-slate-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 font-extrabold text-base">
              CP
            </div>
            <div>
              <span className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                ClassPDF<span className="text-blue-600">.</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400 px-2 py-0.5 rounded-full border border-blue-200/50 dark:border-blue-800/50">
                SaaS Preview
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-semibold">
            <button
              onClick={() => scrollTo('preview-hero')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-blue-50/60'}`}
            >
              Home
            </button>
            <button
              onClick={() => scrollTo('preview-tools')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-blue-50/60'}`}
            >
              Tools
            </button>
            <button
              onClick={() => scrollTo('preview-features')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-blue-50/60'}`}
            >
              Features
            </button>
            <button
              onClick={() => scrollTo('preview-how-it-works')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-blue-50/60'}`}
            >
              How It Works
            </button>
            <button
              onClick={() => scrollTo('preview-about')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-blue-50/60'}`}
            >
              About
            </button>
            <button
              onClick={() => scrollTo('preview-contact')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-blue-50/60'}`}
            >
              Contact
            </button>
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollTo('preview-tools')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/25 transition-all cursor-pointer hover:shadow-lg hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="preview-hero"
        className="relative pt-16 sm:pt-24 pb-20 overflow-hidden"
      >
        {/* Subtle background ambient mesh */}
        <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center">
          <div className="w-[700px] h-[450px] bg-gradient-to-tr from-blue-400/15 via-indigo-400/10 to-cyan-300/15 blur-3xl rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Main Hero Copy */}
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/60 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
              <span>Next-Generation Document Utility</span>
            </div>

            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] ${isDark ? 'text-white' : 'text-slate-900'}`}>
              All Your PDF Tools.{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                One Simple Platform.
              </span>
            </h1>

            <p className={`text-base sm:text-lg leading-relaxed max-w-2xl mx-auto ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Convert, compress, and manage your documents effortlessly. Fast, simple, and accessible from anywhere.
            </p>

            {/* Hero CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <button
                onClick={() => scrollTo('preview-tools')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-xl shadow-blue-600/25 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Explore PDF Tools</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollTo('preview-features')}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm border transition-all cursor-pointer ${isDark ? 'border-slate-800 bg-slate-900/80 text-white hover:bg-slate-800' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-xs'}`}
              >
                <span>Learn More</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>100% In-Browser Privacy</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>No Account Required</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Zero File Upload Limits</span>
              </span>
            </div>
          </div>

          {/* Professional Visual Representation of PDF Tools */}
          <div className="max-w-5xl mx-auto">
            <div className={`p-4 sm:p-6 rounded-3xl border shadow-2xl relative ${isDark ? 'bg-[#111A2E] border-slate-800/90' : 'bg-white border-slate-200/90 shadow-blue-500/5'}`}>
              {/* Mockup Top Navigation Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 mr-2">
                    <span className="w-3 h-3 rounded-full bg-rose-400 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>
                  </div>
                  <span className={`text-xs font-mono font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    ClassPDF Studio v2.4
                  </span>
                </div>

                <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                  <button
                    onClick={() => setHeroToolTab('image-pdf')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${heroToolTab === 'image-pdf' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                  >
                    Image to PDF
                  </button>
                  <button
                    onClick={() => setHeroToolTab('compress')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${heroToolTab === 'compress' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                  >
                    Compress PDF
                  </button>
                  <button
                    onClick={() => setHeroToolTab('word')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${heroToolTab === 'word' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                  >
                    PDF to Word
                  </button>
                </div>
              </div>

              {/* Mockup Workspace Area */}
              <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left side: interactive preview dropzone */}
                <div className="lg:col-span-7 space-y-4">
                  <div className={`p-8 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center gap-3 transition-colors ${isDark ? 'border-slate-700 bg-slate-900/60' : 'border-blue-200 bg-blue-50/30'}`}>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <Upload className="w-7 h-7" />
                    </div>
                    <div>
                      <p className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {heroToolTab === 'image-pdf' && 'Drop your lecture photos or notes here'}
                        {heroToolTab === 'compress' && 'Drop large PDF to optimize file size'}
                        {heroToolTab === 'word' && 'Drop PDF to convert to editable Word (.docx)'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        High-speed in-browser conversion · No watermark
                      </p>
                    </div>
                    <span className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs">
                      Select Documents
                    </span>
                  </div>

                  {/* Sample file chip list */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className={`p-2.5 rounded-xl border flex items-center justify-between ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                        <span className="truncate font-mono">Organic_Chem_Lecture.pdf</span>
                      </div>
                      <span className="text-[10px] text-emerald-500 font-bold shrink-0">Ready</span>
                    </div>
                    <div className={`p-2.5 rounded-xl border flex items-center justify-between ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="flex items-center gap-2 truncate">
                        <ImageIcon className="w-4 h-4 text-indigo-500 shrink-0" />
                        <span className="truncate font-mono">Homework_Scan_01.jpg</span>
                      </div>
                      <span className="text-[10px] text-emerald-500 font-bold shrink-0">Ready</span>
                    </div>
                  </div>
                </div>

                {/* Right side: visual metrics & options card */}
                <div className={`lg:col-span-5 p-5 rounded-2xl border space-y-4 ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50/70 border-slate-200/80'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Live Configuration
                    </span>
                    <span className="text-[11px] font-semibold text-blue-600 dark:text-cyan-400">
                      Active Tool
                    </span>
                  </div>

                  {heroToolTab === 'image-pdf' && (
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                        <span className="text-slate-500">Page Size:</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">Standard A4 (210×297mm)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                        <span className="text-slate-500">Margins:</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">None (0mm Full Bleed)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                        <span className="text-slate-500">Orientation:</span>
                        <span className="font-semibold">Auto-Detect</span>
                      </div>
                      <div className="p-3 rounded-xl bg-blue-100/50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 font-medium">
                        ✓ 0mm edge-to-edge full bleed rendering active
                      </div>
                    </div>
                  )}

                  {heroToolTab === 'compress' && (
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Target Reduction:</span>
                        <span className="font-bold text-emerald-600 font-mono text-sm">{compressSlider}%</span>
                      </div>
                      <input
                        type="range"
                        min={30}
                        max={85}
                        value={compressSlider}
                        onChange={(e) => setCompressSlider(Number(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                      <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-center">
                        <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          <span className="text-[10px] text-slate-400 block">Original</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">14.8 MB</span>
                        </div>
                        <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800">
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">Optimized</span>
                          <span className="font-bold text-emerald-700 dark:text-emerald-300">
                            {(14.8 * (1 - compressSlider / 100)).toFixed(1)} MB
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {heroToolTab === 'word' && (
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                        <span className="text-slate-500">Format:</span>
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">Microsoft Word (.docx)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                        <span className="text-slate-500">Text Extraction:</span>
                        <span className="font-semibold text-emerald-600">Native Paragraphs &amp; Tables</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
                        <span className="text-slate-500">Scanned OCR Mode:</span>
                        <span className="font-semibold">Automatic Fallback</span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => scrollTo('preview-tools')}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Try In Tools Section</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PDF Tools Section */}
      <section
        id="preview-tools"
        className={`py-20 border-t transition-colors ${isDark ? 'bg-[#0E1526] border-slate-800/80' : 'bg-white border-slate-100'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
              Complete Utility Suite
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Professional PDF Tools
            </h2>
            <p className={`text-sm sm:text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Everything you need to convert, compress, organize, and edit documents in one cohesive, beautiful dashboard.
            </p>
          </div>

          {/* 6-Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className={`group p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between ${isDark ? 'bg-[#131D31] border-slate-800 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5' : 'bg-white border-slate-200/90 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10'}`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-blue-50/70 border-blue-100'}`}>
                      {tool.icon}
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${tool.badgeColor}`}>
                      {tool.badge}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className={`text-lg font-bold group-hover:text-blue-600 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {tool.title}
                    </h3>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {tool.description}
                    </p>
                  </div>

                  {/* Highlights */}
                  <ul className="space-y-1.5 pt-2 text-[11px] text-slate-500 dark:text-slate-400">
                    {tool.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 mt-6">
                  <button
                    onClick={() => setActiveModalTool(tool)}
                    className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-blue-600 hover:text-white dark:bg-slate-800 dark:hover:bg-blue-600 text-slate-700 dark:text-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Try Now</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="preview-features"
        className={`py-20 border-t transition-colors ${isDark ? 'bg-[#0B1120] border-slate-800/80' : 'bg-[#FAFCFF] border-slate-100'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
              Why ClassPDF Maker
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Engineered for Modern Productivity
            </h2>
            <p className={`text-sm sm:text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Designed from the ground up for students, academics, and professionals who demand speed, security, and simplicity.
            </p>
          </div>

          {/* 6 Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, index) => (
              <div
                key={index}
                className={`p-6 rounded-3xl border transition-all ${isDark ? 'bg-[#111A2E] border-slate-800/90 hover:border-slate-700' : 'bg-white border-slate-200/80 hover:border-blue-200 shadow-xs'}`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-blue-50/80 border-blue-100'}`}>
                  {feat.icon}
                </div>
                <h3 className={`text-base font-bold mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {feat.title}
                </h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="preview-how-it-works"
        className={`py-20 border-t transition-colors ${isDark ? 'bg-[#0E1526] border-slate-800/80' : 'bg-white border-slate-100'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
              Three Effortless Steps
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              How It Works
            </h2>
            <p className={`text-sm sm:text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              No complicated settings, software installations, or cloud registrations. Convert documents in under 10 seconds.
            </p>
          </div>

          {/* 3 Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {steps.map((st, i) => (
              <div
                key={i}
                className={`p-7 rounded-3xl border relative space-y-4 ${isDark ? 'bg-[#131D31] border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'}`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${st.color} text-white flex items-center justify-center font-black text-lg shadow-md`}>
                    {st.step}
                  </div>
                  <span className="text-xs font-bold text-slate-400 font-mono">
                    Step {i + 1} of 3
                  </span>
                </div>

                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {st.title}
                </h3>

                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {st.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="preview-about"
        className={`py-20 border-t transition-colors ${isDark ? 'bg-[#0B1120] border-slate-800/80' : 'bg-[#FAFCFF] border-slate-100'}`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
              Our Mission
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              About ClassPDF Maker
            </h2>
          </div>

          <div className={`p-8 sm:p-10 rounded-3xl border space-y-6 ${isDark ? 'bg-[#111A2E] border-slate-800' : 'bg-white border-slate-200/90 shadow-sm'}`}>
            <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              ClassPDF Maker is a purpose-built PDF productivity platform crafted specifically for university students, educators, and working professionals. We believe essential document utilities should be fast, private, free, and free of annoying subscription paywalls.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-blue-50/50 border-blue-100'}`}>
                <h4 className="font-bold text-xs text-blue-600 dark:text-blue-400 mb-1">
                  For Students
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Compile handwritten lecture notes, homework assignments, and research articles into clean PDFs for university portals.
                </p>
              </div>

              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-indigo-50/50 border-indigo-100'}`}>
                <h4 className="font-bold text-xs text-indigo-600 dark:text-indigo-400 mb-1">
                  For Teachers
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Combine exams, answer keys, and handouts without dealing with expensive desktop software licenses.
                </p>
              </div>

              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-emerald-50/50 border-emerald-100'}`}>
                <h4 className="font-bold text-xs text-emerald-600 dark:text-emerald-400 mb-1">
                  For Professionals
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Quickly compress large pitch decks, convert reports to editable Word docs, and prepare files on the go.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="preview-contact"
        className={`py-20 border-t transition-colors ${isDark ? 'bg-[#0E1526] border-slate-800/80' : 'bg-white border-slate-100'}`}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
            Get in Touch
          </span>
          <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Have Feedback on This Design Preview?
          </h2>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            We are continuously exploring ways to elevate ClassPDF Maker. Share your thoughts or suggestions with our team.
          </p>

          <div className={`p-6 rounded-3xl border max-w-md mx-auto space-y-4 ${isDark ? 'bg-[#131D31] border-slate-800' : 'bg-blue-50/40 border-blue-100'}`}>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <Mail className="w-4 h-4 text-blue-600" />
              <span>Inquiries &amp; Design Feedback:</span>
            </div>
            <a
              href="mailto:danyalkhancs56@gmail.com"
              className="inline-block text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-cyan-400 hover:underline font-mono"
            >
              danyalkhancs56@gmail.com
            </a>
            <p className="text-[11px] text-slate-400">
              Direct response within 24–48 hours for student and partner requests.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 border-t transition-colors text-xs ${isDark ? 'bg-[#080D1A] border-slate-800/80 text-slate-400' : 'bg-slate-50 border-slate-200/80 text-slate-500'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                CP
              </div>
              <span className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                ClassPDF Maker
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold">
                Sasico Concept
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-semibold">
              <button onClick={() => scrollTo('preview-about')} className="hover:text-blue-600 transition-colors cursor-pointer">
                About
              </button>
              <button onClick={() => scrollTo('preview-tools')} className="hover:text-blue-600 transition-colors cursor-pointer">
                Tools
              </button>
              <button onClick={() => scrollTo('preview-features')} className="hover:text-blue-600 transition-colors cursor-pointer">
                Features
              </button>
              <button onClick={() => scrollTo('preview-contact')} className="hover:text-blue-600 transition-colors cursor-pointer">
                Contact
              </button>
              <button onClick={onBackToLive} className="text-blue-600 hover:text-blue-700 font-bold transition-colors cursor-pointer">
                ← Return to Live Website
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <p>© {new Date().getFullYear()} ClassPDF Maker. Design Concept Preview inspired by Sasico. All rights reserved.</p>
            <p>100% In-Browser PDF Processing · Privacy-First Architecture</p>
          </div>
        </div>
      </footer>

      {/* Interactive Tool Modal (Preview Only) */}
      {activeModalTool && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className={`relative w-full max-w-lg p-6 sm:p-7 rounded-3xl border shadow-2xl space-y-5 ${isDark ? 'bg-[#111A2E] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-blue-50 border-blue-100'}`}>
                  {activeModalTool.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    {activeModalTool.title}
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${activeModalTool.badgeColor}`}>
                    {activeModalTool.badge}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setActiveModalTool(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {activeModalTool.description}
            </p>

            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Key Specifications in Concept
              </span>
              <ul className="space-y-1.5 text-xs">
                {activeModalTool.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/60 text-xs text-blue-800 dark:text-blue-300 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Interactive Design Preview Notice</span>
              </p>
              <p className="text-[11px] leading-relaxed">
                This modal illustrates the UI interaction for the Sasico design concept. To use the working PDF tool, click "Open on Live Website" below.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveModalTool(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Close Preview
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveModalTool(null);
                  onBackToLive();
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Open on Live Website</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
