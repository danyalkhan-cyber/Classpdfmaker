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
  Minimize2,
  Sparkles,
  Info,
  TrendingDown,
  TrendingUp,
  Sliders,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  CompressionLevel,
  CompressProgress,
  CompressResult,
  formatBytes,
  inspectPdfForCompression,
  compressPdfFile,
} from '../utils/pdfCompressor';

interface CompressPdfSectionProps {
  id?: string;
  onCompressSuccess?: (result: CompressResult) => void;
}

export const CompressPdfSection: React.FC<CompressPdfSectionProps> = ({
  id = 'compress-pdf',
  onCompressSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [isInspecting, setIsInspecting] = useState(false);
  const [customFilename, setCustomFilename] = useState('');
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('recommended');

  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState<CompressProgress | null>(null);
  const [compressResult, setCompressResult] = useState<CompressResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = async (file: File) => {
    setErrorMessage(null);
    setCompressResult(null);
    setProgress(null);
    setPageCount(null);

    setIsInspecting(true);
    const inspection = await inspectPdfForCompression(file);
    setIsInspecting(false);

    if (!inspection.isValid) {
      setErrorMessage(inspection.error || 'Invalid PDF document.');
      return;
    }

    setSelectedFile(file);
    setPageCount(inspection.pageCount || null);
    setCustomFilename(`${file.name.replace(/\.[^/.]+$/, '')}-compressed`);
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
    if (isCompressing) return;
    setSelectedFile(null);
    setPageCount(null);
    setCustomFilename('');
    setCompressResult(null);
    setProgress(null);
    setErrorMessage(null);
  };

  const handleStartCompression = async () => {
    if (!selectedFile || isCompressing) return;

    setIsCompressing(true);
    setErrorMessage(null);
    setCompressResult(null);
    setProgress({
      step: 'validating',
      message: 'Validating document structures...',
      percentage: 10,
    });

    try {
      const result = await compressPdfFile(
        selectedFile,
        {
          level: compressionLevel,
          customFilename: customFilename.trim() || undefined,
        },
        (p) => {
          setProgress(p);
        }
      );

      setCompressResult(result);
      setIsCompressing(false);

      if (onCompressSuccess) {
        onCompressSuccess(result);
      }

      if (result.isSmaller) {
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
      }
    } catch (err: unknown) {
      setIsCompressing(false);
      const msg =
        err instanceof Error ? err.message : 'An error occurred during PDF compression.';
      setErrorMessage(msg);
      // NOTE: We intentionally preserve selectedFile so user can retry or adjust settings!
    }
  };

  const handleDownloadCompressed = () => {
    if (!compressResult) return;
    const a = document.createElement('a');
    a.href = compressResult.blobUrl;
    a.download = compressResult.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadOriginal = () => {
    if (!selectedFile) return;
    const url = URL.createObjectURL(selectedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (compressResult?.blobUrl) {
      URL.revokeObjectURL(compressResult.blobUrl);
    }
    setCompressResult(null);
    setSelectedFile(null);
    setPageCount(null);
    setCustomFilename('');
    setProgress(null);
    setErrorMessage(null);
  };

  return (
    <section id={id} className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Section Header */}
      <div className="text-center space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-900 text-sky-700 dark:text-sky-300">
          <Minimize2 className="w-3.5 h-3.5 text-sky-500" />
          <span>100% Free · Client-Side PDF Compressor</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Compress PDF
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Reduce the file size of your PDF documents to make them easier to upload, share, and store.
        </p>
      </div>

      {/* Main Container Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden p-5 sm:p-7 space-y-6">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={onFileInputChange}
          className="hidden"
          id="compress-pdf-input"
        />

        {/* State 1: Dropzone when no file selected */}
        {!selectedFile && !compressResult && (
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
              isDragging
                ? 'border-sky-500 bg-sky-50/70 dark:bg-sky-950/40 scale-[1.01]'
                : 'border-slate-300 dark:border-slate-700 hover:border-sky-400 dark:hover:border-sky-500 bg-slate-50/50 dark:bg-slate-800/30'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-xs">
              <Minimize2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-bold text-slate-800 dark:text-slate-200">
                Drag &amp; drop your PDF document here, or click to browse
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Supports PDF files up to 50MB (one file at a time).
              </p>
            </div>
            <button
              type="button"
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-xs transition-colors pointer-events-none"
            >
              <Upload className="w-4 h-4" />
              <span>Choose PDF File</span>
            </button>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>100% In-Browser. Your document never leaves your device.</span>
            </div>
          </div>
        )}

        {/* State 2: Selected File Details, Compression Options & Action Controls */}
        {selectedFile && !compressResult && (
          <div className="space-y-6">
            {/* File Info Bar */}
            <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                    {selectedFile.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span>Original Size: {formatBytes(selectedFile.size)}</span>
                    {isInspecting && (
                      <span className="inline-flex items-center gap-1 text-sky-600">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Inspecting...</span>
                      </span>
                    )}
                    {pageCount !== null && (
                      <span className="px-2 py-0.2 rounded-md bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 font-medium">
                        {pageCount} {pageCount === 1 ? 'page' : 'pages'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Replace / Remove Controls */}
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isCompressing}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Replace File
                </button>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  disabled={isCompressing}
                  title="Remove selected file"
                  className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Error Message Banner */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-0.5">
                  <p className="font-bold">Compression Notice</p>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            {/* 3 Compression Options Grid */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Select Compression Level
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Low Compression */}
                <button
                  type="button"
                  onClick={() => setCompressionLevel('low')}
                  disabled={isCompressing}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    compressionLevel === 'low'
                      ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/40 shadow-xs ring-2 ring-sky-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        Low Compression
                      </span>
                      {compressionLevel === 'low' && (
                        <Check className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Prioritize preserving image quality. Light compression for print-ready documents.
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-sky-700 dark:text-sky-300 bg-sky-100/70 dark:bg-sky-900/40 px-2 py-0.5 rounded-md inline-block w-fit">
                    Best Visual Quality
                  </span>
                </button>

                {/* Recommended Compression */}
                <button
                  type="button"
                  onClick={() => setCompressionLevel('recommended')}
                  disabled={isCompressing}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    compressionLevel === 'recommended'
                      ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/40 shadow-xs ring-2 ring-sky-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          Recommended
                        </span>
                        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold px-1.5 py-0.2 rounded">
                          Optimal
                        </span>
                      </div>
                      {compressionLevel === 'recommended' && (
                        <Check className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Balance file size and quality. Ideal for email, assignment portals, and LMS submissions.
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-900/40 px-2 py-0.5 rounded-md inline-block w-fit">
                    Standard Web / Upload
                  </span>
                </button>

                {/* High Compression */}
                <button
                  type="button"
                  onClick={() => setCompressionLevel('high')}
                  disabled={isCompressing}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    compressionLevel === 'high'
                      ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/40 shadow-xs ring-2 ring-sky-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        High Compression
                      </span>
                      {compressionLevel === 'high' && (
                        <Check className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Aim for maximum size reduction. Best when strict file size quotas must be met.
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-100/70 dark:bg-indigo-900/40 px-2 py-0.5 rounded-md inline-block w-fit">
                    Smallest File Size
                  </span>
                </button>
              </div>
            </div>

            {/* Output filename & Actions */}
            <div className="space-y-4 pt-2">
              <div className="max-w-sm">
                <label
                  htmlFor="compress-outname"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
                >
                  Output PDF Name
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    id="compress-outname"
                    type="text"
                    value={customFilename}
                    onChange={(e) => setCustomFilename(e.target.value)}
                    disabled={isCompressing}
                    placeholder="my-document-compressed"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <span className="text-xs text-slate-400 font-mono">.pdf</span>
                </div>
              </div>

              {/* Progress Indicator */}
              {isCompressing && progress && (
                <div className="p-4 rounded-xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/50 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-sky-900 dark:text-sky-200 flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-600" />
                      <span>{progress.message}</span>
                    </span>
                    <span className="font-mono text-sky-700 dark:text-sky-300 font-bold">
                      {progress.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-sky-200/70 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-600 transition-all duration-300 ease-out"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Compress Action Button */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleStartCompression}
                  disabled={isCompressing}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white text-sm font-bold shadow-md shadow-sky-600/25 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  {isCompressing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Compressing PDF...</span>
                    </>
                  ) : (
                    <>
                      <Minimize2 className="w-4 h-4" />
                      <span>Compress PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* State 3: Compression Result View (Smaller OR Larger/Already Optimized) */}
        {compressResult && (
          <div
            className={`p-6 sm:p-8 rounded-2xl border text-center space-y-6 ${
              compressResult.isSmaller
                ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                : 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60'
            }`}
          >
            {/* Status Icon */}
            <div
              className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-xs ${
                compressResult.isSmaller
                  ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400'
                  : 'bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400'
              }`}
            >
              {compressResult.isSmaller ? (
                <CheckCircle2 className="w-8 h-8" />
              ) : (
                <AlertCircle className="w-8 h-8" />
              )}
            </div>

            {/* Status Headline */}
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {compressResult.isSmaller
                  ? 'PDF Compressed Successfully!'
                  : 'Document Already Optimized'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {compressResult.explanation}
              </p>
            </div>

            {/* Metrics Breakdown Grid (Strictly using requested formulas) */}
            <div className="max-w-lg mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Original
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  {formatBytes(compressResult.originalSizeBytes)}
                </span>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Compressed
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  {formatBytes(compressResult.compressedSizeBytes)}
                </span>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Size Reduced
                </span>
                <span
                  className={`text-xs sm:text-sm font-bold ${
                    compressResult.isSmaller
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {compressResult.isSmaller
                    ? `-${formatBytes(compressResult.sizeReducedBytes)}`
                    : `+${formatBytes(Math.abs(compressResult.sizeReducedBytes))}`}
                </span>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Reduction
                </span>
                <span
                  className={`text-xs sm:text-sm font-bold flex items-center gap-1 ${
                    compressResult.isSmaller
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {compressResult.isSmaller ? (
                    <>
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span>{compressResult.reductionPercentage}%</span>
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>0.0%</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownloadCompressed}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-600/30 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Compressed PDF</span>
              </button>

              {!compressResult.isSmaller && selectedFile && (
                <button
                  type="button"
                  onClick={handleDownloadOriginal}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Original PDF</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Compress Another File</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Honest Compression Disclosure Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
          <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
          <span>How Client-Side PDF Compression Works &amp; Honest Guidelines</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          PDF compression results vary depending on what your document contains:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] text-slate-600 dark:text-slate-400">
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60">
            <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">
              High-Resolution Scans &amp; Photos
            </span>
            Image-heavy PDFs yield the highest size reduction (often 40%–80%) by downsampling oversized camera pixels.
          </div>
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60">
            <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">
              Vector &amp; Text Documents
            </span>
            Pure vector and text PDFs are compacted via cross-reference object streams. Text remains crisp and searchable.
          </div>
          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60">
            <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-0.5">
              Already-Compressed Files
            </span>
            If a document was previously compressed, additional savings may be minimal or zero. We never show misleading metrics.
          </div>
        </div>
      </div>
    </section>
  );
};
