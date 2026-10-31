/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { ConverterWorkspace } from './components/ConverterWorkspace';
import { MyFilesView } from './components/MyFilesView';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { PrivacyPolicyView } from './components/PrivacyPolicyView';
import { TermsView } from './components/TermsView';
import { ConversionModal } from './components/ConversionModal';
import { ImagePreviewModal } from './components/ImagePreviewModal';
import { ConfirmModal } from './components/ConfirmModal';
import { PdfToWordSection } from './components/PdfToWordSection';
import { WordToPdfSection } from './components/WordToPdfSection';
import { MergePdfSection } from './components/MergePdfSection';
import { CompressPdfSection } from './components/CompressPdfSection';
import { SasicoDesignPreview } from './components/SasicoDesignPreview';
import {
  UploadedImage,
  PdfSettings,
  ConversionHistoryItem
} from './types';
import { generatePdfFromImages } from './utils/pdfGenerator';

const DEFAULT_SETTINGS: PdfSettings = {
  pageSize: 'a4',
  orientation: 'auto',
  margin: 'small',
  fitting: 'contain',
  quality: 'standard',
  qualityPercent: 85,
  imagesPerPage: 1,
  filename: 'ClassPDF_Document',
  backgroundColor: '#FFFFFF',
  addPageNumbers: true,
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'convert' | 'files' | 'about' | 'contact' | 'privacy' | 'terms' | 'pdf-to-word' | 'word-to-pdf' | 'merge-pdf' | 'compress-pdf' | 'design-preview'>('home');
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [settings, setSettings] = useState<PdfSettings>(DEFAULT_SETTINGS);
  const [showAds, setShowAds] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('classpdf_show_ads');
      return stored !== null ? stored === 'true' : true;
    } catch {
      return true;
    }
  });

  // Dark mode (Premium SaaS dark theme default)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('classpdf_theme');
      if (stored !== null) {
        return stored === 'dark';
      }
    } catch {
      // Ignore
    }
    return true; // Default to premium SaaS dark theme
  });

  // Conversion History (persisted non-sensitive metadata)
  const [history, setHistory] = useState<ConversionHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem('classpdf_history');
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return [];
  });

  // Modals state
  const [previewImage, setPreviewImage] = useState<UploadedImage | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const handleSaveEditedImage = (updated: UploadedImage) => {
    setImages((prev) => prev.map((img) => (img.id === updated.id ? updated : img)));
    setPreviewImage(updated);
  };

  // Conversion progress & result state
  const [conversionState, setConversionState] = useState<{
    isOpen: boolean;
    isConverting: boolean;
    progress: { current: number; total: number; message: string };
    result: {
      blob: Blob | null;
      blobUrl: string | null;
      pageCount: number;
      fileSizeBytes: number;
      filename: string;
    } | null;
  }>({
    isOpen: false,
    isConverting: false,
    progress: { current: 0, total: 0, message: '' },
    result: null,
  });

  // Sync dark mode class with HTML and persist preference
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      try {
        localStorage.setItem('classpdf_theme', 'dark');
      } catch {
        // Ignore
      }
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      try {
        localStorage.setItem('classpdf_theme', 'light');
      } catch {
        // Ignore
      }
    }
  }, [isDarkMode]);



  // Persist history changes
  useEffect(() => {
    try {
      // Only keep metadata, exclude large blob URLs
      const safeHistory = history.map(({ blobUrl, ...rest }) => rest);
      localStorage.setItem('classpdf_history', JSON.stringify(safeHistory));
    } catch {
      // Ignore
    }
  }, [history]);

  // Handle adding images
  const handleImagesAdded = (newImages: UploadedImage[]) => {
    setImages((prev) => [...prev, ...newImages]);
    // Switch to convert tab if on home page
    if (currentTab === 'home') {
      setCurrentTab('convert');
    }
  };

  // Remove single image
  const handleRemoveImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  // Move image up
  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index - 1];
      copy[index - 1] = temp;
      return copy;
    });
  };

  // Move image down
  const handleMoveDown = (index: number) => {
    if (index >= images.length - 1) return;
    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index + 1];
      copy[index + 1] = temp;
      return copy;
    });
  };

  // Rotate image 90 degrees
  const handleRotateImage = (id: string) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, rotation: (img.rotation + 90) % 360 } : img
      )
    );
    if (previewImage && previewImage.id === id) {
      setPreviewImage((prev) =>
        prev ? { ...prev, rotation: (prev.rotation + 90) % 360 } : null
      );
    }
  };

  // Drag and drop reorder
  const handleReorderImages = (startIndex: number, endIndex: number) => {
    setImages((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(startIndex, 1);
      copy.splice(endIndex, 0, moved);
      return copy;
    });
  };

  // Clear all images with confirmation
  const handleClearAllImages = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Clear All Uploaded Images?',
      message: 'This will remove all currently loaded images from your conversion queue. You will need to upload them again.',
      onConfirm: () => {
        setImages([]);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Reset settings
  const handleResetSettings = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset PDF Settings?',
      message: 'Restore default PDF options (A4, auto orientation, standard margins, and default quality)?',
      onConfirm: () => {
        setSettings(DEFAULT_SETTINGS);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Execute PDF conversion
  const handleStartConversion = async () => {
    if (images.length === 0) return;

    // Sanitize filename
    let finalFilename = settings.filename.trim() || 'ClassPDF_Document';
    if (!finalFilename.toLowerCase().endsWith('.pdf')) {
      finalFilename += '.pdf';
    }

    setConversionState({
      isOpen: true,
      isConverting: true,
      progress: { current: 0, total: images.length, message: 'Preparing images...' },
      result: null,
    });

    try {
      // Run client-side PDF generation
      const genResult = await generatePdfFromImages(
        images,
        { ...settings, filename: finalFilename },
        (current, total, message) => {
          setConversionState((prev) => ({
            ...prev,
            progress: { current, total, message },
          }));
        }
      );

      // Create new history item
      const newHistoryItem: ConversionHistoryItem = {
        id: `pdf-${Date.now()}`,
        filename: finalFilename,
        pageCount: genResult.pageCount,
        fileSizeBytes: genResult.fileSizeBytes,
        createdAt: new Date().toISOString(),
        pageSize: settings.pageSize,
        orientation: settings.orientation,
        imagesCount: images.length,
        blobUrl: genResult.blobUrl,
      };

      setHistory((prev) => [newHistoryItem, ...prev]);

      setConversionState({
        isOpen: true,
        isConverting: false,
        progress: { current: images.length, total: images.length, message: 'Complete!' },
        result: {
          blob: genResult.blob,
          blobUrl: genResult.blobUrl,
          pageCount: genResult.pageCount,
          fileSizeBytes: genResult.fileSizeBytes,
          filename: finalFilename,
        },
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'PDF conversion failed';
      alert(`Error creating PDF: ${errMsg}`);
      setConversionState((prev) => ({ ...prev, isOpen: false, isConverting: false }));
    }
  };

  // Start new conversion from modal
  const handleStartNewConversion = () => {
    setConversionState((prev) => ({ ...prev, isOpen: false }));
    setImages([]);
    setCurrentTab('home');
  };

  // Download history item
  const handleDownloadHistoryItem = (item: ConversionHistoryItem) => {
    if (!item.blobUrl) return;
    const link = document.createElement('a');
    link.href = item.blobUrl;
    link.download = item.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete history item
  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear all history
  const handleClearHistory = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Clear PDF Conversion History?',
      message: 'This will remove all saved conversion records from your browser local storage.',
      onConfirm: () => {
        setHistory([]);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Check for design preview URL parameter or hash (?preview=sasico or #preview)
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('preview') === 'sasico' || window.location.hash === '#preview') {
        setCurrentTab('design-preview');
      }
    } catch {
      // Ignore
    }
  }, []);

  // Isolated Sasico Design Preview - separate showcase route, leaves live website completely untouched
  if (currentTab === 'design-preview') {
    return <SasicoDesignPreview onBackToLive={() => setCurrentTab('home')} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((d) => !d)}
        imagesCount={images.length}
      />

      {/* Main Content Pages */}
      <main className="flex-1 pb-16">
        {currentTab === 'home' && (
          <HomeHero
            onImagesAdded={handleImagesAdded}
            onGoToConvert={() => setCurrentTab('convert')}
            imagesCount={images.length}
            showAds={showAds}
            onSelectTab={setCurrentTab}
          />
        )}

        {currentTab === 'convert' && (
          <ConverterWorkspace
            images={images}
            settings={settings}
            onImagesAdded={handleImagesAdded}
            onRemoveImage={handleRemoveImage}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            onRotateImage={handleRotateImage}
            onPreviewImage={(img) => setPreviewImage(img)}
            onReorderImages={handleReorderImages}
            onClearAllImages={handleClearAllImages}
            onUpdateSettings={setSettings}
            onResetSettings={handleResetSettings}
            onStartConversion={handleStartConversion}
            isConverting={conversionState.isConverting}
            showAds={showAds}
          />
        )}

        {currentTab === 'files' && (
          <MyFilesView
            history={history}
            onDownloadItem={handleDownloadHistoryItem}
            onDeleteItem={handleDeleteHistoryItem}
            onClearHistory={handleClearHistory}
            onGoToConvert={() => setCurrentTab('convert')}
          />
        )}

        {currentTab === 'about' && (
          <AboutView
            onGoToConvert={() => setCurrentTab('convert')}
            onSelectTab={setCurrentTab}
          />
        )}

        {currentTab === 'contact' && (
          <ContactView onGoToConvert={() => setCurrentTab('convert')} />
        )}

        {currentTab === 'privacy' && (
          <PrivacyPolicyView />
        )}

        {currentTab === 'terms' && (
          <TermsView />
        )}

        {currentTab === 'pdf-to-word' && (
          <div className="py-6 space-y-6">
            <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentTab('home')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-[#A7B0C5] hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
              >
                ← Back to Home
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentTab('convert')}
                  className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:text-indigo-500 transition-colors cursor-pointer"
                >
                  Switch to Image to PDF →
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentTab('merge-pdf')}
                  className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:text-indigo-500 transition-colors cursor-pointer"
                >
                  Merge PDF →
                </button>
              </div>
            </div>
            <PdfToWordSection id="pdf-to-word-page" />
          </div>
        )}

        {currentTab === 'word-to-pdf' && (
          <div className="py-6 space-y-6">
            <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentTab('home')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-[#A7B0C5] hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
              >
                ← Back to Home
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentTab('convert')}
                  className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:text-indigo-500 transition-colors cursor-pointer"
                >
                  Image to PDF →
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentTab('pdf-to-word')}
                  className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:text-indigo-500 transition-colors cursor-pointer"
                >
                  PDF to Word →
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentTab('merge-pdf')}
                  className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:text-indigo-500 transition-colors cursor-pointer"
                >
                  Merge PDF →
                </button>
              </div>
            </div>
            <WordToPdfSection
              id="word-to-pdf-page"
              onConversionSuccess={(res) => {
                // Record in recent documents history
                setHistory((prev) => [
                  {
                    id: `word2pdf-${Date.now()}`,
                    filename: res.filename,
                    pageCount: res.pageCount,
                    fileSizeBytes: res.fileSizeBytes,
                    createdAt: new Date().toISOString(),
                    pageSize: 'a4',
                    orientation: 'auto',
                    imagesCount: 1,
                    blobUrl: res.blobUrl,
                  },
                  ...prev,
                ]);
              }}
            />
          </div>
        )}

        {currentTab === 'merge-pdf' && (
          <div className="py-6 space-y-6">
            <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentTab('home')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-[#A7B0C5] hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
              >
                ← Back to Home
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentTab('convert')}
                  className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:text-indigo-500 transition-colors cursor-pointer"
                >
                  Image to PDF →
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentTab('pdf-to-word')}
                  className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:text-indigo-500 transition-colors cursor-pointer"
                >
                  PDF to Word →
                </button>
              </div>
            </div>
            <MergePdfSection
              id="merge-pdf-page"
              onMergeSuccess={(res) => {
                // Record in recent documents history
                setHistory((prev) => [
                  {
                    id: `merge-${Date.now()}`,
                    filename: res.filename,
                    pageCount: res.totalPageCount,
                    fileSizeBytes: res.fileSizeBytes,
                    createdAt: new Date().toISOString(),
                    pageSize: 'custom',
                    orientation: 'auto',
                    imagesCount: res.fileCount,
                    blobUrl: res.blobUrl,
                  },
                  ...prev,
                ]);
              }}
            />
          </div>
        )}

        {currentTab === 'compress-pdf' && (
          <div className="py-6 space-y-6">
            <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentTab('home')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-[#A7B0C5] hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
              >
                ← Back to Home
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentTab('convert')}
                  className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:text-indigo-500 transition-colors cursor-pointer"
                >
                  Image to PDF →
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentTab('merge-pdf')}
                  className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:text-indigo-500 transition-colors cursor-pointer"
                >
                  Merge PDF →
                </button>
              </div>
            </div>
            <CompressPdfSection
              id="compress-pdf-page"
              onCompressSuccess={(res) => {
                // Record in recent documents history
                setHistory((prev) => [
                  {
                    id: `compress-${Date.now()}`,
                    filename: res.filename,
                    pageCount: res.pageCount,
                    fileSizeBytes: res.compressedSizeBytes,
                    createdAt: new Date().toISOString(),
                    pageSize: 'a4',
                    orientation: 'auto',
                    imagesCount: 1,
                    blobUrl: res.blobUrl,
                  },
                  ...prev,
                ]);
              }}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-[#232B45] bg-white dark:bg-[#0B1020] py-12 text-xs text-slate-500 dark:text-[#A7B0C5] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Brand column */}
            <div className="md:col-span-4 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white dark:bg-[#171D32] border border-slate-200/90 dark:border-[#232B45] shadow-xs p-1 flex items-center justify-center shrink-0">
                  <img
                    src="/logo.png"
                    alt="ClassPDF Maker"
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
                <span className="font-bold text-sm text-slate-900 dark:text-[#F8FAFC]">
                  ClassPDF Maker
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-[#A7B0C5] leading-relaxed max-w-sm">
                Fast, 100% private in-browser document conversion platform for students, educators, and professionals. All files are processed strictly client-side without remote uploads.
              </p>
              <div className="pt-1 flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>100% Client-Side Memory · Free to Use</span>
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-[#F8FAFC]">
                Converter Tools
              </h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setCurrentTab('home')}
                    className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                  >
                    Home Overview
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentTab('convert')}
                    className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                  >
                    Image to PDF Converter
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentTab('pdf-to-word')}
                    className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>PDF to Word Converter</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentTab('word-to-pdf')}
                    className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Word to PDF Converter</span>
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold px-1.5 py-0.2 rounded">
                      New
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentTab('merge-pdf')}
                    className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Merge PDF Tool</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentTab('compress-pdf')}
                    className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Compress PDF Tool</span>
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold px-1.5 py-0.2 rounded">
                      New
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentTab('files')}
                    className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                  >
                    My Recent Documents
                  </button>
                </li>
              </ul>
            </div>

            {/* Company & Support Column */}
            <div className="md:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-[#F8FAFC]">
                About &amp; Help
              </h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setCurrentTab('about')}
                    className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentTab('contact')}
                    className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentTab('design-preview')}
                    className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1.5 text-indigo-600 dark:text-cyan-400 font-semibold"
                  >
                    <span>Sasico Design Preview</span>
                    <span className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1 py-0.2 rounded uppercase tracking-wider font-bold">Concept</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-[#F8FAFC]">
                Legal &amp; Privacy
              </h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setCurrentTab('privacy')}
                    className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentTab('terms')}
                    className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                  >
                    Terms of Service
                  </button>
                </li>
                <li className="text-[11px] text-slate-400 dark:text-[#A7B0C5]">
                  Direct Inquiries: <a href="mailto:danyalkhancs56@gmail.com" className="text-indigo-600 dark:text-cyan-400 hover:underline">danyalkhancs56@gmail.com</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/60 dark:border-[#1E2640] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 dark:text-[#A7B0C5]">
            <div>
              © 2026 ClassPDF Maker. Designed for students, researchers, and public use. Client-side privacy guaranteed.
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {/* AdSense Placement Toggle */}
              <button
                type="button"
                onClick={() => {
                  const next = !showAds;
                  setShowAds(next);
                  try {
                    localStorage.setItem('classpdf_show_ads', String(next));
                  } catch {
                    // Ignore
                  }
                }}
                className="hover:text-slate-600 dark:hover:text-[#F8FAFC] transition-colors cursor-pointer px-3 py-1 rounded-lg bg-slate-100 dark:bg-[#171D32] border border-slate-200/80 dark:border-[#232B45]"
                title="Toggle Google AdSense reserved placeholder containers"
              >
                Ad Slots: <span className="font-semibold text-indigo-600 dark:text-cyan-400">{showAds ? 'Enabled' : 'Disabled'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDarkMode((d) => !d)}
                className="hover:text-slate-600 dark:hover:text-[#F8FAFC] transition-colors cursor-pointer px-3 py-1 rounded-lg bg-slate-100 dark:bg-[#171D32] border border-slate-200/80 dark:border-[#232B45]"
                title="Toggle Light or Dark Mode"
              >
                Theme: <span className="font-semibold text-indigo-600 dark:text-cyan-400">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Conversion Progress & Preview Modal */}
      <ConversionModal
        isOpen={conversionState.isOpen}
        onClose={() => setConversionState((prev) => ({ ...prev, isOpen: false }))}
        isConverting={conversionState.isConverting}
        progress={conversionState.progress}
        result={conversionState.result}
        onStartNew={handleStartNewConversion}
      />

      {/* Image Preview, Crop, and Filter Modal */}
      <ImagePreviewModal
        image={previewImage}
        onClose={() => setPreviewImage(null)}
        onRotate={handleRotateImage}
        onSaveImage={handleSaveEditedImage}
      />

      {/* Accessible Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
