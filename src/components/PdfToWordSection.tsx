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
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden transition-all">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-700 p-6 sm:p-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-sky-400/20 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-sky-200" />
              <span>Free Document Tool · No Account Required</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Convert PDF to Word
            </h2>

            <p className="text-sm sm:text-base text-sky-100 font-normal leading-relaxed">
              Convert your PDF documents into editable Word files quickly and easily.
            </p>
          </div>
        </div>

        {/* Converter Card Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Privacy & Technology Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-sky-50/80 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/50 rounded-2xl text-xs text-sky-900 dark:text-sky-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-semibold">
                100% In-Browser & Private:
              </span>
              <span className="text-slate-600 dark:text-slate-300">
                Your PDF is processed strictly on your device. No files are uploaded to any server.
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <FileType2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>Native .DOCX format</span>
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div
              className="p-4 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 rounded-2xl flex items-start gap-3 text-rose-700 dark:text-rose-300 text-xs animate-in fade-in duration-200"
              role="alert"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
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
                  ? 'border-sky-500 bg-sky-500/10 scale-[0.99]'
                  : 'border-slate-300 dark:border-slate-700 hover:border-sky-400 dark:hover:border-sky-500 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-sky-50/40 dark:hover:bg-slate-800/80'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={onFileInputChange}
              />

              <div className="w-16 h-16 rounded-2xl bg-sky-100 dark:bg-sky-900/60 text-sky-600 dark:text-sky-300 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                <FileText className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <p className="text-base font-bold text-slate-800 dark:text-slate-100">
                  Drag and drop your PDF here
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  or click to browse from your computer or phone (up to 50 MB)
                </p>
              </div>

              <button
                type="button"
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-sm transition-all group-hover:shadow"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <Upload className="w-4 h-4" />
                <span>Choose PDF File</span>
              </button>
            </div>
          ) : (
            /* Selected File State Card */
            <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-5 bg-slate-50/70 dark:bg-slate-800/50 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 overflow-hidden">
                  <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 border border-red-200 dark:border-red-900/50">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
                    title="Choose a different PDF file"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Replace</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    disabled={isConverting}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-rose-200 dark:border-rose-900/60 bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors disabled:opacity-50 cursor-pointer"
                    title="Remove selected PDF"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              {/* Progress Bar (during conversion) */}
              {isConverting && progress && (
                <div className="pt-2 space-y-2 border-t border-slate-200 dark:border-slate-700/60">
                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 font-medium">
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-sky-600 dark:text-sky-400" />
                      <span>{progress.message}</span>
                    </span>
                    <span>
                      {Math.round((progress.current / Math.max(progress.total, 1)) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 transition-all duration-300 rounded-full"
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
                    className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 disabled:bg-slate-400 shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
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
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2">
                      <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>Ready! Document converted successfully.</span>
                      </div>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                        Processed {conversionResult.pageCount} {conversionResult.pageCount === 1 ? 'page' : 'pages'}
                        {conversionResult.isScanned
                          ? ' · High-fidelity scanned plates preserved in Word'
                          : ` · Extracted ${conversionResult.textCharCount.toLocaleString()} characters into editable Word styles`}
                        . File size: {formatFileSize(conversionResult.fileSizeBytes)}.
                      </p>
                      {conversionResult.warnings && conversionResult.warnings.length > 0 && (
                        <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 rounded-lg text-[11px] text-amber-800 dark:text-amber-300">
                          {conversionResult.warnings.join(' ')}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <button
                        type="button"
                        onClick={handleDownload}
                        className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition-all hover:scale-[1.01] cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Word Document (.docx)</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
              <span>Conversion Fidelity & Formatting Notes</span>
            </div>
            <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 list-disc pl-5 leading-relaxed">
              <li>
                <strong>Editable Paragraphs & Headings:</strong> Text, paragraphs, headings, and font weights (bold, italic) are parsed cleanly into native Word styles.
              </li>
              <li>
                <strong>Scanned & Handwritten Notes:</strong> If your PDF contains scanned photos or handwritten images without vector text, pages are embedded as high-resolution Word plates.
              </li>
              <li>
                <strong>Layout Notice:</strong> Extremely complex multi-column magazine grids or nested vector graphics are normalized into linear Word reading order for easy editing.
              </li>
              <li>
                <strong>100% Free & No Watermarks:</strong> Produced directly in your browser without artificial page limits, subscriptions, or watermarks.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
