import { ShieldCheck, Sun, Moon, Sparkles, Film } from 'lucide-react';
import { StudentAuthSession } from '../types';

interface NavbarProps {
  currentTab: 'home' | 'convert' | 'files' | 'about' | 'contact' | 'privacy' | 'terms' | 'pdf-to-word';
  onSelectTab: (tab: 'home' | 'convert' | 'files' | 'about' | 'contact' | 'privacy' | 'terms' | 'pdf-to-word') => void;
  authSession: StudentAuthSession;
  onOpenAuthModal: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  imagesCount: number;
  onOpenVideoStudio?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  authSession,
  onOpenAuthModal,
  isDarkMode,
  onToggleDarkMode,
  imagesCount,
  onOpenVideoStudio,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark & logo */}
        <button
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2.5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-lg p-1"
          aria-label="ClassPDF Maker Home"
        >
          <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 shadow-xs p-1 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <img
              src="/logo.png"
              alt="ClassPDF Maker Logo"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
              ClassPDF<span className="text-sky-600 dark:text-sky-400 font-semibold">Maker</span>
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Single-line, clean typography, hover transitions) */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onSelectTab('home')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'home'
                ? 'text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onSelectTab('convert')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'convert'
                ? 'text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
            }`}
          >
            <span>Image to PDF</span>
            {imagesCount > 0 && (
              <span className="px-1.5 py-0.2 text-[11px] font-semibold bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 rounded-md">
                {imagesCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onSelectTab('pdf-to-word')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'pdf-to-word'
                ? 'text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
            }`}
          >
            <span>PDF to Word</span>
            <span className="px-1.5 py-0.2 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 rounded">
              New
            </span>
          </button>
          <button
            onClick={() => onSelectTab('files')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'files'
                ? 'text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
            }`}
          >
            My Files
          </button>
          <button
            onClick={() => onSelectTab('about')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'about'
                ? 'text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
            }`}
          >
            About
          </button>
          <button
            onClick={() => onSelectTab('contact')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              currentTab === 'contact'
                ? 'text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/70'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Zone 3: Actions (Free Public Access Badge, Theme, Primary CTA) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Public Access Badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-lg whitespace-nowrap">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Public & Free</span>
          </div>

          {/* Optional Coversheet Header Button */}
          <button
            onClick={onOpenAuthModal}
            title={authSession.studentName ? `Header Stamp: ${authSession.studentName}` : 'Configure optional student name / course header for PDF'}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
          >
            <span className="hidden sm:inline">
              {authSession.studentName ? `Header: ${authSession.studentName.split(' ')[0]}` : 'Optional Header'}
            </span>
            <span className="sm:hidden">Header</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="p-2 text-slate-600 dark:text-amber-400 hover:text-slate-900 dark:hover:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
            aria-label={isDarkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}
            title={isDarkMode ? 'Current: Dark Mode (Click for Light Mode)' : 'Current: Light Mode (Click for Dark Mode)'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* AI Video Studio Button */}
          {onOpenVideoStudio && (
            <button
              onClick={onOpenVideoStudio}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
              title="Animate images into video using Gemini Omni Flash"
            >
              <Film className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span className="hidden lg:inline">Video Studio</span>
            </button>
          )}

          {/* Quick Action Button */}
          {currentTab !== 'convert' ? (
            <button
              onClick={() => onSelectTab('convert')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 active:bg-sky-700 rounded-lg shadow-xs shadow-sky-600/30 transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Convert Now</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Mobile sub-bar navigation */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200/60 dark:border-slate-800 py-2 px-3 bg-white/95 dark:bg-slate-900/95 overflow-x-auto">
        <button
          onClick={() => onSelectTab('home')}
          className={`text-xs font-medium px-2 py-1 rounded whitespace-nowrap ${
            currentTab === 'home' ? 'text-sky-600 font-semibold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Home
        </button>
        <button
          onClick={() => onSelectTab('convert')}
          className={`text-xs font-medium px-2 py-1 rounded flex items-center gap-1 whitespace-nowrap ${
            currentTab === 'convert' ? 'text-sky-600 font-semibold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Image to PDF
          {imagesCount > 0 && (
            <span className="px-1 text-[10px] bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 rounded">
              {imagesCount}
            </span>
          )}
        </button>
        <button
          onClick={() => onSelectTab('pdf-to-word')}
          className={`text-xs font-medium px-2 py-1 rounded whitespace-nowrap ${
            currentTab === 'pdf-to-word' ? 'text-sky-600 font-semibold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          PDF to Word
        </button>
        <button
          onClick={() => onSelectTab('files')}
          className={`text-xs font-medium px-2 py-1 rounded whitespace-nowrap ${
            currentTab === 'files' ? 'text-sky-600 font-semibold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          My Files
        </button>
        <button
          onClick={() => onSelectTab('about')}
          className={`text-xs font-medium px-2 py-1 rounded whitespace-nowrap ${
            currentTab === 'about' ? 'text-sky-600 font-semibold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          About
        </button>
        <button
          onClick={() => onSelectTab('contact')}
          className={`text-xs font-medium px-2 py-1 rounded whitespace-nowrap ${
            currentTab === 'contact' ? 'text-sky-600 font-semibold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Contact
        </button>
      </div>
    </header>
  );
};
