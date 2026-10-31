/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Sliders,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Check,
  Eye,
  FileText,
  AlertCircle,
  HelpCircle,
  Layers,
  Columns,
  SplitSquareVertical,
  Minimize2,
  ChevronRight,
  Info
} from 'lucide-react';
import { UploadedImage, PdfSettings } from '../types';

interface QualityPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PdfSettings;
  onUpdateQuality: (qualityPercent: number) => void;
  images: UploadedImage[];
  selectedImageIndex?: number;
}

export const QualityPreviewModal: React.FC<QualityPreviewModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateQuality,
  images,
  selectedImageIndex = 0,
}) => {
  const [currentPercent, setCurrentPercent] = useState<number>(settings.qualityPercent ?? 85);
  const [activeImageIdx, setActiveImageIdx] = useState<number>(selectedImageIndex);
  const [viewMode, setViewMode] = useState<'split' | 'side-by-side' | 'toggle'>('split');
  const [splitPos, setSplitPos] = useState<number>(50); // percentage 0 - 100
  const [zoomLevel, setZoomLevel] = useState<number>(1); // 1 = 100%, 1.5, 2, 3
  const [isHoldingOriginal, setIsHoldingOriginal] = useState<boolean>(false);
  const [compressedDataUrl, setCompressedDataUrl] = useState<string>('');
  const [compressedSizeBytes, setCompressedSizeBytes] = useState<number>(0);
  const [originalSizeBytes, setOriginalSizeBytes] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [sampleNoteDataUrl, setSampleNoteDataUrl] = useState<string>('');

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingSplit = useRef<boolean>(false);

  // Sync with incoming settings
  useEffect(() => {
    if (settings.qualityPercent) {
      setCurrentPercent(settings.qualityPercent);
    }
  }, [settings.qualityPercent, isOpen]);

  // Generate a high-detail academic notes sample image for fallback/testing
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Academic notebook paper background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 1200, 1600);

    // Subtle ruled lines
    ctx.strokeStyle = '#EEF2F6';
    ctx.lineWidth = 1.5;
    for (let y = 140; y < 1600; y += 42) {
      ctx.beginPath();
      ctx.moveTo(80, y);
      ctx.lineTo(1120, y);
      ctx.stroke();
    }

    // Left red margin line
    ctx.strokeStyle = '#FECDD3';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(180, 0);
    ctx.lineTo(180, 1600);
    ctx.stroke();

    // Header title
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 36px "Inter", sans-serif';
    ctx.fillText('Lecture 09: Multivariable Calculus & Integrals', 210, 80);

    ctx.fillStyle = '#64748B';
    ctx.font = '20px "Inter", sans-serif';
    ctx.fillText('Professor H. Vance · ClassPDF Academic Fidelity Sample', 210, 115);

    // Handwritten-style mathematical formulas & notes
    ctx.fillStyle = '#1E3A8A';
    ctx.font = 'bold 28px "Georgia", serif';
    ctx.fillText('1. Gaussian Normalization in Spherical Coordinates:', 210, 200);

    ctx.fillStyle = '#1E293B';
    ctx.font = 'italic 26px "Georgia", serif';
    ctx.fillText('I = ∫₋∞^∞ e^(-x²) dx  ⟹  I² = [∫₋∞^∞ e^(-x²) dx] [∫₋∞^∞ e^(-y²) dy]', 240, 260);
    ctx.fillText('  = ∬_ℝ² e^{-(x² + y²)} dx dy = ∫₀^(2π) dθ ∫₀^∞ r · e^(-r²) dr', 240, 310);
    ctx.fillText('  = 2π · [-1/2 · e^(-r²)]₀^∞ = π  ⟹  I = √π', 240, 360);

    // Boxed theorem note
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(220, 410, 880, 110);
    ctx.fillStyle = '#EFF6FF';
    ctx.fillRect(222, 412, 876, 106);

    ctx.fillStyle = '#1D4ED8';
    ctx.font = 'bold 22px "Inter", sans-serif';
    ctx.fillText('KEY THEOREM: Double Polar Substitution Jacobian Determinant', 245, 450);
    ctx.fillStyle = '#334155';
    ctx.font = '19px "Inter", sans-serif';
    ctx.fillText('dx dy = |J(r, θ)| dr dθ = r dr dθ  (Notice r exponent & differential weight)', 245, 490);

    // Fine handwriting formula test block
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 26px "Georgia", serif';
    ctx.fillText('2. Discrete Fourier Frequency Components & Sampling:', 210, 580);

    ctx.fillStyle = '#334155';
    ctx.font = '22px "Georgia", serif';
    ctx.fillText('X[k] = ∑_{n=0}^{N-1} x[n] · e^{-j(2π/N)kn},   k = 0, 1, ..., N-1', 240, 635);
    ctx.fillText('where Euler formula defines: e^{jθ} = cos(θ) + j · sin(θ)', 240, 680);

    // Scientific Diagram / Graph
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(250, 950);
    ctx.lineTo(1050, 950); // X-axis
    ctx.moveTo(250, 950);
    ctx.lineTo(250, 750); // Y-axis
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#64748B';
    ctx.font = '16px "Inter", sans-serif';
    ctx.fillText('Time t (ms) →', 950, 980);
    ctx.fillText('Amplitude f(t) ↑', 210, 740);

    // Bell curve wave
    ctx.strokeStyle = '#6366F1';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    for (let x = 250; x <= 1050; x += 4) {
      const norm = (x - 650) / 120;
      const y = 950 - 180 * Math.exp(-0.5 * norm * norm);
      if (x === 250) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Small fine text test
    ctx.fillStyle = '#475569';
    ctx.font = '16px "Inter", sans-serif';
    ctx.fillText('μ = 650ms, σ = 120ms (99.7% of energy lies within ±3σ)', 500, 780);

    ctx.fillStyle = '#059669';
    ctx.font = 'bold 22px "Inter", sans-serif';
    ctx.fillText('✔ Clean vector lines & subscript clarity verification area', 210, 1050);

    ctx.fillStyle = '#64748B';
    ctx.font = '18px "Inter", sans-serif';
    ctx.fillText('Subscripts test: a₁₂ + b₃₄ = c₅₆ · ∂²ψ/∂x² + ∂²ψ/∂y² = 1/v² · ∂²ψ/∂t²', 240, 1100);
    ctx.fillText('Matrix test: [ [a₁₁, a₁₂], [a₂₁, a₂₂] ] · det(A) = a₁₁a₂₂ - a₁₂a₂₁', 240, 1145);

    // Stamp
    ctx.strokeStyle = '#4F46E5';
    ctx.lineWidth = 3;
    ctx.strokeRect(780, 1250, 320, 120);
    ctx.fillStyle = '#4F46E5';
    ctx.font = 'bold 22px "Inter", sans-serif';
    ctx.fillText('CLASSPDF VERIFIED', 810, 1295);
    ctx.font = '16px "Inter", sans-serif';
    ctx.fillText('Academic Fidelity Inspection', 810, 1330);

    const data = canvas.toDataURL('image/jpeg', 0.98);
    setSampleNoteDataUrl(data);
  }, []);

  // Determine which active image to use
  const targetImage = images.length > 0 && images[activeImageIdx] ? images[activeImageIdx] : null;
  const originalSourceUrl = targetImage ? targetImage.dataUrl : sampleNoteDataUrl;

  // Real-time canvas compression worker
  const renderCompressedPreview = useCallback((sourceUrl: string, qualityPercent: number) => {
    if (!sourceUrl) return;
    setIsGenerating(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const origW = img.naturalWidth || img.width;
      const origH = img.naturalHeight || img.height;

      const canvas = document.createElement('canvas');
      canvas.width = origW;
      canvas.height = origH;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsGenerating(false);
        return;
      }

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, origW, origH);
      ctx.drawImage(img, 0, 0);

      const q = Math.max(0.3, Math.min(1.0, qualityPercent / 100));
      const compressedUrl = canvas.toDataURL('image/jpeg', q);
      setCompressedDataUrl(compressedUrl);

      // Estimate compressed bytes from base64 string
      const head = 'data:image/jpeg;base64,';
      const base64Len = compressedUrl.length - head.length;
      const bytes = Math.round((base64Len * 3) / 4);
      setCompressedSizeBytes(bytes);

      if (targetImage) {
        setOriginalSizeBytes(targetImage.size);
      } else {
        // Approximate sample original size
        setOriginalSizeBytes(850000);
      }

      setIsGenerating(false);
    };
    img.onerror = () => {
      setIsGenerating(false);
    };
    img.src = sourceUrl;
  }, [targetImage]);

  // Re-run whenever slider or source image changes
  useEffect(() => {
    if (isOpen && originalSourceUrl) {
      renderCompressedPreview(originalSourceUrl, currentPercent);
    }
  }, [isOpen, originalSourceUrl, currentPercent, renderCompressedPreview]);

  // Handle split drag
  const handleSplitMouseDown = (e: React.MouseEvent) => {
    isDraggingSplit.current = true;
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingSplit.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSplitPos(pct);
  }, []);

  const handleMouseUp = useCallback(() => {
    isDraggingSplit.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  if (!isOpen) return null;

  // Calculate compression reduction
  const reductionPct = originalSizeBytes > 0 && compressedSizeBytes > 0
    ? Math.max(0, Math.round(((originalSizeBytes - compressedSizeBytes) / originalSizeBytes) * 100))
    : 0;

  // Visual Fidelity Assessment
  const getFidelityAssessment = (q: number) => {
    if (q >= 95) {
      return {
        rating: 'Maximum Fidelity (100% Crisp)',
        badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40',
        detail: 'Pristine clarity for complex mathematical equations, fine subscript exponents, and scanned diagrams with zero compression noise.',
        lmsAdvice: 'Larger file size. Best for high-stakes thesis submissions or archive-grade notes.',
      };
    }
    if (q >= 85) {
      return {
        rating: 'Recommended Academic Standard',
        badgeColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40',
        detail: 'Sharp, clean text contours with significant (~60-75%) file size savings. Highly readable on laptop and tablet screens.',
        lmsAdvice: 'Ideal for university LMS (Canvas, Blackboard, Moodle) with standard upload limits.',
      };
    }
    if (q >= 75) {
      return {
        rating: 'Balanced Economy Quality',
        badgeColor: 'text-blue-400 bg-blue-950/60 border-blue-500/40',
        detail: 'Legible for lecture slides and standard pen handwriting. Extremely light softening around high-contrast edges.',
        lmsAdvice: 'Great when combining many pages (10+ slides) to keep final PDF small.',
      };
    }
    return {
      rating: 'High Compression (Compact)',
      badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-500/40',
      detail: 'Aggressive byte reduction with visible compression artifacts around small handwriting. Noticeable savings.',
      lmsAdvice: 'Best when university portals enforce strict <5 MB total document limits.',
    };
  };

  const assessment = getFidelityAssessment(currentPercent);

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleApply = () => {
    onUpdateQuality(currentPercent);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quality-preview-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[920px] bg-[#0E1526] text-[#F8FAFC] rounded-3xl border border-[#232B45] shadow-2xl flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="px-5 py-4 border-b border-[#232B45] flex items-center justify-between shrink-0 bg-[#0B1020]/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <Eye className="w-5 h-5 text-[#22D3EE]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="quality-preview-title" className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Real-Time Quality &amp; Visual Fidelity Preview
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-[#22D3EE] border border-cyan-800/60 font-semibold">
                  Live Canvas
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Inspect how compression impacts handwritten notes, math formulas, and file size before compiling PDF
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {images.length > 1 && (
              <select
                value={activeImageIdx}
                onChange={(e) => setActiveImageIdx(Number(e.target.value))}
                aria-label="Select document page to inspect"
                className="text-xs bg-[#171D32] border border-[#232B45] text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {images.map((img, idx) => (
                  <option key={img.id} value={idx}>
                    Page {idx + 1}: {img.name.slice(0, 18)}...
                  </option>
                ))}
              </select>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1E2640] transition-colors cursor-pointer"
              aria-label="Close quality preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Control Bar: The Real-Time Slider & Presets */}
        <div className="px-5 py-3.5 bg-[#131D31] border-b border-[#232B45] shrink-0 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Slider track and dynamic readouts */}
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-300">
                    Compression Quality Level:
                  </span>
                  <span className="text-sm font-black font-mono text-[#22D3EE]">
                    {currentPercent}%
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${assessment.badgeColor}`}>
                    {assessment.rating}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-400">
                    Original: <strong className="text-slate-200">{formatBytes(originalSizeBytes)}</strong>
                  </span>
                  <span className="text-slate-500">→</span>
                  <span className="text-[#22D3EE]">
                    PDF Page: <strong>{formatBytes(compressedSizeBytes || 1)}</strong>
                  </span>
                  {reductionPct > 0 && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/40">
                      -{reductionPct}%
                    </span>
                  )}
                </div>
              </div>

              {/* Slider Input */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-slate-500">40% (Max Save)</span>
                <input
                  type="range"
                  min="40"
                  max="100"
                  step="1"
                  value={currentPercent}
                  onChange={(e) => setCurrentPercent(Number(e.target.value))}
                  className="flex-1 h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#22D3EE] focus:outline-none"
                  aria-label="Image compression quality slider"
                />
                <span className="text-[10px] font-mono text-slate-500">100% (Lossless)</span>
              </div>
            </div>

            {/* Quick Preset Buttons (70%, 80%, 90%, 95%) */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline">Presets:</span>
              {[
                { val: 70, label: '70% Compact' },
                { val: 80, label: '80% Balanced' },
                { val: 90, label: '90% Crisp' },
                { val: 95, label: '95% Studio' },
              ].map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => setCurrentPercent(p.val)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    currentPercent === p.val
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm shadow-indigo-500/20'
                      : 'bg-[#171D32] text-slate-300 border-[#232B45] hover:border-slate-500 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Context advice row */}
          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-0.5 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{assessment.detail}</span>
            </div>
            <div className="text-slate-500 italic hidden md:block">
              {assessment.lmsAdvice}
            </div>
          </div>
        </div>

        {/* View Mode & Zoom Toolbar */}
        <div className="px-5 py-2 bg-[#0B1020] border-b border-[#232B45] flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
          {/* Comparison Mode Switcher */}
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-[#171D32] border border-[#232B45]">
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'split' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span>Split Slider</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('side-by-side')}
              className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'side-by-side' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('toggle')}
              className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'toggle' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Toggle Mode</span>
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Magnify:</span>
            {[
              { level: 1, label: 'Fit' },
              { level: 1.5, label: '150%' },
              { level: 2, label: '200%' },
              { level: 3, label: '300%' },
            ].map((z) => (
              <button
                key={z.level}
                type="button"
                onClick={() => setZoomLevel(z.level)}
                className={`px-2 py-0.5 text-xs font-mono rounded-md border transition-colors cursor-pointer ${
                  zoomLevel === z.level
                    ? 'bg-cyan-950 text-[#22D3EE] border-cyan-700 font-bold'
                    : 'bg-[#171D32] text-slate-400 border-[#232B45] hover:text-white'
                }`}
              >
                {z.label}
              </button>
            ))}

            {viewMode === 'toggle' && (
              <button
                type="button"
                onMouseDown={() => setIsHoldingOriginal(true)}
                onMouseUp={() => setIsHoldingOriginal(false)}
                onTouchStart={() => setIsHoldingOriginal(true)}
                onTouchEnd={() => setIsHoldingOriginal(false)}
                className="ml-2 px-3 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 select-none cursor-pointer"
              >
                {isHoldingOriginal ? 'Viewing Original (100%)' : 'Hold to View Original'}
              </button>
            )}
          </div>
        </div>

        {/* Main Canvas Viewport Area */}
        <div
          ref={containerRef}
          className="flex-1 relative overflow-auto p-4 bg-[#070B14] flex items-center justify-center select-none"
        >
          {isGenerating && (
            <div className="absolute top-4 right-4 z-30 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Re-encoding at {currentPercent}%...</span>
            </div>
          )}

          {/* Mode 1: Split Slider View */}
          {viewMode === 'split' && (
            <div
              className="relative max-w-full max-h-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-white transition-transform duration-100"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
              }}
            >
              {/* Background layer: Compressed at currentPercent */}
              <img
                src={compressedDataUrl || originalSourceUrl}
                alt="Compressed PDF Fidelity Preview"
                className="max-h-[64vh] object-contain block"
              />

              {/* Foreground layer: Original (clipped by splitPos) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  clipPath: `polygon(0 0, ${splitPos}% 0, ${splitPos}% 100%, 0 100%)`,
                }}
              >
                <img
                  src={originalSourceUrl}
                  alt="Original Document (100% Quality)"
                  className="max-h-[64vh] object-contain block"
                />
              </div>

              {/* Draggable Divider Line */}
              <div
                onMouseDown={handleSplitMouseDown}
                className="absolute top-0 bottom-0 z-20 cursor-ew-resize flex items-center justify-center"
                style={{ left: `calc(${splitPos}% - 1px)` }}
              >
                <div className="w-0.5 h-full bg-[#22D3EE] shadow-lg shadow-cyan-500/50" />
                <div className="absolute w-8 h-8 rounded-full bg-[#0E1526] border-2 border-[#22D3EE] shadow-xl flex items-center justify-center text-[#22D3EE] cursor-ew-resize">
                  <SplitSquareVertical className="w-4 h-4" />
                </div>
              </div>

              {/* Floating Badges */}
              <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold shadow-md">
                Original (100% Uncompressed)
              </div>
              <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-[11px] font-bold shadow-md">
                PDF Fidelity ({currentPercent}%)
              </div>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-[10px] text-slate-300 border border-slate-700/60 pointer-events-none">
                ↔ Drag divider to compare before &amp; after
              </div>
            </div>
          )}

          {/* Mode 2: Side-by-Side Comparison */}
          {viewMode === 'side-by-side' && (
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-full max-h-full transition-transform duration-100"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
              }}
            >
              {/* Original Card */}
              <div className="flex flex-col rounded-2xl border border-slate-800 bg-[#111827] overflow-hidden">
                <div className="px-3 py-2 bg-[#171D32] border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-200">
                  <span>Original Document (100%)</span>
                  <span className="text-slate-400 font-mono">{formatBytes(originalSizeBytes)}</span>
                </div>
                <div className="p-3 bg-white flex items-center justify-center overflow-hidden">
                  <img
                    src={originalSourceUrl}
                    alt="Original"
                    className="max-h-[50vh] object-contain"
                  />
                </div>
              </div>

              {/* Compressed Card */}
              <div className="flex flex-col rounded-2xl border border-cyan-800/60 bg-[#111827] overflow-hidden">
                <div className="px-3 py-2 bg-[#171D32] border-b border-cyan-800/60 flex items-center justify-between text-xs font-bold text-cyan-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span>PDF Fidelity ({currentPercent}%)</span>
                  </span>
                  <span className="font-mono text-cyan-400">{formatBytes(compressedSizeBytes || 1)}</span>
                </div>
                <div className="p-3 bg-white flex items-center justify-center overflow-hidden">
                  <img
                    src={compressedDataUrl || originalSourceUrl}
                    alt="Compressed at selected level"
                    className="max-h-[50vh] object-contain"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Mode 3: Toggle / Full View */}
          {viewMode === 'toggle' && (
            <div
              className="relative max-w-full max-h-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-white transition-transform duration-100"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
              }}
            >
              <img
                src={isHoldingOriginal ? originalSourceUrl : (compressedDataUrl || originalSourceUrl)}
                alt="Full View"
                className="max-h-[64vh] object-contain block"
              />
              <div className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/20 text-xs font-bold">
                {isHoldingOriginal ? (
                  <span className="text-amber-300">Viewing Original (100%)</span>
                ) : (
                  <span className="text-cyan-300">Viewing PDF Output ({currentPercent}%)</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#0B1020] border-t border-[#232B45] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Chosen: <strong className="text-white">{currentPercent}% Quality</strong> · Estimated PDF reduction:{' '}
              <strong className="text-emerald-400">~{reductionPct}%</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#171D32] hover:bg-[#1E2640] border border-[#232B45] rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 active:scale-[0.98] rounded-xl shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 text-cyan-300" />
              <span>Apply {currentPercent}% Quality to PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
