import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Code2,
  ExternalLink,
  Eye,
  Sliders,
  Sparkles,
  Info
} from 'lucide-react';
import {
  AdSenseConfig,
  getAdSenseConfig,
  saveAdSenseConfig,
  isPublisherIdValid,
  isSlotIdValid,
} from '../config/adsense';

interface AdSenseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdSenseSetupModal: React.FC<AdSenseSetupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [config, setConfig] = useState<AdSenseConfig>(getAdSenseConfig);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [publisherInput, setPublisherInput] = useState(config.publisherId);
  const [enabledInput, setEnabledInput] = useState(config.enabled);
  const [devModeInput, setDevModeInput] = useState(Boolean(config.devInspectionMode));
  const [slotsInput, setSlotsInput] = useState({
    heroBelowIntro: config.slots.heroBelowIntro || '',
    pageBottom: config.slots.pageBottom || '',
    workspaceSidebar: config.slots.workspaceSidebar || '',
  });

  useEffect(() => {
    if (isOpen) {
      const current = getAdSenseConfig();
      setConfig(current);
      setPublisherInput(current.publisherId);
      setEnabledInput(current.enabled);
      setDevModeInput(Boolean(current.devInspectionMode));
      setSlotsInput({
        heroBelowIntro: current.slots.heroBelowIntro || '',
        pageBottom: current.slots.pageBottom || '',
        workspaceSidebar: current.slots.workspaceSidebar || '',
      });
      setSaveSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isPubValid = isPublisherIdValid(publisherInput);
  const hasValidSetup = isPubValid && enabledInput;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AdSenseConfig = {
      publisherId: publisherInput.trim(),
      enabled: enabledInput,
      slots: {
        heroBelowIntro: slotsInput.heroBelowIntro.trim(),
        pageBottom: slotsInput.pageBottom.trim(),
        workspaceSidebar: slotsInput.workspaceSidebar.trim(),
      },
      devInspectionMode: devModeInput,
    };
    saveAdSenseConfig(updated);
    setConfig(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetToDefault = () => {
    setPublisherInput('');
    setEnabledInput(false);
    setDevModeInput(false);
    setSlotsInput({
      heroBelowIntro: '',
      pageBottom: '',
      workspaceSidebar: '',
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="adsense-setup-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#171D32] rounded-3xl shadow-2xl border border-slate-200/80 dark:border-[#232B45] overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200/80 dark:border-[#232B45] flex items-center justify-between bg-gradient-to-r from-indigo-50/60 to-transparent dark:from-[#111827]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-[#111827] text-indigo-600 dark:text-[#22D3EE] border border-transparent dark:border-[#232B45] flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 id="adsense-setup-title" className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#F8FAFC]">
                Google AdSense Readiness & Configuration
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#A7B0C5]">
                Official ad placement management · Compliant with AdSense policies
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-[#F8FAFC] rounded-xl hover:bg-slate-100 dark:hover:bg-[#111827] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Callout */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          <div className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
            hasValidSetup
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200'
          }`}>
            {hasValidSetup ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <p className="font-bold">
                {hasValidSetup
                  ? 'AdSense Units Configured & Active'
                  : 'Current Status: Ad Containers Inactive (Awaiting AdSense Approval)'}
              </p>
              <p className="text-slate-600 dark:text-[#A7B0C5] leading-relaxed">
                {hasValidSetup
                  ? `Google AdSense publisher ID (${publisherInput}) is active. The official AdSense script will load on page visit.`
                  : 'All ad slots remain disabled and invisible to visitors until a valid Google AdSense Publisher ID (ca-pub-...) and ad slots are configured. No fake ads or placeholder scripts are served.'}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-5">
            {/* Publisher ID */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="pub-id-input" className="text-xs font-bold text-slate-800 dark:text-[#F8FAFC]">
                  Google AdSense Publisher ID
                </label>
                <span className="text-[11px] text-slate-400 dark:text-[#A7B0C5] font-mono">Format: ca-pub-XXXXXXXXXXXXXXXX</span>
              </div>
              <input
                id="pub-id-input"
                type="text"
                placeholder="ca-pub-1234567890123456"
                value={publisherInput}
                onChange={(e) => setPublisherInput(e.target.value)}
                className={`w-full px-3.5 py-2.5 text-xs rounded-xl border bg-slate-50 dark:bg-[#111827] text-slate-900 dark:text-[#F8FAFC] placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 ${
                  publisherInput && !isPubValid
                    ? 'border-rose-400 focus:ring-rose-500'
                    : 'border-slate-200 dark:border-[#232B45] focus:ring-indigo-500'
                }`}
              />
              {publisherInput && !isPubValid && (
                <p className="text-[11px] text-rose-500">
                  Must start with "ca-pub-" followed by 10 to 20 digits.
                </p>
              )}
            </div>

            {/* Master Toggle */}
            <div className="p-3.5 bg-slate-50 dark:bg-[#111827] rounded-xl border border-slate-200/80 dark:border-[#232B45] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-[#F8FAFC]">
                  Master Ad Serving Switch
                </p>
                <p className="text-[11px] text-slate-500 dark:text-[#A7B0C5]">
                  Enable or disable all ad containers instantly without altering code.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabledInput}
                  onChange={(e) => setEnabledInput(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* Developer Outline Preview */}
            <div className="p-3.5 bg-slate-50 dark:bg-[#111827] rounded-xl border border-slate-200/80 dark:border-[#232B45] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-[#F8FAFC] flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-indigo-500 dark:text-[#22D3EE]" />
                  <span>Developer Inspection Outlines</span>
                </p>
                <p className="text-[11px] text-slate-500 dark:text-[#A7B0C5]">
                  Visually inspect where responsive ad boxes will appear on mobile and desktop.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={devModeInput}
                  onChange={(e) => setDevModeInput(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* Slot IDs Section */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#A7B0C5]">
                Responsive Ad Unit Slot IDs
              </h3>

              <div className="space-y-2">
                <div>
                  <label className="text-xs text-slate-600 dark:text-[#A7B0C5] block mb-1">
                    Below Introduction (Home Header)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1234567890"
                    value={slotsInput.heroBelowIntro}
                    onChange={(e) => setSlotsInput((s) => ({ ...s, heroBelowIntro: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-[#232B45] bg-slate-50 dark:bg-[#111827] text-slate-900 dark:text-[#F8FAFC] focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 dark:text-[#A7B0C5] block mb-1">
                    Bottom of Page (Above Footer)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 9876543210"
                    value={slotsInput.pageBottom}
                    onChange={(e) => setSlotsInput((s) => ({ ...s, pageBottom: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-[#232B45] bg-slate-50 dark:bg-[#111827] text-slate-900 dark:text-[#F8FAFC] focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 dark:text-[#A7B0C5] block mb-1">
                    Converter Workspace Sidebar
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5554443332"
                    value={slotsInput.workspaceSidebar}
                    onChange={(e) => setSlotsInput((s) => ({ ...s, workspaceSidebar: e.target.value }))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-[#232B45] bg-slate-50 dark:bg-[#111827] text-slate-900 dark:text-[#F8FAFC] focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 flex items-center justify-between gap-3 border-t border-slate-200/80 dark:border-[#232B45]">
              <button
                type="button"
                onClick={handleResetToDefault}
                className="px-3 py-2 text-xs text-slate-500 hover:text-slate-700 dark:text-[#A7B0C5] dark:hover:text-[#F8FAFC] transition-colors cursor-pointer"
              >
                Reset to Defaults
              </button>

              <div className="flex items-center gap-2">
                {saveSuccess && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
                  </span>
                )}
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </form>

          {/* Setup Guide & Policy Checklist */}
          <div className="p-4 bg-slate-50 dark:bg-[#111827] rounded-2xl border border-slate-200/80 dark:border-[#232B45] space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 dark:text-[#F8FAFC] flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-600 dark:text-[#22D3EE]" />
              <span>Next Steps to Go Live with Google AdSense</span>
            </h3>
            <ol className="list-decimal pl-5 space-y-1.5 text-slate-600 dark:text-[#A7B0C5]">
              <li>
                <strong>Apply:</strong> Submit your custom domain to <a href="https://adsense.google.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-[#22D3EE] hover:underline">Google AdSense</a>.
              </li>
              <li>
                <strong>Approval:</strong> Wait for Google's review email approving your site.
              </li>
              <li>
                <strong>Activate:</strong> Enter your Publisher ID (<code className="bg-slate-200/70 dark:bg-[#171D32] px-1 py-0.5 rounded border border-transparent dark:border-[#232B45]">ca-pub-...</code>) in the form above or in <code className="bg-slate-200/70 dark:bg-[#171D32] px-1 py-0.5 rounded border border-transparent dark:border-[#232B45]">/src/config/adsense.ts</code>.
              </li>
              <li>
                <strong>Compliance:</strong> Ads remain clearly separated from PDF convert & download buttons to avoid accidental clicks.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
