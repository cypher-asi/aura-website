export type FathomEvent =
  | 'download_mac_apple_silicon'
  | 'download_mac_intel'
  | 'download_windows'
  | 'download_linux'
  | 'download_auto_redirect_mac'
  | 'download_auto_redirect_windows'
  | 'download_auto_redirect_linux'
  | 'pricing_cta_mortal'
  | 'pricing_cta_pro'
  | 'pricing_cta_crusader'
  | 'pricing_cta_sage'
  | 'roadmap_upvote'
  | 'roadmap_comment_submitted'
  | 'changelog_entry_open';

interface FathomGlobal {
  readonly trackEvent?: (name: string, options?: { _value?: number }) => void;
}

function getFathom(): FathomGlobal | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }
  return (window as unknown as { fathom?: FathomGlobal }).fathom;
}

export function trackEvent(name: FathomEvent, value?: number): void {
  const fathom = getFathom();
  if (!fathom?.trackEvent) {
    return;
  }
  const options = value !== undefined ? { _value: value } : undefined;
  try {
    fathom.trackEvent(name, options);
  } catch {
    // Analytics must never throw to the user.
  }
}
