// Thin HTTP client against aura-network's public feedback endpoint. The
// browser never talks to this module — it's invoked from the /roadmap
// React Server Component at request time. We do the fetch here (instead of
// querying Postgres directly as we used to) so this marketing site no
// longer needs database credentials.

export type FeedbackSort =
  | 'latest'
  | 'popular'
  | 'trending'
  | 'most_voted'
  | 'least_voted';

export type FeedbackCategory =
  | 'feature_request'
  | 'bug'
  | 'ui_ux'
  | 'feedback'
  | 'question';

export type FeedbackStatus =
  | 'not_started'
  | 'in_review'
  | 'in_progress'
  | 'done'
  | 'deployed';

export interface FeedbackEntry {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly category: FeedbackCategory;
  readonly status: FeedbackStatus;
  readonly upvotes: number;
  readonly downvotes: number;
  readonly voteScore: number;
  readonly commentCount: number;
  readonly createdAt: string;
  readonly authorName: string | null;
  readonly authorAvatar: string | null;
}

export interface ListFeedbackParams {
  readonly sort?: FeedbackSort;
  readonly category?: FeedbackCategory | null;
  readonly status?: FeedbackStatus | null;
  readonly limit?: number;
}

const VALID_SORTS: readonly FeedbackSort[] = [
  'latest',
  'popular',
  'trending',
  'most_voted',
  'least_voted',
];

const VALID_CATEGORIES: readonly FeedbackCategory[] = [
  'feature_request',
  'bug',
  'ui_ux',
  'feedback',
  'question',
];

const VALID_STATUSES: readonly FeedbackStatus[] = [
  'not_started',
  'in_review',
  'in_progress',
  'done',
  'deployed',
];

export function normalizeSort(value: string | undefined | null): FeedbackSort {
  return VALID_SORTS.includes(value as FeedbackSort)
    ? (value as FeedbackSort)
    : 'latest';
}

export function normalizeCategory(
  value: string | undefined | null,
): FeedbackCategory | null {
  return VALID_CATEGORIES.includes(value as FeedbackCategory)
    ? (value as FeedbackCategory)
    : null;
}

export function normalizeStatus(
  value: string | undefined | null,
): FeedbackStatus | null {
  return VALID_STATUSES.includes(value as FeedbackStatus)
    ? (value as FeedbackStatus)
    : null;
}

function networkBaseUrl(): string | null {
  const raw = process.env.AURA_NETWORK_URL?.trim();
  if (!raw) return null;
  // Strip a single trailing slash so URL construction is predictable
  // whether operators set "https://network.aura.ai" or the same with a "/".
  return raw.replace(/\/+$/, '');
}

// Matches the response shape of GET /api/public/feedback on aura-network.
// Kept narrow on purpose — anything that isn't part of `FeedbackEntry` is
// dropped on the floor. If the server ever adds optional fields we want in
// the UI, extend both sides explicitly.
interface PublicFeedbackEntryResponse {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly category: string;
  readonly status: string;
  readonly upvotes: number;
  readonly downvotes: number;
  readonly voteScore: number;
  readonly commentCount: number;
  readonly createdAt: string;
  readonly authorName: string | null;
  readonly authorAvatar: string | null;
}

function coerceEntry(raw: PublicFeedbackEntryResponse): FeedbackEntry {
  return {
    id: raw.id,
    title: raw.title,
    body: raw.body ?? '',
    // The server already normalizes missing metadata to 'feedback' and
    // 'not_started', but we keep the narrow union on the client so unknown
    // values surface as plain strings and still render (the label maps in
    // feedback-constants.ts gracefully fall back).
    category: (raw.category as FeedbackCategory) ?? 'feedback',
    status: (raw.status as FeedbackStatus) ?? 'not_started',
    upvotes: Number(raw.upvotes) || 0,
    downvotes: Number(raw.downvotes) || 0,
    voteScore: Number(raw.voteScore) || 0,
    commentCount: Number(raw.commentCount) || 0,
    createdAt: raw.createdAt,
    authorName: raw.authorName,
    authorAvatar: raw.authorAvatar,
  };
}

export async function listFeedback(
  params: ListFeedbackParams = {},
): Promise<readonly FeedbackEntry[]> {
  const base = networkBaseUrl();
  if (!base) return [];

  const sort = normalizeSort(params.sort ?? null);
  const category = normalizeCategory(params.category ?? null);
  const status = normalizeStatus(params.status ?? null);
  const limit = Math.max(1, Math.min(params.limit ?? 100, 200));

  const search = new URLSearchParams();
  search.set('sort', sort);
  search.set('limit', String(limit));
  if (category) search.set('category', category);
  if (status) search.set('status', status);

  const url = `${base}/api/public/feedback?${search.toString()}`;

  try {
    // Next.js caches fetches server-side; opting out keeps /roadmap fresh.
    // `force-dynamic` on the page covers the top-level render, but this
    // double-belt guards against accidental caching via the fetch layer.
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      console.error(
        `[feedback] GET ${url} failed: ${res.status} ${res.statusText}`,
      );
      return [];
    }
    const json = (await res.json()) as PublicFeedbackEntryResponse[];
    if (!Array.isArray(json)) {
      console.error('[feedback] expected array response, got:', typeof json);
      return [];
    }
    return json.map(coerceEntry);
  } catch (err) {
    console.error('[feedback] listFeedback failed', err);
    return [];
  }
}

export function hasNetworkUrl(): boolean {
  return networkBaseUrl() !== null;
}
