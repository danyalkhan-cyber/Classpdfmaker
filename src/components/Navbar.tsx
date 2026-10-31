import { ShieldCheck, Sun, Moon, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentTab: 'home' | 'convert' | 'files' | 'about' | 'contact' | 'privacy' | 'terms' | 'pdf-to-word' | 'word-to-pdf' | 'merge-pdf' | 'compress-pdf' | 'design-preview';
  onSelectTab: (tab: 'home' | 'convert' | 'files' | 'about' | 'contact' | 'privacy' | 'terms' | 'pdf-to-word' | 'word-to-pdf' | 'merge-pdf' | 'compress-pdf' | 'design-preview') => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  imagesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  isDarkMode,
  onToggleDarkMode,
  imagesCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-[#0B1020]/85 backdrop-blur-md border-b border-slate-200/80 dark:border-[#232B45] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand wordmark & logo */}
        <button
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2.5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
          aria-label="ClassPDF Maker Home"
        >
          <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#171D32] border border-slate-200/90 dark:border-[#232B45] shadow-xs p-1 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <img
              src="/logo.png"
              alt="ClassPDF Maker Logo"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-[#F8FAFC] whitespace-nowrap">
              ClassPDF<span className="text-blue-600 dark:text-cyan-400 font-semibold">Maker</span>
            </span>
            <span className="hidden sm:inline-block text-[9px] font-mono font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-cyan-950/60 text-blue-700 dark:text-[#22D3EE] border border-blue-200 dark:border-cyan-800/60">
              SaaS
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Single-line, clean typography, refined hover) */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => onSelectTab('home')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              currentTab === 'home'
                ? 'text-indigo-600 dark:text-[#22D3EE] font-semibold bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/50 dark:border-indigo-500/30'
                : 'text-slate-600 dark:text-[#A7B0C5] hover:text-slate-900 dark:hover:text-[#F8FAFC] hover:bg-slate-100/70 dark:hover:bg-[#171D32]/70'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onSelectTab('convert')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'convert'
                ? 'text-indigo-600 dark:text-[#22D3EE] font-semibold bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/50 dark:border-indigo-500/30'
                : 'text-slate-600 dark:text-[#A7B0C5] hover:text-slate-900 dark:hover:text-[#F8FAFC] hover:bg-slate-100/70 dark:hover:bg-[#171D32]/70'
            }`}
          >
            <span>Image to PDF</span>
            {imagesCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-mono font-semibold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded">
                {imagesCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onSelectTab('pdf-to-word')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'pdf-to-word'
                ? 'text-indigo-600 dark:text-[#22D3EE] font-semibold bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/50 dark:border-indigo-500/30'
                : 'text-slate-600 dark:text-[#A7B0C5] hover:text-slate-900 dark:hover:text-[#F8FAFC] hover:bg-slate-100/70 dark:hover:bg-[#171D32]/70'
            }`}
          >
            <span>PDF to Word</span>
          </button>
          <button
            onClick={() => onSelectTab('word-to-pdf')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'word-to-pdf'
                ? 'text-indigo-600 dark:text-[#22D3EE] font-semibold bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/50 dark:border-indigo-500/30'
                : 'text-slate-600 dark:text-[#A7B0C5] hover:text-slate-900 dark:hover:text-[#F8FAFC] hover:bg-slate-100/70 dark:hover:bg-[#171D32]/70'
            }`}
          >
            <span>Word to PDF</span>
            <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider bg-cyan-100/80 dark:bg-cyan-950/60 text-cyan-800 dark:text-[#22D3EE] border border-cyan-200/50 dark:border-cyan-800/40 rounded">
              New
            </span>
          </button>
          <button
            onClick={() => onSelectTab('merge-pdf')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'merge-pdf'
                ? 'text-indigo-600 dark:text-[#22D3EE] font-semibold bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/50 dark:border-indigo-500/30'
                : 'text-slate-600 dark:text-[#A7B0C5] hover:text-slate-900 dark:hover:text-[#F8FAFC] hover:bg-slate-100/70 dark:hover:bg-[#171D32]/70'
            }`}
          >
            <span>Merge PDF</span>
          </button>
          <button
            onClick={() => onSelectTab('compress-pdf')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'compress-pdf'
                ? 'text-indigo-600 dark:text-[#22D3EE] font-semibold bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/50 dark:border-indigo-500/30'
                : 'text-slate-600 dark:text-[#A7B0C5] hover:text-slate-900 dark:hover:text-[#F8FAFC] hover:bg-slate-100/70 dark:hover:bg-[#171D32]/70'
            }`}
          >
            <span>Compress PDF</span>
            <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider bg-cyan-100/80 dark:bg-cyan-950/60 text-cyan-800 dark:text-[#22D3EE] border border-cyan-200/50 dark:border-cyan-800/40 rounded">
              New
            </span>
          </button>
          <button
            onClick={() => onSelectTab('files')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              currentTab === 'files'
                ? 'text-indigo-600 dark:text-[#22D3EE] font-semibold bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/50 dark:border-indigo-500/30'
                : 'text-slate-600 dark:text-[#A7B0C5] hover:text-slate-900 dark:hover:text-[#F8FAFC] hover:bg-slate-100/70 dark:hover:bg-[#171D32]/70'
            }`}
          >
            My Files
          </button>
          <button
            onClick={() => onSelectTab('about')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              currentTab === 'about'
                ? 'text-indigo-600 dark:text-[#22D3EE] font-semibold bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/50 dark:border-indigo-500/30'
                : 'text-slate-600 dark:text-[#A7B0C5] hover:text-slate-900 dark:hover:text-[#F8FAFC] hover:bg-slate-100/70 dark:hover:bg-[#171D32]/70'
            }`}
          >
            About
          </button>
          <button
            onClick={() => onSelectTab('contact')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              currentTab === 'contact'
                ? 'text-indigo-600 dark:text-[#22D3EE] font-semibold bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/50 dark:border-indigo-500/30'
                : 'text-slate-600 dark:text-[#A7B0C5] hover:text-slate-900 dark:hover:text-[#F8FAFC] hover:bg-slate-100/70 dark:hover:bg-[#171D32]/70'
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Zone 3: Actions (Free Public Access Badge, Theme, Primary CTA) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Public Access Badge */}
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:text-[#A7B0C5] bg-slate-100/80 dark:bg-[#111827] border border-slate-200 dark:border-[#232B45] rounded-lg whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span>100% In-Browser</span>
          </div>

          {/* All Tools Trigger */}
          <button
            type="button"
            onClick={() => {
              if (currentTab === 'home') {
                const el = document.getElementById('tools-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              } else {
                onSelectTab('home');
              }
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-blue-700 dark:text-[#22D3EE] bg-blue-50/80 dark:bg-cyan-950/40 border border-blue-200/60 dark:border-cyan-800/50 rounded-lg hover:bg-blue-100 dark:hover:bg-cyan-900/50 transition-colors cursor-pointer"
            title="Explore all 5 document tools"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
            <span>All Tools</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="p-2 text-slate-600 dark:text-[#A7B0C5] hover:text-slate-900 dark:hover:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-[#171D32] border border-slate-200/60 dark:border-[#232B45] rounded-lg transition-all cursor-pointer"
            aria-label={isDarkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}
            title={isDarkMode ? 'Current: Dark Mode (Click for Light Mode)' : 'Current: Light Mode (Click for Dark Mode)'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Quick Action Button */}
          {currentTab !== 'convert' ? (
            <button
              onClick={() => onSelectTab('convert')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 active:scale-[0.98] rounded-lg shadow-sm shadow-indigo-600/25 transition-all whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Convert Now</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Mobile sub-bar navigation */}
      <div className="lg:hidden flex items-center gap-1 border-t border-slate-200/80 dark:border-[#232B45] py-2 px-3 bg-white/95 dark:bg-[#0B1020]/95 overflow-x-auto scrollbar-none">
        <button
          onClick={() => onSelectTab('home')}
          className={`text-xs font-medium px-2.5 py-1 rounded-md whitespace-nowrap transition-colors ${
            currentTab === 'home'
              ? 'text-indigo-600 dark:text-[#22D3EE] font-semibold bg-indigo-50 dark:bg-indigo-950/50'
              : 'text-slate-600 dark:text-[#A7B0C5]'
          }`}
        >
          Home
        </button>
        <button
          onClick={() => onSelectTab('convert')}
          className={`text-xs font-medium px-2.5 py-1 rounded-md flex items-center gap-1 whitespace-nowrap transition-colors ${
            currentTab === 'convert'
              ? 'text-indigo-600 dark:text-[#22D3EE] font-semibold bg-indigo-50 dark:bg-indigo-950/50'
              : 'text-slate-600 dark:text-[#A7B0C5]'
          }`}
        >
          Image to PDF
          {imagesCount > 0 && (
            <span className="px-1 text-[10px] bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded font-mono">
              {imagesCount}
            </span>
          )}
        </button>
        <button
          onClick={() => onSelectTab('pdf-to-word')}
          className={`text-xs font-medium px-2.5 py-1 rounded-md whitespace-nowrap transition-colors ${
            currentTab === 'pdf-to-word'
              ? 'text-indigo-600 dark:text-[#22D3EE] font-semibold bg-indigo-50 dark:bg-indigo-950/50'
              : 'text-slate-600 dark:text-[#A7B0C5]'
          }`}
        >
          PDF to Word
        </button>
        <button
          onClick={() => onSelectTab('word-to-pdf')}
          className={`text-xs font-medium px-2.5 py-1 rounded-md whitespace-nowrap transition-colors ${
            currentTab === 'word-to-pdf'
              ? 'text-indigo-600 dark:text-[#22D3EE] font-semibold bg-indigo-50 dark:bg-indigo-950/50'
              : 'text-slate-600 dark:text-[#A7B0C5]'
          }`}
        >
          Word to PDF
        </button>
        <button
          onClick={() => onSelectTab('merge-pdf')}
          className={`text-xs font-medium px-2.5 py-1 rounded-md whitespace-nowrap transition-colors ${
            currentTab === 'merge-pdf'
              ? 'text-indigo-600 dark:text-[#22D3EE] font-semibold bg-indigo-50 dark:bg-indigo-950/50'
              : 'text-slate-600 dark:text-[#A7B0C5]'
          }`}
        >
          Merge PDF
        </button>
        <button
          onClick={() => onSelectTab('compress-pdf')}
          className={`text-xs font-medium px-2.5 py-1 rounded-md whitespace-nowrap transition-colors ${
            currentTab === 'compress-pdf'
              ? 'text-indigo-600 dark:text-[#22D3EE] font-semibold bg-indigo-50 dark:bg-indigo-950/50'
              : 'text-slate-600 dark:text-[#A7B0C5]'
          }`}
        >
          Compress PDF
        </button>
        <button
          onClick={() => onSelectTab('files')}
          className={`text-xs font-medium px-2.5 py-1 rounded-md whitespace-nowrap transition-colors ${
            currentTab === 'files'
              ? 'text-indigo-600 dark:text-[#22D3EE] font-semibold bg-indigo-50 dark:bg-indigo-950/50'
              : 'text-slate-600 dark:text-[#A7B0C5]'
          }`}
        >
          My Files
        </button>
        <button
          onClick={() => onSelectTab('about')}
          className={`text-xs font-medium px-2.5 py-1 rounded-md whitespace-nowrap transition-colors ${
            currentTab === 'about'
              ? 'text-indigo-600 dark:text-[#22D3EE] font-semibold bg-indigo-50 dark:bg-indigo-950/50'
              : 'text-slate-600 dark:text-[#A7B0C5]'
          }`}
        >
          About
        </button>
        <button
          onClick={() => onSelectTab('contact')}
          className={`text-xs font-medium px-2.5 py-1 rounded-md whitespace-nowrap transition-colors ${
            currentTab === 'contact'
              ? 'text-indigo-600 dark:text-[#22D3EE] font-semibold bg-indigo-50 dark:bg-indigo-950/50'
              : 'text-slate-600 dark:text-[#A7B0C5]'
          }`}
        >
          Contact
        </button>
        <button
          onClick={() => {
            if (currentTab === 'home') {
              const el = document.getElementById('tools-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            } else {
              onSelectTab('home');
            }
          }}
          className="text-xs font-semibold px-2.5 py-1 rounded-md whitespace-nowrap transition-colors flex items-center gap-1 text-blue-600 dark:text-[#22D3EE]"
        >
          <Sparkles className="w-3 h-3" />
          <span>All Tools</span>
        </button>
      </div>
    </header>
  );
};
