export type FeatureHealthStatus =
  | 'operational'
  | 'degraded'
  | 'partial_outage'
  | 'major_outage'
  | 'unknown'
  | 'maintenance';

export type StatusCheckState = 'pass' | 'warn' | 'fail' | 'skip' | 'unknown';

export interface StatusCheck {
  readonly id: string;
  readonly required: boolean;
  readonly status: StatusCheckState;
  readonly featureStatus: FeatureHealthStatus;
  readonly message: string;
  readonly checkedAt: string | null;
  readonly latencyMs: number | null;
  readonly evidence: Record<string, unknown>;
}

export interface StatusFeature {
  readonly id: string;
  readonly label: string;
  readonly category: string;
  readonly priority: number;
  readonly description: string;
  readonly publicSummary: string;
  readonly status: FeatureHealthStatus;
  readonly lastCheckedAt: string | null;
  readonly checksPassed: number;
  readonly checksTotal: number;
  readonly checksFailed: number;
  readonly checksUnknown: number;
  readonly latencyP95Ms: number | null;
  readonly message: string;
  readonly checks: readonly StatusCheck[];
}

export interface StatusSnapshot {
  readonly schemaVersion: 1;
  readonly title: string;
  readonly description: string;
  readonly generatedAt: string;
  readonly environment: string;
  readonly source: string;
  readonly overall: FeatureHealthStatus;
  readonly totals: {
    readonly features: number;
    readonly operational: number;
    readonly degraded: number;
    readonly partialOutage: number;
    readonly majorOutage: number;
    readonly unknown: number;
    readonly maintenance: number;
  };
  readonly features: readonly StatusFeature[];
}

export interface StatusFeedResult {
  readonly snapshot: StatusSnapshot;
  readonly configured: boolean;
  readonly error: string | null;
}

const FALLBACK_SNAPSHOT: StatusSnapshot = {
  schemaVersion: 1,
  title: 'Aura Feature Health',
  description: 'Public-facing feature health backed by Aura-owned live eval probes.',
  generatedAt: new Date(0).toISOString(),
  environment: 'unknown',
  source: 'not-configured',
  overall: 'unknown',
  totals: {
    features: 0,
    operational: 0,
    degraded: 0,
    partialOutage: 0,
    majorOutage: 0,
    unknown: 0,
    maintenance: 0,
  },
  features: [],
};

function statusJsonUrl(): string | null {
  const raw =
    process.env.AURA_STATUS_JSON_URL?.trim() ||
    process.env.NEXT_PUBLIC_AURA_STATUS_JSON_URL?.trim();
  if (!raw) return null;
  return raw;
}

function isStatusSnapshot(value: unknown): value is StatusSnapshot {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<StatusSnapshot>;
  return (
    candidate.schemaVersion === 1 &&
    typeof candidate.generatedAt === 'string' &&
    typeof candidate.overall === 'string' &&
    Array.isArray(candidate.features)
  );
}

export async function getStatusFeed(): Promise<StatusFeedResult> {
  const url = statusJsonUrl();
  if (!url) {
    return {
      snapshot: FALLBACK_SNAPSHOT,
      configured: false,
      error: 'AURA_STATUS_JSON_URL is not configured.',
    };
  }

  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      return {
        snapshot: FALLBACK_SNAPSHOT,
        configured: true,
        error: `Status feed returned HTTP ${response.status}.`,
      };
    }

    const json = (await response.json()) as unknown;
    if (!isStatusSnapshot(json)) {
      return {
        snapshot: FALLBACK_SNAPSHOT,
        configured: true,
        error: 'Status feed returned an invalid snapshot.',
      };
    }

    return {
      snapshot: json,
      configured: true,
      error: null,
    };
  } catch (error) {
    return {
      snapshot: FALLBACK_SNAPSHOT,
      configured: true,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
