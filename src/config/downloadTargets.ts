export const DOWNLOAD_TARGETS = ['windows', 'mac', 'linux'] as const;
export const DIRECT_DOWNLOAD_TARGETS = ['windows', 'linux'] as const;
export const MAC_DOWNLOAD_VARIANTS = ['apple-silicon', 'intel'] as const;

export type DownloadTarget = (typeof DOWNLOAD_TARGETS)[number];
export type DirectDownloadTarget = (typeof DIRECT_DOWNLOAD_TARGETS)[number];
export type MacDownloadVariant = (typeof MAC_DOWNLOAD_VARIANTS)[number];

const DOWNLOAD_TARGET_SET = new Set<string>(DOWNLOAD_TARGETS);
const MAC_DOWNLOAD_VARIANT_SET = new Set<string>(MAC_DOWNLOAD_VARIANTS);

export function normalizeDownloadTarget(target: string | null | undefined): DownloadTarget | undefined {
  if (!target) {
    return undefined;
  }

  const normalizedTarget = target.toLowerCase();
  return DOWNLOAD_TARGET_SET.has(normalizedTarget) ? (normalizedTarget as DownloadTarget) : undefined;
}

export function getDownloadPath(target?: DownloadTarget | 'unknown'): string {
  const normalizedTarget = normalizeDownloadTarget(target);
  return normalizedTarget ? `/download/${normalizedTarget}` : '/download';
}

export function normalizeMacDownloadVariant(variant: string | null | undefined): MacDownloadVariant | undefined {
  if (!variant) {
    return undefined;
  }

  const normalizedVariant = variant.toLowerCase();
  return MAC_DOWNLOAD_VARIANT_SET.has(normalizedVariant)
    ? (normalizedVariant as MacDownloadVariant)
    : undefined;
}

export function getMacDownloadPath(variant?: MacDownloadVariant): string {
  return variant ? `/download/mac/${variant}` : '/download/mac';
}
