/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  ShieldCheck,
  Layers,
  ArrowRight,
  Sparkles,
  Zap,
  Sliders,
  Image as ImageIcon,
  Minimize2,
  FileType,
  Files,
  ArrowDown,
  Laptop,
  Download,
  Scissors,
  Check,
  Eye,
  SlidersHorizontal,
  Upload,
  ChevronRight,
  Shield,
  HelpCircle,
  FileCheck
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
  // Interactive mock tab state for hero showcase
  const [heroToolTab, setHeroToolTab] = useState<'image-pdf' | 'compress' | 'word'>('image-pdf');
  const [compressSlider, setCompressSlider] = useState<number>(75);

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
      description: 'Convert handwritten lecture notes, camera photos, and textbook scans into clean, formatted PDF documents.',
      badge: 'Core Tool',
      badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-cyan-400 border-blue-200 dark:border-cyan-800/60',
      icon: ImageIcon,
      gradient: 'from-blue-600 to-indigo-600',
      targetId: 'image-to-pdf-dropzone',
      features: ['0mm, 8mm, 16mm margin control', 'Real-time quality compression slider', 'A4, Letter & auto-orientation'],
    },
    {
      id: 'compress-pdf',
      title: 'Compress PDF',
      description: 'Reduce PDF file size up to 90% for university LMS portals and email while preserving crisp formula readability.',
      badge: 'Popular',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60',
      icon: Minimize2,
      gradient: 'from-emerald-600 to-teal-600',
      targetId: 'compress-pdf',
      features: ['Low, Medium, High compression', 'Live before/after byte savings counter', '100% in-browser stream optimization'],
    },
    {
      id: 'pdf-to-word',
      title: 'PDF to Word',
      description: 'Convert read-only PDF assignments and documents into editable Microsoft Word (.docx) files.',
      badge: 'Editable DOCX',
      badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60',
      icon: FileText,
      gradient: 'from-indigo-600 to-purple-600',
      targetId: 'pdf-to-word',
      features: ['Paragraph structure extraction', 'Heading and text layout parsing', 'Valid .docx download with zero watermark'],
    },
    {
      id: 'word-to-pdf',
      title: 'Word to PDF',
      description: 'Transform Microsoft Word (.docx) files into standard, universal PDF documents ready for printing and sharing.',
      badge: 'New Tool',
      badgeColor: 'bg-cyan-500/10 text-cyan-700 dark:text-[#22D3EE] border-cyan-200 dark:border-cyan-800/60',
      icon: FileType,
      gradient: 'from-cyan-600 to-blue-600',
      targetId: 'word-to-pdf',
      features: ['Full client-side docx parsing', 'Preserves text formatting & tables', 'Instant single-click PDF export'],
    },
    {
      id: 'merge-pdf',
      title: 'Merge PDF',
      description: 'Combine multiple lecture slide sets, syllabus chapters, and research papers into one unified document.',
      badge: 'Multi-File',
      badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/60',
      icon: Files,
      gradient: 'from-purple-600 to-pink-600',
      targetId: 'merge-pdf',
      features: ['Drag-and-drop file reordering', 'Per-document page count inspection', 'Zero quality degradation'],
    },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Lightning-Fast Local Speed',
      description: 'Instant client-side execution powered by WebAssembly & Canvas. No waiting in remote server queues.',
      color: 'text-blue-500 dark:text-cyan-400 bg-blue-50 dark:bg-cyan-950/50 border-blue-200 dark:border-cyan-800/50',
    },
    {
      icon: ShieldCheck,
      title: '100% Client-Side Privacy',
      description: 'Your notes and assignments never leave your computer. Processing happens completely inside local browser memory.',
      color: 'text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/50',
    },
    {
      icon: CheckCircle2,
      title: 'Math & Formula Sharpness',
      description: 'High-fidelity rasterization and vector rendering ensure sub/superscripts, fractions, and diagrams stay razor sharp.',
      color: 'text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800/50',
    },
    {
      icon: Sparkles,
      title: 'Completely Free Forever',
      description: 'No paywalls, subscriptions, email sign-ups, or hidden watermarks. Built for students, educators, and professionals.',
      color: 'text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/50',
    },
    {
      icon: Laptop,
      title: 'Universal Cross-Platform',
      description: 'Flawlessly optimized for Chromebooks, Windows, MacBooks, iPads, and smartphones across any modern browser.',
      color: 'text-cyan-500 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50 border-cyan-200 dark:border-cyan-800/50',
    },
    {
      icon: Download,
      title: 'Zero Software Installation',
      description: 'Nothing to download or install. Open ClassPDF Maker and start compiling, converting, or compressing instantly.',
      color: 'text-purple-500 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800/50',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Select or Drop Documents',
      desc: 'Drag & drop photos, Word files, or existing PDFs into the browser workspace.',
      color: 'from-blue-600 to-indigo-600',
    },
    {
      num: '02',
      title: 'Tune Layout & Quality',
      desc: 'Customize margins (None/Small/Normal), compression slider, and page orientation.',
      color: 'from-indigo-600 to-cyan-500',
    },
    {
      num: '03',
      title: 'Download Optimized File',
      desc: 'Get your clean, watermark-free document compiled locally in milliseconds.',
      color: 'from-cyan-500 to-emerald-500',
    },
  ];

  return (
    <div className="space-y-16 py-6 relative">
      {/* SaaS Ambient Glow Backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[520px] bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Header Area (Sasico SaaS Style) */}
      <section className="text-center max-w-4xl mx-auto space-y-6 px-4 pt-4 sm:pt-8">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-[#131D31] border border-blue-200/80 dark:border-[#232B45] text-xs font-semibold text-blue-700 dark:text-[#22D3EE] shadow-xs">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Next-Gen Browser Document Utilities</span>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <span className="text-slate-600 dark:text-[#A7B0C5] hidden sm:inline">100% In-Browser Privacy</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-[#F8FAFC] leading-[1.12]">
          All Your PDF Tools.{' '}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 dark:from-blue-400 dark:via-indigo-400 dark:to-[#22D3EE] bg-clip-text text-transparent">
            One Simple Platform.
          </span>
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-[#A7B0C5] max-w-2xl mx-auto leading-relaxed">
          Convert, compress, and manage your documents effortlessly. Fast, simple, and accessible from anywhere — completely free and 100% private in your browser.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => scrollToSection('tools-section')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 active:scale-[0.98] rounded-2xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
          >
            <span>Explore PDF Tools</span>
            <ArrowDown className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('image-to-pdf-dropzone')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-slate-700 dark:text-[#F8FAFC] bg-white dark:bg-[#171D32] hover:bg-slate-50 dark:hover:bg-[#1E2640] border border-slate-200 dark:border-[#232B45] rounded-2xl transition-all shadow-xs cursor-pointer"
          >
            <ImageIcon className="w-4 h-4 text-indigo-500" />
            <span>Convert Images to PDF</span>
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('how-it-works')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3.5 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-[#A7B0C5] dark:hover:text-white transition-colors cursor-pointer"
          >
            <span>How It Works</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Trust Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 max-w-3xl mx-auto">
          <div className="p-3 rounded-2xl bg-white/80 dark:bg-[#131D31]/90 border border-slate-200/80 dark:border-[#232B45] text-left">
            <div className="text-base font-black text-slate-900 dark:text-white">100% Private</div>
            <div className="text-[11px] text-slate-500 dark:text-[#A7B0C5]">Zero Cloud Uploads</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/80 dark:bg-[#131D31]/90 border border-slate-200/80 dark:border-[#232B45] text-left">
            <div className="text-base font-black text-slate-900 dark:text-white">0s Waiting</div>
            <div className="text-[11px] text-slate-500 dark:text-[#A7B0C5]">Instant Local Engine</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/80 dark:bg-[#131D31]/90 border border-slate-200/80 dark:border-[#232B45] text-left">
            <div className="text-base font-black text-slate-900 dark:text-white">5+ Free Tools</div>
            <div className="text-[11px] text-slate-500 dark:text-[#A7B0C5]">Convert, Compress, Merge</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/80 dark:bg-[#131D31]/90 border border-slate-200/80 dark:border-[#232B45] text-left">
            <div className="text-base font-black text-slate-900 dark:text-white">No Watermarks</div>
            <div className="text-[11px] text-slate-500 dark:text-[#A7B0C5]">100% Free Forever</div>
          </div>
        </div>

        {/* Interactive Sasico SaaS Studio Mockup Preview Card */}
        <div className="pt-6">
          <div className="p-4 sm:p-6 rounded-3xl border border-slate-200/90 dark:border-[#232B45] bg-white dark:bg-[#111A2E] shadow-2xl shadow-blue-500/5 text-left relative overflow-hidden">
            {/* Mockup Top Tab Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-[#232B45]">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 mr-2">
                  <span className="w-3 h-3 rounded-full bg-rose-400 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-[#A7B0C5]">
                  ClassPDF Studio v2.4 SaaS
                </span>
              </div>

              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#171D32]">
                <button
                  type="button"
                  onClick={() => setHeroToolTab('image-pdf')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    heroToolTab === 'image-pdf'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-[#22D3EE] shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Image to PDF
                </button>
                <button
                  type="button"
                  onClick={() => setHeroToolTab('compress')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    heroToolTab === 'compress'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-[#22D3EE] shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Compress PDF
                </button>
                <button
                  type="button"
                  onClick={() => setHeroToolTab('word')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    heroToolTab === 'word'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-[#22D3EE] shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  PDF to Word
                </button>
              </div>
            </div>

            {/* Mockup Workspace */}
            <div className="pt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Column: Interactive Dropzone Preview */}
              <div className="lg:col-span-7 space-y-4">
                <div
                  onClick={() => {
                    if (heroToolTab === 'image-pdf') scrollToSection('image-to-pdf-dropzone');
                    else if (heroToolTab === 'compress') scrollToSection('compress-pdf');
                    else scrollToSection('pdf-to-word');
                  }}
                  className="p-8 rounded-2xl border-2 border-dashed border-blue-200 dark:border-blue-800/60 bg-blue-50/30 dark:bg-[#131D31]/60 flex flex-col items-center justify-center text-center gap-3 cursor-pointer hover:border-blue-400 transition-colors"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {heroToolTab === 'image-pdf' && 'Drop your lecture photos or notes here'}
                      {heroToolTab === 'compress' && 'Drop large PDF to optimize file size'}
                      {heroToolTab === 'word' && 'Drop PDF to convert to editable Word (.docx)'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-[#A7B0C5] mt-0.5">
                      High-speed client-side execution · No upload needed
                    </p>
                  </div>
                  <span className="px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs">
                    Launch Interactive Tool ↓
                  </span>
                </div>

                {/* Sample chips */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl border border-slate-200 dark:border-[#232B45] bg-slate-50 dark:bg-[#171D32] flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="truncate font-mono">Organic_Chem_Lecture.pdf</span>
                    </div>
                    <span className="text-[10px] text-emerald-500 font-bold shrink-0">Ready</span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-200 dark:border-[#232B45] bg-slate-50 dark:bg-[#171D32] flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <ImageIcon className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span className="truncate font-mono">Calc_HW_Scan_Page1.jpg</span>
                    </div>
                    <span className="text-[10px] text-emerald-500 font-bold shrink-0">2.4 MB</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Settings Showcase */}
              <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-50 dark:bg-[#171D32] border border-slate-200/80 dark:border-[#232B45] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#A7B0C5]">
                    Document Output Settings
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                    Client-Side Protected
                  </span>
                </div>

                {/* Live compression slider demo */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      Quality &amp; Size Optimization:
                    </span>
                    <span className="font-mono font-bold text-blue-600 dark:text-[#22D3EE]">
                      {compressSlider}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={compressSlider}
                    onChange={(e) => setCompressSlider(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-[#22D3EE]"
                    aria-label="Quality optimization slider"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Small (~380 KB)</span>
                    <span>Crisp Notes (~1.1 MB)</span>
                  </div>
                </div>

                {/* Feature bullet list */}
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-[#A7B0C5] pt-1">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>0mm, 8mm, or 16mm margin selection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>A4, US Letter, or original image aspect</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>Instant download without waiting in cloud queues</span>
                  </li>
                </ul>

                <button
                  type="button"
                  onClick={() => {
                    if (heroToolTab === 'image-pdf') scrollToSection('image-to-pdf-dropzone');
                    else if (heroToolTab === 'compress') scrollToSection('compress-pdf');
                    else scrollToSection('pdf-to-word');
                  }}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Use This Tool Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reserved Ad Placement */}
      <AdPlacement
        slotType="leaderboard"
        slotId="hero-below-intro"
        showAds={showAds}
        className="my-2"
      />

      {/* PDF Tools Cards Section (Sasico SaaS Style) */}
      <section id="tools-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-[#22D3EE]">
            Complete Document Suite
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-[#F8FAFC]">
            Professional PDF Tools
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A7B0C5]">
            Everything you need to convert, compress, and organize documents in one fast, unified interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                className="group p-6 rounded-3xl border border-slate-200/90 dark:border-[#232B45] bg-white dark:bg-[#171D32] hover:border-blue-400 dark:hover:border-cyan-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50/80 dark:bg-[#111827] border border-blue-100 dark:border-[#232B45] flex items-center justify-center text-blue-600 dark:text-[#22D3EE] group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${tool.badgeColor}`}>
                      {tool.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC] group-hover:text-blue-600 dark:group-hover:text-[#22D3EE] transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-[#A7B0C5] mt-1.5 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>

                  {/* Highlights */}
                  <ul className="space-y-1.5 pt-2 text-[11px] text-slate-500 dark:text-[#A7B0C5]">
                    {tool.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 dark:border-[#232B45]">
                  <button
                    type="button"
                    onClick={() => scrollToSection(tool.targetId)}
                    className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-blue-600 hover:text-white dark:bg-[#111827] dark:hover:bg-blue-600 text-slate-700 dark:text-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Launch {tool.title}</span>
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* 6th Card: Quality & Visual Fidelity Studio */}
          <div className="group p-6 rounded-3xl border border-slate-200/90 dark:border-[#232B45] bg-white dark:bg-[#171D32] hover:border-blue-400 dark:hover:border-cyan-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-200 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50/80 dark:bg-[#111827] border border-cyan-100 dark:border-[#232B45] flex items-center justify-center text-cyan-600 dark:text-[#22D3EE] group-hover:scale-105 transition-transform">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border bg-cyan-500/10 text-cyan-700 dark:text-[#22D3EE] border-cyan-200 dark:border-cyan-800/60">
                  Real-Time
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-[#F8FAFC] group-hover:text-blue-600 dark:group-hover:text-[#22D3EE] transition-colors">
                  Quality Preview Studio
                </h3>
                <p className="text-xs text-slate-500 dark:text-[#A7B0C5] mt-1.5 leading-relaxed">
                  Interactive split slider showing how image compression (70%, 80%, 90%) impacts formula sharpness and PDF byte size.
                </p>
              </div>

              <ul className="space-y-1.5 pt-2 text-[11px] text-slate-500 dark:text-[#A7B0C5]">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400 shrink-0" />
                  <span>Split comparison divider (Before vs After)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400 shrink-0" />
                  <span>Up to 300% zoom on handwritten formulas</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400 shrink-0" />
                  <span>Live canvas re-encoding with real byte stats</span>
                </li>
              </ul>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-100 dark:border-[#232B45]">
              <button
                type="button"
                onClick={onGoToConvert}
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-blue-600 hover:text-white dark:bg-[#111827] dark:hover:bg-blue-600 text-slate-700 dark:text-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Inspect Visual Fidelity</span>
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Drag-and-Drop Area for Image to PDF */}
      <section id="image-to-pdf-dropzone" className="max-w-4xl mx-auto px-4 pt-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-[#232B45]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-[#22D3EE] border border-blue-200 dark:border-blue-800/40 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">
                Image to PDF Converter
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#A7B0C5]">
                JPG, PNG, WEBP files up to 25MB each
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800/40">
            100% Client-Side
          </span>
        </div>

        <UploadDropzone
          onImagesAdded={onImagesAdded}
          currentCount={imagesCount}
        />

        {imagesCount > 0 && (
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-[#171D32] border border-indigo-200/80 dark:border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">
                  {imagesCount} {imagesCount === 1 ? 'image' : 'images'} ready for conversion
                </p>
                <p className="text-[11px] text-slate-500 dark:text-[#A7B0C5]">
                  Reorder pages, configure margins (None/Small/Normal) &amp; paper size in the workspace.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onGoToConvert}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <span>Continue to Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </section>

      {/* Live Tool Section: Compress PDF Tool */}
      <CompressPdfSection id="compress-pdf" />

      {/* Live Tool Section: PDF to Word Converter */}
      <PdfToWordSection id="pdf-to-word" />

      {/* Live Tool Section: Word to PDF Converter */}
      <WordToPdfSection id="word-to-pdf" />

      {/* Live Tool Section: Merge PDF Tool */}
      <MergePdfSection id="merge-pdf" />

      {/* SaaS How It Works Section */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-[#22D3EE]">
            Simple 3-Step Flow
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-[#F8FAFC]">
            How ClassPDF Maker Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A7B0C5]">
            Fast, secure document conversion without complicated software or waiting times.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((st) => (
            <div
              key={st.num}
              className="p-6 rounded-3xl border border-slate-200/90 dark:border-[#232B45] bg-white dark:bg-[#171D32] space-y-4 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${st.color} text-white font-mono font-black text-sm flex items-center justify-center shadow-md`}>
                  {st.num}
                </span>
                <span className="text-xs font-mono text-slate-400">Step {st.num}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {st.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#A7B0C5] leading-relaxed">
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SaaS 6 Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-[#22D3EE]">
            Engineered for Security &amp; Speed
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-[#F8FAFC]">
            Why Students &amp; Teams Choose ClassPDF
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A7B0C5]">
            Built specifically to solve document headaches with zero tracking and zero server storage.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-3xl border border-slate-200/90 dark:border-[#232B45] bg-white dark:bg-[#171D32] space-y-3 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${feat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-[#A7B0C5] leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* University Mission & Trust Banner */}
      <section className="max-w-5xl mx-auto px-4 pt-4">
        <div className="p-8 rounded-3xl border border-blue-200 dark:border-blue-900/60 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-white dark:from-[#131D31] dark:via-[#171D32] dark:to-[#0E1526] shadow-xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 dark:bg-blue-950/80 text-blue-800 dark:text-[#22D3EE] text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-cyan-500" />
            <span>Dedicated to Academic Integrity &amp; Student Privacy</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Safe, Instant Document Conversion for Everyone
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A7B0C5] max-w-2xl mx-auto leading-relaxed">
            Unlike other conversion sites that upload your private course materials and exam notes to unknown cloud servers, ClassPDF Maker runs all conversions completely inside your browser using client-side JavaScript.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => scrollToSection('image-to-pdf-dropzone')}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              Start Converting Documents Now →
            </button>
          </div>
        </div>
      </section>

      {/* Reserved Bottom Placement */}
      <AdPlacement slotType="footer-banner" slotId="page-bottom" showAds={showAds} />
    </div>
  );
};
