/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Download,
  Trash2,
  RefreshCw,
  ShieldCheck,
  FileCheck,
  Sparkles,
  Info,
  Layers,
  FileType
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  convertWordToPdf,
  validateDocxFile,
  formatBytes,
  WordConversionProgress,
  WordToPdfResult,
} from '../utils/wordToPdfConverter';

interface WordToPdfSectionProps {
  id?: string;
  onConversionSuccess?: (result: WordToPdfResult) => void;
}

export const WordToPdfSection: React.FC<WordToPdfSectionProps> = ({
  id = 'word-to-pdf',
  onConversionSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customFilename, setCustomFilename] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState<WordConversionProgress | null>(null);
  const [conversionResult, setConversionResult] = useState<WordToPdfResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = async (file: File) => {
    setErrorMessage(null);
    setConversionResult(null);
    setProgress(null);

    const validation = await validateDocxFile(file);
    if (!validation.isValid) {
      setErrorMessage(validation.error || 'Invalid Word document format.');
      return;
    }

    setSelectedFile(file);
    setCustomFilename(file.name.replace(/\.[^/.]+$/, ''));
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  }, []);

  const handleRemoveFile = () => {
    if (isConverting) return;
    setSelectedFile(null);
    setCustomFilename('');
    setConversionResult(null);
    setProgress(null);
    setErrorMessage(null);
  };

  const handleStartConversion = async () => {
    if (!selectedFile || isConverting) return;

    setIsConverting(true);
    setErrorMessage(null);
    setConversionResult(null);
    setProgress({
      step: 'validating',
      message: 'Validating Word document...',
      percentage: 10,
    });

    try {
      const result = await convertWordToPdf(
        selectedFile,
        {
          customFilename: customFilename.trim() || undefined,
        },
        (p) => {
          setProgress(p);
        }
      );

      setConversionResult(result);
      setIsConverting(false);

      if (onConversionSuccess) {
        onConversionSuccess(result);
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
        // Ignore confetti error
      }
    } catch (err: unknown) {
      setIsConverting(false);
      const msg = err instanceof Error ? err.message : 'An error occurred during Word to PDF conversion.';
      setErrorMessage(msg);
      // NOTE: We intentionally preserve selectedFile so the user doesn't lose their file and can retry or replace it!
    }
  };

  const handleDownloadPdf = () => {
    if (!conversionResult) return;
    const a = document.createElement('a');
    a.href = conversionResult.blobUrl;
    a.download = conversionResult.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    if (conversionResult?.blobUrl) {
      URL.revokeObjectURL(conversionResult.blobUrl);
    }
    setConversionResult(null);
    setSelectedFile(null);
    setCustomFilename('');
    setProgress(null);
    setErrorMessage(null);
  };

  return (
    <section id={id} className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Section Header */}
      <div className="text-center space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <FileType className="w-3.5 h-3.5 text-cyan-400" />
          <span>100% Free · Client-Side DOCX to PDF</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-[#F8FAFC]">
          Word to PDF Converter
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-[#A7B0C5] max-w-2xl mx-auto leading-relaxed">
          Convert your Word documents into PDF files quickly and easily while preserving their formatting as accurately as possible.
        </p>
      </div>

      {/* Main Container Card */}
      <div className="bg-white dark:bg-[#171D32] border border-slate-200/90 dark:border-[#232B45] rounded-3xl shadow-sm overflow-hidden p-5 sm:p-7 space-y-6">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={onFileInputChange}
          className="hidden"
          id="word-to-pdf-input"
        />

        {/* State 1: Dropzone when no file selected */}
        {!selectedFile && !conversionResult && (
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 scale-[1.01]'
                : 'border-slate-300 dark:border-[#232B45] hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-[#111827]/40'
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs border border-indigo-200/50 dark:border-indigo-800/40">
              <FileText className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-bold text-slate-800 dark:text-[#F8FAFC]">
                Drag &amp; drop a Word (.docx) document here, or click to browse
              </p>
              <p className="text-xs text-slate-500 dark:text-[#A7B0C5]">
                Supports Microsoft Word documents up to 30MB.
              </p>
            </div>
            <button
              type="button"
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-semibold shadow-xs transition-colors pointer-events-none"
            >
              <Upload className="w-4 h-4" />
              <span>Choose Word File</span>
            </button>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-[#A7B0C5] pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Private &amp; client-side. Your Word document is never uploaded to any server.</span>
            </div>
          </div>
        )}

        {/* State 2: Selected File Details & Conversion Controls */}
        {selectedFile && !conversionResult && (
          <div className="space-y-5">
            <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-[#232B45] bg-slate-50/80 dark:bg-[#111827]/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-200/50 dark:border-indigo-800/40">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-[#F8FAFC] truncate max-w-xs sm:max-w-md">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-[#A7B0C5]">
                    Size: {formatBytes(selectedFile.size)} · Microsoft Word Document (.docx)
                  </p>
                </div>
              </div>

              {/* Replace / Remove Controls */}
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isConverting}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#232B45] hover:bg-slate-50 dark:hover:bg-[#1E2640] text-slate-700 dark:text-[#F8FAFC] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Replace File
                </button>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  disabled={isConverting}
                  title="Remove selected file"
                  className="p-2 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Error Message Banner */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-0.5">
                  <p className="font-bold">Conversion Error</p>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Output filename & Options */}
            <div className="space-y-4 pt-2">
              <div className="max-w-sm">
                <label
                  htmlFor="word-pdf-outname"
                  className="block text-xs font-semibold text-slate-700 dark:text-[#A7B0C5] mb-1.5"
                >
                  Output PDF Name
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    id="word-pdf-outname"
                    type="text"
                    value={customFilename}
                    onChange={(e) => setCustomFilename(e.target.value)}
                    disabled={isConverting}
                    placeholder="my-document"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-[#232B45] bg-white dark:bg-[#111827] text-slate-900 dark:text-[#F8FAFC] placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                  <span className="text-xs text-slate-400 font-mono">.pdf</span>
                </div>
              </div>

              {/* Progress Indicator */}
              {isConverting && progress && (
                <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-[#111827] border border-indigo-100 dark:border-[#232B45] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900 dark:text-[#F8FAFC] flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                      <span>{progress.message}</span>
                    </span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                      {progress.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-[#0B1020] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300 ease-out"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Convert Button */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleStartConversion}
                  disabled={isConverting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 active:scale-[0.98] text-white text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  {isConverting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Converting to PDF...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-cyan-300" />
                      <span>Convert to PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* State 3: Conversion Success View */}
        {conversionResult && (
          <div className="p-6 sm:p-8 rounded-2xl bg-emerald-50/50 dark:bg-[#111827]/70 border border-emerald-200 dark:border-emerald-900/40 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-xl font-bold text-slate-900 dark:text-[#F8FAFC]">
                Word Document Converted Successfully!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#A7B0C5]">
                Created{' '}
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {conversionResult.filename}
                </span>{' '}
                containing {conversionResult.pageCount} page{conversionResult.pageCount === 1 ? '' : 's'} (
                {formatBytes(conversionResult.fileSizeBytes)}).
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-[#111827] border border-slate-300 dark:border-[#232B45] hover:bg-slate-50 dark:hover:bg-[#1E2640] text-slate-700 dark:text-[#F8FAFC] text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Convert Another Document</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Formatting Capabilities & Honest Disclosures */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#171D32] border border-slate-200/80 dark:border-[#232B45] space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-[#F8FAFC]">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Formatting Capabilities &amp; Transparency Notice</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-[#A7B0C5] leading-relaxed">
          This converter processes Word files directly inside your browser using client-side rendering. It accurately preserves:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-[11px] text-slate-600 dark:text-[#A7B0C5]">
          <div className="p-3 rounded-xl bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-[#232B45]">
            <span className="font-semibold text-slate-800 dark:text-[#F8FAFC] block mb-0.5">Typography &amp; Headings</span>
            Headings 1-6, bold, italics, colors, alignment, and standard fonts.
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-[#232B45]">
            <span className="font-semibold text-slate-800 dark:text-[#F8FAFC] block mb-0.5">Tables &amp; Borders</span>
            Multi-column tables, cell borders, shading, and cell padding.
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-[#232B45]">
            <span className="font-semibold text-slate-800 dark:text-[#F8FAFC] block mb-0.5">Images &amp; Lists</span>
            Embedded illustrations, screenshots, bullet points, and numbered lists.
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-[#111827] border border-slate-200/60 dark:border-[#232B45]">
            <span className="font-semibold text-slate-800 dark:text-[#F8FAFC] block mb-0.5">Privacy Guaranteed</span>
            Zero remote server transmissions. 100% in-browser memory execution.
          </div>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-[#A7B0C5] italic">
          *Note: Specialized desktop Word features like proprietary WordArt vector shapes, automated macros, or complex floating frames with text wrap may have minor layout differences compared to desktop Microsoft Word.
        </p>
      </div>
    </section>
  );
};
