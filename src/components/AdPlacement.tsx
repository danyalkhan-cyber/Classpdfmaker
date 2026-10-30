import React, { useEffect, useState } from 'react';
import {
  getAdSenseConfig,
  isAdSenseSlotActive,
  injectAdSenseScript,
  AdSenseConfig,
} from '../config/adsense';

export type AdSlotType = 'leaderboard' | 'rectangle' | 'infeed' | 'footer-banner';

interface AdPlacementProps {
  slotType: AdSlotType;
  slotId?: string;
  className?: string;
  showAds?: boolean;
}

/**
 * Responsive Google AdSense placement container.
 * 
 * Compliant with Google AdSense Publisher Policies:
 * - Remains completely disabled (renders null) unless a valid Google publisher ID ('ca-pub-...')
 *   and valid ad slot ID are configured.
 * - Does NOT display fake ads, simulated advertising creative, or deceptive placeholders.
 * - Isolates ad units with an explicit "Advertisement" label and keeps them separate from
 *   file upload, conversion, and download actions.
 */
export const AdPlacement: React.FC<AdPlacementProps> = ({
  slotType,
  slotId,
  className = '',
  showAds = true,
}) => {
  const [config, setConfig] = useState<AdSenseConfig>(getAdSenseConfig);

  useEffect(() => {
    const handleConfigChange = () => {
      setConfig(getAdSenseConfig());
    };
    window.addEventListener('classpdf:adsense_config_change', handleConfigChange);
    return () => {
      window.removeEventListener('classpdf:adsense_config_change', handleConfigChange);
    };
  }, []);

  const isActive = showAds && isAdSenseSlotActive(slotId, config);

  // When active with valid credentials, inject the official script and trigger adsbygoogle
  useEffect(() => {
    if (isActive && config.publisherId) {
      injectAdSenseScript(config.publisherId);
      try {
        const w = window as unknown as { adsbygoogle?: Array<Record<string, unknown>> };
        w.adsbygoogle = w.adsbygoogle || [];
        w.adsbygoogle.push({});
      } catch {
        // Safe catch for adblockers or strict script policies
      }
    }
  }, [isActive, config.publisherId, slotId]);

  // If active with real IDs, render official responsive AdSense unit
  if (isActive && slotId) {
    return (
      <aside
        aria-label="Google AdSense Advertisement"
        className={`w-full max-w-5xl mx-auto my-6 px-4 clear-both select-none ${className}`}
      >
        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-[#A7B0C5] text-center mb-1.5">
          Advertisement
        </div>
        <div className="flex justify-center items-center overflow-hidden min-h-[90px] rounded-xl bg-slate-50/50 dark:bg-[#111827]/60 p-2 border border-slate-200/50 dark:border-[#232B45]">
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={config.publisherId}
            data-ad-slot={slotId}
            data-ad-format={slotType === 'rectangle' ? 'rectangle' : 'auto'}
            data-full-width-responsive="true"
          />
        </div>
      </aside>
    );
  }

  // Developer inspection mode (only shown when explicitly toggled on in AdSense configuration)
  if (config.devInspectionMode && showAds) {
    return (
      <aside
        aria-label="AdSense Placement Outline"
        className={`w-full max-w-5xl mx-auto my-4 px-4 select-none ${className}`}
      >
        <div className="rounded-xl border border-dashed border-indigo-300 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/20 p-3 text-center flex flex-col items-center justify-center min-h-[70px]">
          <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-indigo-700 dark:text-[#22D3EE] mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
            <span>Reserved AdSense Slot: {slotId || slotType}</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-[#A7B0C5]">
            Container disabled until approved publisher ID is supplied. Responsive dimensions ready.
          </p>
        </div>
      </aside>
    );
  }

  // Disabled state by default: completely non-rendered to protect user experience and avoid fake ads
  return null;
};
