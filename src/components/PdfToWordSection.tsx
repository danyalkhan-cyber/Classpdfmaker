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
  ExternalLink,
  BookOpen,
  FileType2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  convertPdfToWord,
  validatePdfFile,
  PdfConversionProgress,
  PdfToWordResult,
} from '../utils/pdfToWordConverter';

interface PdfToWordSectionProps {
  id?: string;
  onConversionSuccess?: (result: PdfToWordResult) => void;
}

export const PdfToWordSection: React.FC<PdfToWordSectionProps> = ({
  id = 'pdf-to-word',
  onConversionSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState<PdfConversionProgress | null>(null);
  const [conversionResult, setConversionResult] = useState<PdfToWordResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const handleFileSelection = (file: File) => {
    setErrorMessage(null);
    setConversionResult(null);
    setProgress(null);

    const validation = validatePdfFile(file);
    if (!validation.isValid) {
      setErrorMessage(validation.error || 'Invalid file format.');
      return;
    }

    setSelectedFile(file);
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
    // reset input so the same file can be re-selected if removed
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
    setSelectedFile(null);
    setConversionResult(null);
    setProgress(null);
    setErrorMessage(null);
  };

  const handleStartConversion = async () => {
    if (!selectedFile) return;

    setIsConverting(true);
    setErrorMessage(null);
    setConversionResult(null);

    try {
      const result = await convertPdfToWord(selectedFile, (p) => {
        setProgress(p);
      });

      setConversionResult(result);
      onConversionSuccess?.(result);

      // Trigger celebratory confetti on successful conversion
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // Confetti is purely decorative
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Conversion failed. Please try another PDF.';
      setErrorMessage(msg);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!conversionResult) return;

    const link = document.createElement('a');
    link.href = conversionResult.blobUrl;
    link.download = conversionResult.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section
      id={id}
      className="scroll-mt-20 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto"
      aria-label="PDF to Word Converter"
    >
      <div className="bg-white dark:bg-[#171D32] border border-slate-200/90 dark:border-[#232B45] rounded-3xl shadow-sm overflow-hidden transition-all">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#111827] via-[#171D32] to-[#1E2640] border-b border-slate-200/80 dark:border-[#232B45] p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Free Document Tool · No Account Required</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-[#F8FAFC]">
              Convert PDF to Word
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-[#A7B0C5] font-normal leading-relaxed">
              Convert your PDF documents into editable Word files quickly and easily.
            </p>
          </div>
        </div>

        {/* Converter Card Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Privacy & Technology Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-indigo-50/70 dark:bg-[#111827] border border-indigo-100 dark:border-[#232B45] rounded-2xl text-xs text-indigo-900 dark:text-[#A7B0C5]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="font-semibold text-slate-900 dark:text-[#F8FAFC]">
                100% In-Browser &amp; Private:
              </span>
              <span>
                Your PDF is processed strictly on your device. No files are uploaded to any server.
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-[#A7B0C5]">
              <FileType2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Native .DOCX format</span>
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div
              className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl flex items-start gap-3 text-rose-700 dark:text-rose-300 text-xs animate-in fade-in duration-200"
              role="alert"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
              <div className="space-y-1">
                <p className="font-bold">Conversion Error</p>
                <p className="leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* File Upload & Drag-and-Drop Area */}
          {!selectedFile ? (
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 group flex flex-col items-center justify-center gap-4 ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-500/10 scale-[0.99]'
                  : 'border-slate-300 dark:border-[#232B45] hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-[#111827]/40 hover:bg-indigo-50/30 dark:hover:bg-[#111827]/80'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={onFileInputChange}
              />

              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs border border-indigo-200/50 dark:border-indigo-800/40">
                <FileText className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <p className="text-base font-bold text-slate-800 dark:text-[#F8FAFC]">
                  Drag and drop your PDF here
                </p>
                <p className="text-xs text-slate-500 dark:text-[#A7B0C5]">
                  or click to browse from your computer or phone (up to 50 MB)
                </p>
              </div>

              <button
                type="button"
                className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-md shadow-indigo-500/20 transition-all pointer-events-none"
              >
                <Upload className="w-4 h-4" />
                <span>Choose PDF File</span>
              </button>
            </div>
          ) : (
            /* Selected File State Card */
            <div className="border border-slate-200 dark:border-[#232B45] rounded-2xl p-5 bg-slate-50/70 dark:bg-[#111827]/70 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 overflow-hidden">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-200/50 dark:border-indigo-800/40">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-[#F8FAFC] truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-[#A7B0C5]">
                      {formatFileSize(selectedFile.size)} · Ready to convert
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={onFileInputChange}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isConverting}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-[#232B45] bg-white dark:bg-[#111827] text-slate-700 dark:text-[#F8FAFC] hover:bg-slate-50 dark:hover:bg-[#1E2640] transition-colors disabled:opacity-50 cursor-pointer"
                    title="Choose a different PDF file"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Replace</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    disabled={isConverting}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-rose-200 dark:border-rose-900/60 bg-white dark:bg-[#111827] text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors disabled:opacity-50 cursor-pointer"
                    title="Remove selected PDF"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              {/* Progress Bar (during conversion) */}
              {isConverting && progress && (
                <div className="pt-2 space-y-2 border-t border-slate-200 dark:border-[#232B45]">
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-[#A7B0C5] font-medium">
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                      <span>{progress.message}</span>
                    </span>
                    <span className="font-mono text-indigo-400 font-bold">
                      {Math.round((progress.current / Math.max(progress.total, 1)) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-[#0B1020] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((progress.current / Math.max(progress.total, 1)) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                {!conversionResult ? (
                  <button
                    type="button"
                    onClick={handleStartConversion}
                    disabled={isConverting}
                    className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 shadow-md shadow-indigo-500/20 transition-all active:scale-[0.99] cursor-pointer"
                  >
                    {isConverting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Converting to Word Document...</span>
                      </>
                    ) : (
                      <>
                        <FileType2 className="w-4 h-4" />
                        <span>Convert to Word</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="w-full space-y-4">
                    {/* Success Box */}
                    <div className="p-4 bg-emerald-50/60 dark:bg-[#111827] border border-emerald-200 dark:border-emerald-900/40 rounded-xl space-y-2">
                      <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Ready! Document converted successfully.</span>
                      </div>
                      <p className="text-[11px] text-emerald-700 dark:text-[#A7B0C5]">
                        Processed {conversionResult.pageCount} {conversionResult.pageCount === 1 ? 'page' : 'pages'}
                        {conversionResult.isScanned
                          ? ' · High-fidelity scanned plates preserved in Word'
                          : ` · Extracted ${conversionResult.textCharCount.toLocaleString()} characters into editable Word styles`}
                        . File size: {formatFileSize(conversionResult.fileSizeBytes)}.
                      </p>
                      {conversionResult.warnings && conversionResult.warnings.length > 0 && (
                        <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 rounded-lg text-[11px] text-amber-700 dark:text-amber-300">
                          {conversionResult.warnings.join(' ')}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <button
                        type="button"
                        onClick={handleDownload}
                        className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-md shadow-indigo-500/20 transition-all active:scale-[0.99] cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Word Document (.docx)</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-xs font-semibold text-slate-700 dark:text-[#F8FAFC] border border-slate-300 dark:border-[#232B45] hover:bg-slate-50 dark:hover:bg-[#1E2640] transition-colors cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Convert Another PDF</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Honest Layout & Feature Guidance Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#111827] border border-slate-200/80 dark:border-[#232B45] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-[#F8FAFC]">
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Conversion Fidelity &amp; Formatting Notes</span>
            </div>
            <ul className="text-xs text-slate-500 dark:text-[#A7B0C5] space-y-1 list-disc pl-5 leading-relaxed">
              <li>
                <strong className="text-slate-800 dark:text-[#F8FAFC]">Editable Paragraphs &amp; Headings:</strong> Text, paragraphs, headings, and font weights (bold, italic) are parsed cleanly into native Word styles.
              </li>
              <li>
                <strong className="text-slate-800 dark:text-[#F8FAFC]">Scanned &amp; Handwritten Notes:</strong> If your PDF contains scanned photos or handwritten images without vector text, pages are embedded as high-resolution Word plates.
              </li>
              <li>
                <strong className="text-slate-800 dark:text-[#F8FAFC]">Layout Notice:</strong> Extremely complex multi-column magazine grids or nested vector graphics are normalized into linear Word reading order for easy editing.
              </li>
              <li>
                <strong className="text-slate-800 dark:text-[#F8FAFC]">100% Free &amp; No Watermarks:</strong> Produced directly in your browser without artificial page limits, subscriptions, or watermarks.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
