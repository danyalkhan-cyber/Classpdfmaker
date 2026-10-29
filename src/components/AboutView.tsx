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
      <div className="bg-gradient-to-br from-sky-50 via-white to-blue-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 p-8 sm:p-10 rounded-3xl border border-sky-100 dark:border-slate-800 text-center space-y-5 shadow-xs">
        <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 mx-auto shadow-md shadow-sky-500/10 flex items-center justify-center">
          <img
            src="/assets/aistudio/website_logo_fdd01625.png"
            alt="ClassPDF Maker Logo"
            className="w-full h-full object-contain rounded-xl"
          />
        </div>

        <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-700 dark:text-sky-300 bg-sky-100/60 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800 px-3 py-1 rounded-full">
          <GraduationCap className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span>Built for Students, Educators & Everyday Users</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          About ClassPDF Maker
        </h1>

        <blockquote className="text-base sm:text-lg text-slate-700 dark:text-slate-200 font-medium max-w-2xl mx-auto leading-relaxed">
          "ClassPDF Maker is a simple, browser-based utility designed to help students convert assignment pictures, handwritten lecture notes, and study materials into clean, standard PDF documents. Our mission is to make document preparation quick, convenient, and strictly privacy-conscious."
        </blockquote>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onGoToConvert}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-xs transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open Converter Workspace</span>
          </button>
        </div>
      </div>

      {/* Explaining the Image-to-PDF Conversion Service */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            How Our Image-to-PDF Service Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            A seamless 4-step workflow that turns phone camera photos into publication-grade documents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Step 1 */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 font-bold text-xs flex items-center justify-center">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Batch Image Upload & Previews
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Drop one or multiple photos (JPG, PNG, WEBP, HEIC) simultaneously. Drag and drop to re-order pages to match your assignment sequence or lecture note chronology.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 font-bold text-xs flex items-center justify-center">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Rotate, Crop & Scan Enhancements
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Use built-in editing tools in the Image Preview modal. Quickly rotate sideways pages by 90°, crop out unwanted desk borders, and apply "Clean Scan" filters to whiten paper and darken pencil handwriting.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 font-bold text-xs flex items-center justify-center">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Academic Layout & Page Numbering
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Select standard A4 or US Letter sizes with tailored margins. Add automated page numbers ("Page 1 of 5") and optional student coversheet headers (Student Name, Course Code) directly onto each page.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 font-bold text-xs flex items-center justify-center">
                4
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Instant Local PDF Generation & Download
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Click Convert to generate an official PDF blob in fractions of a second. No watermarks are added, and downloads save straight to your device ready for submission to Canvas, Blackboard, or email.
            </p>
          </div>
        </div>
      </section>

      {/* 3 Core Architectural Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            100% In-Browser Privacy
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            All document compilation is done locally via HTML5 Canvas and client JavaScript. Your homework, exams, and notes never touch remote servers.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Zero Fees & Watermark-Free
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Unlike commercial mobile scanner apps that force subscriptions or stamp watermarks, ClassPDF Maker creates clean, unbranded academic PDFs.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Academic & Classroom Ready
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Lightweight file sizes that fit strict university LMS upload limits (e.g., under 15MB) with consistent high resolution for instructors.
          </p>
        </div>
      </div>

      {/* Photography Tips for Clean PDFs */}
      <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Student Guide: Best Practices for Document Photography
            </h2>
            <p className="text-xs text-slate-500">
              Quick tips to ensure your professors and TAs can read every equation and diagram
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs text-slate-600 dark:text-slate-300">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Shoot parallel to the page</p>
              <p className="text-slate-500 mt-0.5">Hold your camera flat above the desk to prevent trapezoidal perspective distortion.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Avoid hand shadows</p>
              <p className="text-slate-500 mt-0.5">Position your desk lamp from the side rather than holding your phone directly under light.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Use Clean Scan for pencil</p>
              <p className="text-slate-500 mt-0.5">Click into any uploaded image preview to apply the Clean Scan preset for crisp contrast.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Check page numbers</p>
              <p className="text-slate-500 mt-0.5">Keep "Add Page Numbers" enabled so grading assistants can easily reference answers.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Information & Legal Navigation Grid */}
      {onSelectTab && (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Legal, Privacy & Support
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Read our full policies on client privacy, terms of use, and verified contact
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => onSelectTab('contact')}
              className="px-3 py-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900 rounded-lg transition-colors cursor-pointer"
            >
              Contact Us
            </button>
            <button
              onClick={() => onSelectTab('privacy')}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onSelectTab('terms')}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
