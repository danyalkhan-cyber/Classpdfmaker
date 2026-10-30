import React from 'react';
import {
  FileText,
  Download,
  Trash2,
  Calendar,
  Layers,
  HardDrive,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Search
} from 'lucide-react';
import { ConversionHistoryItem } from '../types';

interface MyFilesViewProps {
  history: ConversionHistoryItem[];
  onDownloadItem: (item: ConversionHistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearHistory: () => void;
  onGoToConvert: () => void;
}

export const MyFilesView: React.FC<MyFilesViewProps> = ({
  history,
  onDownloadItem,
  onDeleteItem,
  onClearHistory,
  onGoToConvert,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const filteredHistory = history.filter((item) =>
    item.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-[#232B45]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F8FAFC]">
            My Converted PDFs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A7B0C5] mt-1">
            Browser-local document history and downloads for your university classes
          </p>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={onClearHistory}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors border border-transparent dark:hover:border-rose-900/40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
            <button
              onClick={onGoToConvert}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>New PDF</span>
            </button>
          </div>
        )}
      </div>

      {/* Storage and Privacy Explainer Banner */}
      <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-[#171D32] border border-indigo-100 dark:border-[#232B45] flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-[#22D3EE] shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 dark:text-[#A7B0C5] leading-relaxed">
          <span className="font-semibold text-slate-800 dark:text-[#F8FAFC]">Local Privacy Notice:</span>{' '}
          All generation records and files are saved exclusively in your browser's private local storage. They do not synchronize to remote servers or third-party devices, ensuring strict privacy for your academic coursework.
        </div>
      </div>

      {history.length === 0 ? (
        /* Empty State */
        <div className="py-16 text-center bg-white dark:bg-[#171D32] rounded-3xl border border-slate-200/80 dark:border-[#232B45] p-8 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-[#111827] text-slate-400 dark:text-indigo-400 border border-slate-200 dark:border-[#232B45] flex items-center justify-center mx-auto">
            <HardDrive className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">
              No converted PDFs yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#A7B0C5] mt-1 leading-relaxed">
              Upload photos of assignments, textbook pages, or lecture notes to compile your first PDF document.
            </p>
          </div>
          <button
            onClick={onGoToConvert}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Convert Your First Note to PDF</span>
          </button>
        </div>
      ) : (
        /* Populated Table & Cards */
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-slate-400 dark:text-[#A7B0C5] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by filename..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-[#171D32] border border-slate-200 dark:border-[#232B45] rounded-xl text-slate-900 dark:text-[#F8FAFC] placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="bg-white dark:bg-[#171D32] rounded-2xl border border-slate-200/80 dark:border-[#232B45] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-[#232B45] bg-slate-50/70 dark:bg-[#111827] text-[11px] font-semibold text-slate-500 dark:text-[#A7B0C5] uppercase tracking-wider">
                    <th className="py-3 px-4">Document</th>
                    <th className="py-3 px-4">Pages</th>
                    <th className="py-3 px-4">File Size</th>
                    <th className="py-3 px-4">Created Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#232B45] text-xs">
                  {filteredHistory.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-[#111827]/60 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-100/70 dark:bg-[#111827] text-indigo-600 dark:text-indigo-400 border border-transparent dark:border-[#232B45] flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 dark:text-[#F8FAFC] truncate max-w-xs sm:max-w-md font-mono" title={item.filename}>
                              {item.filename}
                            </p>
                            <p className="text-[11px] text-slate-400 dark:text-[#A7B0C5]">
                              {item.pageSize.toUpperCase()} · {item.orientation} · {item.imagesCount} source images
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 dark:text-[#F8FAFC] font-mono tabular-nums">
                        {item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 dark:text-[#F8FAFC] font-mono tabular-nums">
                        {formatSize(item.fileSizeBytes)}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 dark:text-[#A7B0C5] whitespace-nowrap">
                        {formatDate(item.createdAt)}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.blobUrl && (
                            <button
                              onClick={() => onDownloadItem(item)}
                              className="p-1.5 text-indigo-600 dark:text-[#22D3EE] hover:text-indigo-700 dark:hover:text-[#22D3EE] hover:bg-indigo-50 dark:hover:bg-[#111827] rounded-lg transition-colors"
                              title="Download PDF"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => onDeleteItem(item.id)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors"
                            title="Delete from history"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
