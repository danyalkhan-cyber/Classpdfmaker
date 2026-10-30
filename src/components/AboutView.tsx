import React from 'react';
import {
  BookOpen,
  Camera,
  CheckCircle,
  ShieldCheck,
  Zap,
  Sparkles,
  FileText,
  Lock,
  Sliders,
  Download,
  Layers,
  GraduationCap,
  ArrowRight
} from 'lucide-react';

interface AboutViewProps {
  onGoToConvert: () => void;
  onSelectTab?: (tab: 'home' | 'convert' | 'files' | 'about' | 'contact' | 'privacy' | 'terms' | 'pdf-to-word' | 'word-to-pdf' | 'merge-pdf' | 'compress-pdf') => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onGoToConvert, onSelectTab }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Mission Statement */}
      <div className="bg-gradient-to-br from-indigo-50/50 via-white to-slate-50 dark:from-[#171D32] dark:via-[#111827] dark:to-[#0B1020] p-8 sm:p-10 rounded-3xl border border-indigo-100/60 dark:border-[#232B45] text-center space-y-5 shadow-xs">
        <div className="w-20 h-20 rounded-2xl bg-white dark:bg-[#171D32] border border-slate-200 dark:border-[#232B45] p-2 mx-auto shadow-md shadow-indigo-500/10 flex items-center justify-center">
          <img
            src="/assets/aistudio/website_logo_fdd01625.png"
            alt="ClassPDF Maker Logo"
            className="w-full h-full object-contain rounded-xl"
          />
        </div>

        <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-700 dark:text-cyan-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/50 dark:border-indigo-800/40 px-3 py-1 rounded-md">
          <GraduationCap className="w-3.5 h-3.5 text-indigo-500 dark:text-cyan-400" />
          <span>Built for Students, Educators &amp; Everyday Users</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-[#F8FAFC]">
          About ClassPDF Maker
        </h1>

        <blockquote className="text-base sm:text-lg text-slate-700 dark:text-[#F8FAFC] font-medium max-w-2xl mx-auto leading-relaxed">
          "ClassPDF Maker is a simple, browser-based utility designed to help students convert assignment pictures, handwritten lecture notes, and study materials into clean, standard PDF documents. Our mission is to make document preparation quick, convenient, and strictly privacy-conscious."
        </blockquote>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onGoToConvert}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 active:scale-[0.98] rounded-xl shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Open Converter Workspace</span>
          </button>
        </div>
      </div>

      {/* Explaining the Image-to-PDF Conversion Service */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F8FAFC]">
            How Our Image-to-PDF Service Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A7B0C5]">
            A seamless 4-step workflow that turns phone camera photos into publication-grade documents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Step 1 */}
          <div className="p-6 bg-white dark:bg-[#171D32] rounded-2xl border border-slate-200/80 dark:border-[#232B45] space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-cyan-400 border border-indigo-200/50 dark:border-indigo-800/40 font-bold text-xs flex items-center justify-center">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#F8FAFC]">
                Batch Image Upload &amp; Previews
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-[#A7B0C5] leading-relaxed">
              Drop one or multiple photos (JPG, PNG, WEBP, HEIC) simultaneously. Drag and drop to re-order pages to match your assignment sequence or lecture note chronology.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 bg-white dark:bg-[#171D32] rounded-2xl border border-slate-200/80 dark:border-[#232B45] space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-cyan-400 border border-indigo-200/50 dark:border-indigo-800/40 font-bold text-xs flex items-center justify-center">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#F8FAFC]">
                Rotate, Crop &amp; Scan Enhancements
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-[#A7B0C5] leading-relaxed">
              Use built-in editing tools in the Image Preview modal. Quickly rotate sideways pages by 90°, crop out unwanted desk borders, and apply "Clean Scan" filters to whiten paper and darken pencil handwriting.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 bg-white dark:bg-[#171D32] rounded-2xl border border-slate-200/80 dark:border-[#232B45] space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-cyan-400 border border-indigo-200/50 dark:border-indigo-800/40 font-bold text-xs flex items-center justify-center">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#F8FAFC]">
                Academic Layout &amp; Page Numbering
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-[#A7B0C5] leading-relaxed">
              Select standard A4 or US Letter sizes with tailored margins. Add automated page numbers ("Page 1 of 5") directly onto each page.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 bg-white dark:bg-[#171D32] rounded-2xl border border-slate-200/80 dark:border-[#232B45] space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-cyan-400 border border-indigo-200/50 dark:border-indigo-800/40 font-bold text-xs flex items-center justify-center">
                4
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#F8FAFC]">
                Instant Local PDF Generation &amp; Download
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-[#A7B0C5] leading-relaxed">
              Click Convert to generate an official PDF blob in fractions of a second. No watermarks are added, and downloads save straight to your device ready for submission to Canvas, Blackboard, or email.
            </p>
          </div>
        </div>
      </section>

      {/* 3 Core Architectural Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 bg-white dark:bg-[#171D32] rounded-2xl border border-slate-200/80 dark:border-[#232B45] space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-cyan-400 border border-indigo-200/50 dark:border-indigo-800/40 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-[#F8FAFC]">
            100% In-Browser Privacy
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#A7B0C5] leading-relaxed">
            All document compilation is done locally via HTML5 Canvas and client JavaScript. Your homework, exams, and notes never touch remote servers.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-[#171D32] rounded-2xl border border-slate-200/80 dark:border-[#232B45] space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-[#F8FAFC]">
            Zero Fees &amp; Watermark-Free
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#A7B0C5] leading-relaxed">
            Unlike commercial mobile scanner apps that force subscriptions or stamp watermarks, ClassPDF Maker creates clean, unbranded academic PDFs.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-[#171D32] rounded-2xl border border-slate-200/80 dark:border-[#232B45] space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/40 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-[#F8FAFC]">
            Academic &amp; Classroom Ready
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#A7B0C5] leading-relaxed">
            Lightweight file sizes that fit strict university LMS upload limits (e.g., under 15MB) with consistent high resolution for instructors.
          </p>
        </div>
      </div>

      {/* Photography Tips for Clean PDFs */}
      <div className="p-6 sm:p-8 bg-white dark:bg-[#171D32] rounded-2xl border border-slate-200/80 dark:border-[#232B45] space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-cyan-400 border border-indigo-200/50 dark:border-indigo-800/40 flex items-center justify-center">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">
              Student Guide: Best Practices for Document Photography
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#A7B0C5]">
              Quick tips to ensure your professors and TAs can read every equation and diagram
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs text-slate-600 dark:text-[#A7B0C5]">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-100 dark:border-[#232B45] flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-[#F8FAFC]">Shoot parallel to the page</p>
              <p className="text-slate-500 dark:text-[#A7B0C5] mt-0.5">Hold your camera flat above the desk to prevent trapezoidal perspective distortion.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-100 dark:border-[#232B45] flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-[#F8FAFC]">Avoid hand shadows</p>
              <p className="text-slate-500 dark:text-[#A7B0C5] mt-0.5">Position your desk lamp from the side rather than holding your phone directly under light.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-100 dark:border-[#232B45] flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-[#F8FAFC]">Use Clean Scan for pencil</p>
              <p className="text-slate-500 dark:text-[#A7B0C5] mt-0.5">Click into any uploaded image preview to apply the Clean Scan preset for crisp contrast.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-100 dark:border-[#232B45] flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-[#F8FAFC]">Check page numbers</p>
              <p className="text-slate-500 dark:text-[#A7B0C5] mt-0.5">Keep "Add Page Numbers" enabled so grading assistants can easily reference answers.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Information & Legal Navigation Grid */}
      {onSelectTab && (
        <div className="p-6 bg-white dark:bg-[#171D32] rounded-2xl border border-slate-200/80 dark:border-[#232B45] flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-[#F8FAFC] uppercase tracking-wider">
              Legal, Privacy &amp; Support
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#A7B0C5] mt-0.5">
              Read our full policies on client privacy, terms of use, and verified contact
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => onSelectTab('contact')}
              className="px-3.5 py-1.5 text-xs font-semibold text-indigo-600 dark:text-cyan-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/50 dark:border-indigo-800/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-xl transition-colors cursor-pointer"
            >
              Contact Us
            </button>
            <button
              onClick={() => onSelectTab('privacy')}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-[#F8FAFC] bg-slate-100 dark:bg-[#111827] border border-slate-200/80 dark:border-[#232B45] hover:bg-slate-200 dark:hover:bg-[#1E2640] rounded-xl transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onSelectTab('terms')}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-[#F8FAFC] bg-slate-100 dark:bg-[#111827] border border-slate-200/80 dark:border-[#232B45] hover:bg-slate-200 dark:hover:bg-[#1E2640] rounded-xl transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
