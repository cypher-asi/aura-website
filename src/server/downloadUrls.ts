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

interface DownloadManifestTarget {
  readonly url?: string;
}

interface DownloadManifest {
  readonly release_url?: string;
  readonly desktop?: {
    readonly windows?: DownloadManifestTarget;
    readonly linux?: DownloadManifestTarget;
    readonly mac?: Record<MacDownloadVariant, DownloadManifestTarget | undefined>;
  };
}

function readDownloadUrl(envKey: string): string | undefined {
  const value = process.env[envKey]?.trim();
  return value ? value : undefined;
}

function getDownloadManifestUrl(): string | undefined {
  return readDownloadUrl('DOWNLOAD_MANIFEST_URL');
}

async function fetchDownloadManifest(): Promise<DownloadManifest | undefined> {
  const manifestUrl = getDownloadManifestUrl();
  if (!manifestUrl) {
    return undefined;
  }

  try {
    const response = await fetch(manifestUrl, {
      next: { revalidate: 300 },
    });
    if (!response.ok) {
      return undefined;
    }

    return (await response.json()) as DownloadManifest;
  } catch {
    return undefined;
  }
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

export async function getFallbackDownloadUrlResolved(): Promise<string | undefined> {
  const manifest = await fetchDownloadManifest();
  return manifest?.release_url || getFallbackDownloadUrl();
}

export async function getDirectDownloadRedirectUrl(target: DirectDownloadTarget): Promise<string | undefined> {
  const manifest = await fetchDownloadManifest();
  const manifestUrl = manifest?.desktop?.[target]?.url;
  if (manifestUrl) {
    return manifestUrl;
  }

  const targetUrl = readDownloadUrl(DIRECT_DOWNLOAD_URL_ENV_KEYS[target]);
  if (targetUrl) {
    return targetUrl;
  }

  return manifest?.release_url || getFallbackDownloadUrl();
}

export async function getMacDownloadRedirectUrl(variant: MacDownloadVariant): Promise<string | undefined> {
  const manifest = await fetchDownloadManifest();
  const manifestUrl = manifest?.desktop?.mac?.[variant]?.url;
  if (manifestUrl) {
    return manifestUrl;
  }

  const variantUrl = readDownloadUrl(MAC_DOWNLOAD_URL_ENV_KEYS[variant]);
  if (variantUrl) {
    return variantUrl;
  }

  return manifest?.release_url || getFallbackDownloadUrl();
}

export function getDownloadEnvKeys(target?: DownloadTarget): readonly string[] {
  const manifestKey = 'DOWNLOAD_MANIFEST_URL';
  if (!target) {
    return [manifestKey, 'DOWNLOAD_FALLBACK_URL'];
  }

  if (target === 'mac') {
    return [manifestKey, ...Object.values(MAC_DOWNLOAD_URL_ENV_KEYS), 'DOWNLOAD_FALLBACK_URL'];
  }

  return [manifestKey, DIRECT_DOWNLOAD_URL_ENV_KEYS[target], 'DOWNLOAD_FALLBACK_URL'];
}

export function getMacDownloadEnvKeys(variant?: MacDownloadVariant): readonly string[] {
  const manifestKey = 'DOWNLOAD_MANIFEST_URL';
  if (!variant) {
    return [manifestKey, ...Object.values(MAC_DOWNLOAD_URL_ENV_KEYS), 'DOWNLOAD_FALLBACK_URL'];
  }

  return [manifestKey, MAC_DOWNLOAD_URL_ENV_KEYS[variant], 'DOWNLOAD_FALLBACK_URL'];
}
