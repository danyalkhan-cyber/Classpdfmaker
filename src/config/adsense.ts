/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Google AdSense Configuration for ClassPDF Maker.
 * 
 * IMPORTANT: In accordance with Google AdSense Policies:
 * - Ad placements remain strictly DISABLED until a valid publisher ID ('ca-pub-XXXXXXXXXXXXXXXX')
 *   and corresponding ad-unit slot IDs are configured after official Google AdSense approval.
 * - No fake advertisements, mock ad creative, or invented publisher IDs are served.
 * - Ad containers are clearly isolated from file upload, conversion, and download controls.
 */

export interface AdSenseConfig {
  /**
   * Your approved Google AdSense publisher ID (e.g. 'ca-pub-1234567890123456').
   * Leave blank until your account and domain have been approved by Google.
   */
  publisherId: string;

  /**
   * Master toggle for advertising units.
   * Default: false (disabled until explicitly activated).
   */
  enabled: boolean;

  /**
   * Responsive Ad Unit Slot IDs created in your Google AdSense console.
   */
  slots: {
    /** Placement below the main introduction header on the home view */
    heroBelowIntro: string;
    /** Placement near the bottom of the home view before the footer */
    pageBottom: string;
    /** Placement in the converter workspace sidebar */
    workspaceSidebar: string;
  };

  /**
   * Developer preview mode to visually outline responsive containers for testing.
   * Does NOT load Google AdSense script or serve live ads.
   */
  devInspectionMode?: boolean;
}

/**
 * Default AdSense settings.
 * publisherId is intentionally empty: AdSense units are inactive out of the box.
 */
export const DEFAULT_ADSENSE_CONFIG: AdSenseConfig = {
  publisherId: '',
  enabled: false,
  slots: {
    heroBelowIntro: '',
    pageBottom: '',
    workspaceSidebar: '',
  },
  devInspectionMode: false,
};

const STORAGE_KEY = 'classpdf_adsense_config';

/**
 * Validates Google AdSense Publisher ID format (e.g. 'ca-pub-1234567890123456').
 */
export function isPublisherIdValid(publisherId?: string): boolean {
  if (!publisherId) return false;
  const trimmed = publisherId.trim();
  // Valid AdSense publisher format: starts with ca-pub- followed by 16 digits (or 10-20 digits in rare legacy accounts)
  return /^ca-pub-\d{10,20}$/.test(trimmed);
}

/**
 * Validates Google AdSense Slot ID format (numeric string, typically 10 digits).
 */
export function isSlotIdValid(slotId?: string): boolean {
  if (!slotId) return false;
  const trimmed = slotId.trim();
  return /^\d{5,20}$/.test(trimmed);
}

/**
 * Retrieves the active AdSense configuration, checking local storage override first,
 * then falling back to DEFAULT_ADSENSE_CONFIG.
 */
export function getAdSenseConfig(): AdSenseConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...DEFAULT_ADSENSE_CONFIG,
        ...parsed,
        slots: {
          ...DEFAULT_ADSENSE_CONFIG.slots,
          ...(parsed.slots || {}),
        },
      };
    }
  } catch {
    // Local storage unavailable or corrupt
  }
  return DEFAULT_ADSENSE_CONFIG;
}

/**
 * Saves updated AdSense configuration to local storage.
 */
export function saveAdSenseConfig(config: AdSenseConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    // Dispatch custom event to notify mounted AdPlacement components
    window.dispatchEvent(new CustomEvent('classpdf:adsense_config_change', { detail: config }));
  } catch {
    // Local storage unavailable
  }
}

/**
 * Checks whether AdSense is ready to render live ad tags for a given slot.
 * Both the master toggle must be on, a valid publisher ID configured, and a valid slot ID provided.
 */
export function isAdSenseSlotActive(slotId?: string, config: AdSenseConfig = getAdSenseConfig()): boolean {
  if (!config.enabled) return false;
  if (!isPublisherIdValid(config.publisherId)) return false;
  if (!slotId || !isSlotIdValid(slotId)) return false;
  return true;
}

/**
 * Dynamically injects the official Google AdSense script tag into the <head>
 * once a valid publisher ID is provided.
 * Does nothing if publisher ID is missing or invalid.
 */
export function injectAdSenseScript(publisherId: string): void {
  if (!isPublisherIdValid(publisherId)) return;
  if (typeof document === 'undefined') return;

  const scriptId = 'google-adsense-script';
  if (document.getElementById(scriptId)) return;

  const script = document.createElement('script');
  script.id = scriptId;
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(publisherId.trim())}`;
  document.head.appendChild(script);
}
