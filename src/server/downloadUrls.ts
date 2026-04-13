import {
  type DirectDownloadTarget,
  type DownloadTarget,
  type MacDownloadVariant,
} from '@/config/downloadTargets';

const DIRECT_DOWNLOAD_URL_ENV_KEYS: Record<DirectDownloadTarget, string> = {
  windows: 'DOWNLOAD_WINDOWS_URL',
  linux: 'DOWNLOAD_LINUX_URL',
};

const MAC_DOWNLOAD_URL_ENV_KEYS: Record<MacDownloadVariant, string> = {
  'apple-silicon': 'DOWNLOAD_MAC_APPLE_SILICON_URL',
  intel: 'DOWNLOAD_MAC_INTEL_URL',
};

function readDownloadUrl(envKey: string): string | undefined {
  const value = process.env[envKey]?.trim();
  return value ? value : undefined;
}

export function detectDownloadTargetFromRequest(request: Request): DownloadTarget | undefined {
  const platformHint = request.headers.get('sec-ch-ua-platform')?.replace(/"/g, '');
  const detectionSource = [platformHint, request.headers.get('user-agent')]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (detectionSource.includes('win')) {
    return 'windows';
  }

  if (
    detectionSource.includes('mac') ||
    detectionSource.includes('iphone') ||
    detectionSource.includes('ipad') ||
    detectionSource.includes('ipod')
  ) {
    return 'mac';
  }

  if (
    detectionSource.includes('linux') ||
    detectionSource.includes('x11') ||
    detectionSource.includes('ubuntu')
  ) {
    return 'linux';
  }

  return undefined;
}

export function getFallbackDownloadUrl(): string | undefined {
  return readDownloadUrl('DOWNLOAD_FALLBACK_URL');
}

export function getDirectDownloadRedirectUrl(target: DirectDownloadTarget): string | undefined {
  const targetUrl = readDownloadUrl(DIRECT_DOWNLOAD_URL_ENV_KEYS[target]);
  if (targetUrl) {
    return targetUrl;
  }

  return getFallbackDownloadUrl();
}

export function getMacDownloadRedirectUrl(variant: MacDownloadVariant): string | undefined {
  const variantUrl = readDownloadUrl(MAC_DOWNLOAD_URL_ENV_KEYS[variant]);
  if (variantUrl) {
    return variantUrl;
  }

  return getFallbackDownloadUrl();
}

export function getDownloadEnvKeys(target?: DownloadTarget): readonly string[] {
  if (!target) {
    return ['DOWNLOAD_FALLBACK_URL'];
  }

  if (target === 'mac') {
    return [...Object.values(MAC_DOWNLOAD_URL_ENV_KEYS), 'DOWNLOAD_FALLBACK_URL'];
  }

  return [DIRECT_DOWNLOAD_URL_ENV_KEYS[target], 'DOWNLOAD_FALLBACK_URL'];
}

export function getMacDownloadEnvKeys(variant?: MacDownloadVariant): readonly string[] {
  if (!variant) {
    return [...Object.values(MAC_DOWNLOAD_URL_ENV_KEYS), 'DOWNLOAD_FALLBACK_URL'];
  }

  return [MAC_DOWNLOAD_URL_ENV_KEYS[variant], 'DOWNLOAD_FALLBACK_URL'];
}
