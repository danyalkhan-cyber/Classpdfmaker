import React, { useState } from 'react';
import {
  X,
  Video,
  Sparkles,
  Download,
  Loader2,
  AlertCircle,
  Play,
  Image as ImageIcon,
  Film
} from 'lucide-react';
import { UploadedImage, GeneratedVideoItem } from '../types';

interface VideoStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialImage?: UploadedImage | null;
  availableImages: UploadedImage[];
  onVideoCreated?: (item: GeneratedVideoItem) => void;
}

export const VideoStudioModal: React.FC<VideoStudioModalProps> = ({
  isOpen,
  onClose,
  initialImage,
  availableImages,
  onVideoCreated,
}) => {
  const [mode, setMode] = useState<'animate' | 'text'>('animate');
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(initialImage || availableImages[0] || null);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [textPrompt, setTextPrompt] = useState(
    'A high-definition cinematic camera pan over handwritten mathematical equations and diagrams, illuminated by gentle library sunlight.'
  );
  const [animatePrompt, setAnimatePrompt] = useState(
    'Smooth camera pan across the handwritten notes with dynamic lighting, bringing diagrams to life.'
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedVideo, setGeneratedVideo] = useState<GeneratedVideoItem | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    setGeneratedVideo(null);

    try {
      if (mode === 'animate') {
        if (!selectedImage) {
          throw new Error('Please select an image to animate.');
        }

        const res = await fetch('/api/animate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: selectedImage.dataUrl,
            mimeType: selectedImage.type || 'image/jpeg',
            prompt: animatePrompt,
            aspectRatio,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to animate image into video');
        }

        const videoItem: GeneratedVideoItem = {
          id: `vid-${Date.now()}`,
          prompt: animatePrompt,
          videoUrl: data.videoUrl,
          aspectRatio,
          createdAt: new Date().toISOString(),
          sourceImageName: selectedImage.name,
        };
        setGeneratedVideo(videoItem);
        onVideoCreated?.(videoItem);
      } else {
        if (!textPrompt.trim()) {
          throw new Error('Please enter a description for the video.');
        }

        const res = await fetch('/api/generate-video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: textPrompt,
            aspectRatio,
            duration: '5s',
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to generate video from text');
        }

        const videoItem: GeneratedVideoItem = {
          id: `vid-${Date.now()}`,
          prompt: textPrompt,
          videoUrl: data.videoUrl,
          aspectRatio,
          createdAt: new Date().toISOString(),
        };
        setGeneratedVideo(videoItem);
        onVideoCreated?.(videoItem);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Video generation failed';
      setErrorMsg(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedVideo?.videoUrl) return;
    const a = document.createElement('a');
    a.href = generatedVideo.videoUrl;
    a.download = `ClassVideo_${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Gemini Omni Flash Video Studio
              </h2>
              <p className="text-xs text-slate-500">
                Animate note photos into video clips or generate presentation video
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-2 mt-4 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setMode('animate')}
            className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              mode === 'animate'
                ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Animate Note Photo</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('text')}
            className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              mode === 'text'
                ? 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Text to Video</span>
          </button>
        </div>

        {/* Inputs */}
        <div className="mt-4 space-y-4">
          {mode === 'animate' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Select Photo to Animate
              </label>
              {availableImages.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1 border border-slate-200 dark:border-slate-800 rounded-xl">
                  {availableImages.map((img) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage?.id === img.id
                          ? 'border-sky-500 ring-2 ring-sky-400'
                          : 'border-transparent hover:opacity-80'
                      }`}
                    >
                      <img
                        src={img.dataUrl}
                        alt={img.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-amber-600">Please upload a photo in the converter first.</p>
              )}

              <div className="mt-3">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Animation & Motion Instructions
                </label>
                <textarea
                  value={animatePrompt}
                  onChange={(e) => setAnimatePrompt(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  placeholder="e.g. Cinematic camera pan across the handwritten diagrams..."
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Video Prompt
              </label>
              <textarea
                value={textPrompt}
                onChange={(e) => setTextPrompt(e.target.value)}
                rows={3}
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                placeholder="Describe the educational video to generate..."
              />
            </div>
          )}

          {/* Aspect Ratio Selector (16:9 or 9:16 per feature requirements) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Aspect Ratio
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAspectRatio('16:9')}
                className={`py-2 px-3 text-xs font-medium rounded-xl border text-center transition-all ${
                  aspectRatio === '16:9'
                    ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                16:9 (Landscape Presentation)
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio('9:16')}
                className={`py-2 px-3 text-xs font-medium rounded-xl border text-center transition-all ${
                  aspectRatio === '9:16'
                    ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                9:16 (Portrait Mobile)
              </button>
            </div>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Video Player Output */}
        {generatedVideo && (
          <div className="mt-4 space-y-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Generated Video Preview
              </span>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download MP4</span>
              </button>
            </div>
            <div className="rounded-xl overflow-hidden bg-black flex items-center justify-center max-h-72">
              <video
                src={generatedVideo.videoUrl}
                controls
                autoPlay
                loop
                className="max-h-72 max-w-full"
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || (mode === 'animate' && !selectedImage)}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-xs transition-colors disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating Video with Omni Flash...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{mode === 'animate' ? 'Animate Video' : 'Generate Video'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
