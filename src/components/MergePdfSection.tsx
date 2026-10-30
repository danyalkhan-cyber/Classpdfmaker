/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  Files,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Download,
  Trash2,
  ArrowUp,
  ArrowDown,
  GripVertical,
  RefreshCw,
  ShieldCheck,
  FileText,
  Layers,
  Sparkles,
  Info,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  MergeFileItem,
  MergeProgress,
  MergeResult,
  inspectPdfFile,
  mergePdfFiles,
  formatBytes,
  MAX_FILE_SIZE_BYTES,
  MAX_TOTAL_SIZE_BYTES,
} from '../utils/pdfMerger';

interface MergePdfSectionProps {
  id?: string;
  onMergeSuccess?: (result: MergeResult) => void;
}

export const MergePdfSection: React.FC<MergePdfSectionProps> = ({
  id = 'merge-pdf',
  onMergeSuccess,
}) => {
  const [items, setItems] = useState<MergeFileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const [outputFilename, setOutputFilename] = useState('merged-document');
  const [isMerging, setIsMerging] = useState(false);
  const [progress, setProgress] = useState<MergeProgress | null>(null);
  const [mergeResult, setMergeResult] = useState<MergeResult | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const addMoreInputRef = useRef<HTMLInputElement>(null);

  // Compute total size
  const totalSizeBytes = items.reduce((acc, it) => acc + it.size, 0);

  // Process newly selected files (from drop or file input)
  const processAddedFiles = async (rawFiles: FileList | File[]) => {
    setGeneralError(null);
    const filesArray = Array.from(rawFiles);
    if (filesArray.length === 0) return;

    const newItems: MergeFileItem[] = filesArray.map((file, idx) => ({
      id: `merge-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 7)}`,
      file,
      name: file.name,
      size: file.size,
      isInspecting: true,
    }));

    // Optimistically add to list
    setItems((prev) => [...prev, ...newItems]);

    // Inspect each file asynchronously for validity, page count, and encryption
    for (const item of newItems) {
      try {
        const inspection = await inspectPdfFile(item.file);
        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id
              ? {
                  ...it,
                  isInspecting: false,
                  pageCount: inspection.pageCount,
                  error: inspection.isValid ? undefined : inspection.error,
                }
              : it
          )
        );
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to inspect file';
        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id
              ? { ...it, isInspecting: false, error: msg }
              : it
          )
        );
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processAddedFiles(e.target.files);
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  // Drag and drop into the upload box
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processAddedFiles(e.dataTransfer.files);
    }
  }, []);

  // Remove a single file
  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    setGeneralError(null);
  };

  // Clear all files
  const handleClearAll = () => {
    setItems([]);
    setGeneralError(null);
    setMergeResult(null);
    setProgress(null);
  };

  // Move item up (accessible alternative to drag & drop)
  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    setItems((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index - 1];
      copy[index - 1] = temp;
      return copy;
    });
  };

  // Move item down (accessible alternative to drag & drop)
  const handleMoveDown = (index: number) => {
    if (index >= items.length - 1) return;
    setItems((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index + 1];
      copy[index + 1] = temp;
      return copy;
    });
  };

  // HTML5 Drag and drop reordering inside the file list
  const handleItemDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleItemDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleItemDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    setItems((prev) => {
      const copy = [...prev];
      const [movedItem] = copy.splice(draggedIndex, 1);
      copy.splice(dropIndex, 0, movedItem);
      return copy;
    });

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleItemDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Execute Merge
  const handleStartMerge = async () => {
    if (items.length < 2) {
      setGeneralError('Please select at least 2 PDF files to combine them.');
      return;
    }

    // Check if any item has known errors
    const errorItems = items.filter((it) => it.error);
    if (errorItems.length > 0) {
      setGeneralError(
        `Please remove invalid or password-protected files before merging (${errorItems[0].name}: ${errorItems[0].error}).`
      );
      return;
    }

    // Check total size limit
    if (totalSizeBytes > MAX_TOTAL_SIZE_BYTES) {
      setGeneralError(
        `Total file size (${formatBytes(totalSizeBytes)}) exceeds maximum limit of ${formatBytes(
          MAX_TOTAL_SIZE_BYTES
        )}.`
      );
      return;
    }

    setIsMerging(true);
    setGeneralError(null);
    setProgress({
      currentFileIndex: 0,
      totalFiles: items.length,
      currentFilename: items[0].name,
      totalPagesMerged: 0,
      percentage: 5,
      message: 'Reading and merging PDF pages in browser memory...',
    });

    try {
      const rawFiles = items.map((it) => it.file);
      const result = await mergePdfFiles(rawFiles, outputFilename, (p) => {
        setProgress(p);
      });

      setMergeResult(result);
      setIsMerging(false);

      if (onMergeSuccess) {
        onMergeSuccess(result);
      }

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0284c7', '#38bdf8', '#10b981', '#6366f1'],
        });
      } catch {
        // Ignore if confetti fails
      }
    } catch (err: unknown) {
      setIsMerging(false);
      const msg = err instanceof Error ? err.message : 'An error occurred while merging PDF files.';
      setGeneralError(msg);
      // NOTE: We intentionally KEEP the items in the list so the user can easily fix/remove problematic files and retry!
    }
  };

  // Trigger download of merged PDF
  const handleDownloadMerged = () => {
    if (!mergeResult) return;
    const a = document.createElement('a');
    a.href = mergeResult.blobUrl;
    a.download = mergeResult.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Reset to merge another set of files
  const handleReset = () => {
    if (mergeResult?.blobUrl) {
      URL.revokeObjectURL(mergeResult.blobUrl);
    }
    setMergeResult(null);
    setProgress(null);
    setItems([]);
    setGeneralError(null);
  };

  const hasErrors = items.some((it) => it.error);
  const canMerge = items.length >= 2 && !isMerging && !hasErrors;

  return (
    <section id={id} className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Section Header */}
      <div className="text-center space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-300">
          <Layers className="w-3.5 h-3.5 text-indigo-500 dark:text-[#22D3EE]" />
          <span>100% Free · Client-Side PDF Combiner</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-[#F8FAFC]">
          Merge PDF
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-[#A7B0C5] max-w-2xl mx-auto leading-relaxed">
          Combine multiple PDF files into one document quickly and easily. Upload your PDFs, arrange their order, and download your merged file.
        </p>
      </div>

      {/* Main Container Card */}
      <div className="bg-white dark:bg-[#171D32] border border-slate-200/90 dark:border-[#232B45] rounded-3xl shadow-sm overflow-hidden p-5 sm:p-7 space-y-6">
        {/* Hidden File Inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
          id="merge-pdf-input"
        />
        <input
          ref={addMoreInputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
          id="merge-add-more-input"
        />

        {/* State 1: Upload Dropzone when empty */}
        {items.length === 0 && !mergeResult && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 scale-[1.01]'
                : 'border-slate-300 dark:border-[#232B45] hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-[#111827]/40'
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
              <Files className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">
                Drag &amp; drop PDF files here, or click to browse
              </p>
              <p className="text-xs text-slate-500 dark:text-[#A7B0C5]">
                Select 2 or more PDF documents (up to 50MB each).
              </p>
            </div>
            <button
              type="button"
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors pointer-events-none"
            >
              <Upload className="w-4 h-4" />
              <span>Choose PDF Files</span>
            </button>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Files stay securely in your browser. Never uploaded to external servers.</span>
            </div>
          </div>
        )}

        {/* State 2: Selected Files List & Controls */}
        {items.length > 0 && !mergeResult && (
          <div className="space-y-5">
            {/* List Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Selected PDF Files ({items.length})
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                    Total: {formatBytes(totalSizeBytes)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Files will be merged in the order listed below. Drag items or use ↑/↓ arrows to reorder.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => addMoreInputRef.current?.click()}
                  disabled={isMerging}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add More PDFs</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearAll}
                  disabled={isMerging}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              </div>
            </div>

            {/* Quick Drag-and-drop addition zone while files exist */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`p-3 rounded-xl border border-dashed text-center text-xs transition-colors ${
                isDragging
                  ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-semibold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {isDragging ? 'Drop PDFs here to add them...' : 'Tip: Drag additional PDF files here anytime to add them to your queue.'}
            </div>

            {/* Reorderable Files List */}
            <div className="space-y-2.5">
              {items.map((item, index) => {
                const isItemDragging = draggedIndex === index;
                const isOver = dragOverIndex === index;

                return (
                  <div
                    key={item.id}
                    draggable={!isMerging}
                    onDragStart={() => handleItemDragStart(index)}
                    onDragOver={(e) => handleItemDragOver(e, index)}
                    onDrop={(e) => handleItemDrop(e, index)}
                    onDragEnd={handleItemDragEnd}
                    className={`flex items-center justify-between gap-3 p-3 sm:p-3.5 rounded-xl border transition-all ${
                      item.error
                        ? 'border-rose-300 dark:border-rose-800/80 bg-rose-50/50 dark:bg-rose-950/20'
                        : isOver
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
                        : isItemDragging
                        ? 'opacity-40 border-slate-300 dark:border-[#232B45]'
                        : 'border-slate-200 dark:border-[#232B45] bg-slate-50/70 dark:bg-[#111827]/70 hover:bg-slate-100/60 dark:hover:bg-[#1A223B]'
                    }`}
                  >
                    {/* Left: Drag Handle & Order Badge */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      <div
                        className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        title="Drag to reorder"
                      >
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <span className="w-6 h-6 rounded-lg bg-white dark:bg-[#171D32] border border-slate-200 dark:border-[#232B45] flex items-center justify-center text-xs font-bold text-slate-700 dark:text-[#F8FAFC]">
                        {index + 1}
                      </span>
                    </div>

                    {/* Middle: File info & status */}
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <FileText className="w-4 h-4 text-indigo-500 dark:text-[#22D3EE] shrink-0" />
                        <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-[#F8FAFC] truncate max-w-xs sm:max-w-md">
                          {item.name}
                        </span>
                        {item.pageCount !== undefined && (
                          <span className="text-[11px] font-mono px-2 py-0.2 rounded-md bg-indigo-100/70 dark:bg-indigo-950/60 text-indigo-700 dark:text-[#22D3EE] border border-indigo-200/50 dark:border-indigo-800/40 shrink-0">
                            {item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-[#A7B0C5]">
                        <span>{formatBytes(item.size)}</span>
                        {item.isInspecting && (
                          <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-[#22D3EE]">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Verifying...</span>
                          </span>
                        )}
                        {item.error && (
                          <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-medium">
                            <AlertCircle className="w-3 h-3" />
                            <span>{item.error}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Reorder Buttons (Up/Down) & Remove */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0 || isMerging}
                        aria-label={`Move ${item.name} up`}
                        title="Move up"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#1E2640] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === items.length - 1 || isMerging}
                        aria-label={`Move ${item.name} down`}
                        title="Move down"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#1E2640] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={isMerging}
                        aria-label={`Remove ${item.name}`}
                        title="Remove file"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 disabled:opacity-30 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* General Error Banner */}
            {generalError && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-0.5">
                  <p className="font-bold">Merging Error</p>
                  <p>{generalError}</p>
                </div>
              </div>
            )}

            {/* Merge Settings & Action Controls */}
            <div className="pt-3 border-t border-slate-200/80 dark:border-[#232B45] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 max-w-sm">
                  <label htmlFor="merge-filename" className="block text-xs font-semibold text-slate-700 dark:text-[#A7B0C5] mb-1">
                    Output PDF Name
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      id="merge-filename"
                      type="text"
                      value={outputFilename}
                      onChange={(e) => setOutputFilename(e.target.value)}
                      disabled={isMerging}
                      placeholder="merged-document"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-[#232B45] bg-white dark:bg-[#0B1020] text-slate-900 dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                    <span className="text-xs text-slate-400 font-mono">.pdf</span>
                  </div>
                </div>

                {/* Status notice */}
                <div className="text-right text-xs text-slate-500 dark:text-[#A7B0C5]">
                  {items.length < 2 ? (
                    <span className="text-amber-500 dark:text-amber-400 font-medium flex items-center gap-1 sm:justify-end">
                      <Info className="w-3.5 h-3.5" />
                      <span>Add at least 2 files to merge</span>
                    </span>
                  ) : hasErrors ? (
                    <span className="text-rose-500 dark:text-rose-400 font-medium">
                      Remove problematic files to continue
                    </span>
                  ) : (
                    <span className="text-emerald-500 dark:text-emerald-400 font-medium flex items-center gap-1 sm:justify-end">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ready to merge {items.length} files</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Progress bar when merging */}
              {isMerging && progress && (
                <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-[#111827] border border-indigo-100 dark:border-indigo-900/40 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600 dark:text-[#22D3EE]" />
                      <span>{progress.message}</span>
                    </span>
                    <span className="font-mono text-indigo-700 dark:text-[#22D3EE] font-bold">
                      {progress.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300 ease-out"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Primary Merge Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleStartMerge}
                  disabled={!canMerge}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 active:scale-[0.98] text-white text-sm font-bold shadow-md shadow-indigo-600/25 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  {isMerging ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Merging Documents...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Merge {items.length} PDF Files</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* State 3: Success Screen with Download Button */}
        {mergeResult && (
          <div className="p-6 sm:p-8 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                PDFs Merged Successfully!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Combined {mergeResult.fileCount} documents into a single document containing{' '}
                <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                  {mergeResult.totalPageCount} total pages
                </span>{' '}
                ({formatBytes(mergeResult.fileSizeBytes)}).
              </p>
            </div>

            {/* Summary List */}
            <div className="max-w-md mx-auto bg-white/90 dark:bg-slate-900/80 rounded-xl p-3 border border-emerald-100 dark:border-emerald-900 text-left space-y-1.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Included in this merged file:
              </p>
              <ul className="text-xs space-y-1 divide-y divide-slate-100 dark:divide-slate-800">
                {mergeResult.filesSummary.map((f, i) => (
                  <li key={i} className="pt-1 flex items-center justify-between text-slate-700 dark:text-slate-300">
                    <span className="truncate pr-2">{i + 1}. {f.name}</span>
                    <span className="text-[11px] font-mono text-slate-500 shrink-0">
                      {f.pageCount} {f.pageCount === 1 ? 'page' : 'pages'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownloadMerged}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Merged PDF</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Merge More Files</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Trust & Feature Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-slate-800 dark:text-slate-200">100% In-Browser Privacy</p>
            <p className="text-[11px] text-slate-500">Your documents are processed in local memory and are never sent to any server.</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5">
          <Layers className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-slate-800 dark:text-slate-200">Preserves Quality &amp; Format</p>
            <p className="text-[11px] text-slate-500">Page dimensions, orientations, vector graphics, and fonts remain intact.</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-slate-800 dark:text-slate-200">Drag &amp; Drop Reordering</p>
            <p className="text-[11px] text-slate-500">Arrange and re-sequence documents easily before downloading your final PDF.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
