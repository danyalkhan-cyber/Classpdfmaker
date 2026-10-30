import React, { useEffect } from 'react';
import {
  Download,
  RotateCcw,
  CheckCircle2,
  FileText,
  ExternalLink,
  X,
  Share2,
  Sparkles,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ConversionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isConverting: boolean;
  progress: { current: number; total: number; message: string };
  result: {
    blob: Blob | null;
    blobUrl: string | null;
    pageCount: number;
    fileSizeBytes: number;
    filename: string;
  } | null;
  onStartNew: () => void;
}

export const ConversionModal: React.FC<ConversionModalProps> = ({
  isOpen,
  onClose,
  isConverting,
  progress,
  result,
  onStartNew,
}) => {
  useEffect(() => {
    if (result && !isConverting) {
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#0284c7', '#38bdf8', '#2563eb', '#10b981'],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [result, isConverting]);

  if (!isOpen) return null;

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleDownload = () => {
    if (!result?.blobUrl) return;
    const link = document.createElement('a');
    link.href = result.blobUrl;
    link.download = result.filename.endsWith('.pdf') ? result.filename : `${result.filename}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    if (!result?.blobUrl) return;
    window.open(result.blobUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-white dark:bg-[#171D32] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#232B45] flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-[#232B45] shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isConverting
                ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-500 dark:text-cyan-400 border border-indigo-200/50 dark:border-indigo-800/40'
                : 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
            }`}>
              {isConverting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">
                {isConverting ? 'Generating PDF Document...' : 'PDF Conversion Complete!'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#A7B0C5]">
                {isConverting
                  ? 'Compiling high-resolution pages in memory'
                  : 'Your document is verified and ready for download'}
              </p>
            </div>
          </div>

          {!isConverting && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-[#F8FAFC] rounded-lg hover:bg-slate-100 dark:hover:bg-[#1E2640] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {isConverting ? (
            <div className="py-12 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-500 dark:text-cyan-400 flex items-center justify-center animate-pulse border border-indigo-200/50 dark:border-indigo-800/40">
                <FileText className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-[#F8FAFC]">
                  {progress.message || 'Processing images into PDF...'}
                </p>
                <p className="text-xs text-slate-500 dark:text-[#A7B0C5] font-mono tabular-nums">
                  {progress.total > 0
                    ? `Page ${progress.current} of ${progress.total} (${Math.round((progress.current / progress.total) * 100)}%)`
                    : 'Initializing renderer...'}
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full max-w-md h-2.5 bg-slate-100 dark:bg-[#0B1020] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-200"
                  style={{
                    width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 15}%`,
                  }}
                />
              </div>

              <p className="text-xs text-slate-400 dark:text-[#A7B0C5] max-w-sm">
                Processing entirely client-side for strict privacy. Note pages remain strictly in your browser.
              </p>
            </div>
          ) : result ? (
            <div className="space-y-5">
              {/* Document Stats Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 dark:bg-[#111827] rounded-2xl border border-slate-100 dark:border-[#232B45]">
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-[#A7B0C5]">Document Name</div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-[#F8FAFC] truncate font-mono mt-0.5" title={result.filename}>
                    {result.filename}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-[#A7B0C5]">Total Pages</div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-[#F8FAFC] font-mono mt-0.5">
                    {result.pageCount} {result.pageCount === 1 ? 'Page' : 'Pages'}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-[#A7B0C5]">File Size</div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-[#F8FAFC] font-mono mt-0.5">
                    {formatSize(result.fileSizeBytes)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-[#A7B0C5]">Status</div>
                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified PDF
                  </div>
                </div>
              </div>

              {/* PDF Preview Frame */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-[#A7B0C5]">
                    Live PDF Document Preview
                  </span>
                  {result.blobUrl && (
                    <button
                      type="button"
                      onClick={handleOpenInNewTab}
                      className="inline-flex items-center gap-1 text-xs text-indigo-500 dark:text-cyan-400 hover:underline font-medium cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open in New Tab</span>
                    </button>
                  )}
                </div>

                <div className="w-full h-80 sm:h-96 rounded-2xl border border-slate-200 dark:border-[#232B45] overflow-hidden bg-slate-100 dark:bg-[#0B1020] flex items-center justify-center">
                  {result.blobUrl ? (
                    <iframe
                      src={`${result.blobUrl}#toolbar=0&navpanes=0`}
                      title="PDF Document Preview"
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <div className="text-xs text-slate-400">Preview not available</div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer Actions */}
        {!isConverting && result && (
          <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-[#232B45] bg-slate-50/50 dark:bg-[#111827] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={onStartNew}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-[#F8FAFC] border border-slate-200 dark:border-[#232B45] hover:bg-slate-100 dark:hover:bg-[#1E2640] rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Start New Conversion</span>
            </button>

            <div className="w-full sm:w-auto flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 active:scale-[0.98] rounded-xl shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
