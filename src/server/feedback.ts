import { Pool, type QueryResultRow } from 'pg';

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

// Singleton pool keyed off globalThis so Next.js dev hot-reloads don't leak
// connections.
type GlobalWithPool = typeof globalThis & {
  __auraFeedbackPgPool?: Pool;
};

function getPool(): Pool | null {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    return null;
  }

  const g = globalThis as GlobalWithPool;
  if (g.__auraFeedbackPgPool) {
    return g.__auraFeedbackPgPool;
  }

  const pool = new Pool({
    connectionString: url,
    max: 4,
    idleTimeoutMillis: 30_000,
    // Render/Heroku style managed Postgres almost always needs SSL. Local
    // dev doesn't, but enabling a relaxed SSL mode on connection strings
    // that request it is safe.
    ssl: /sslmode=require/i.test(url) ? { rejectUnauthorized: false } : undefined,
  });

  pool.on('error', (err) => {
    // eslint-disable-next-line no-console
    console.error('[feedback] pg pool error', err);
  });

  g.__auraFeedbackPgPool = pool;
  return pool;
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

function orderBySql(sort: FeedbackSort): string {
  switch (sort) {
    case 'most_voted':
      return 'vote_score DESC, ae.created_at DESC';
    case 'least_voted':
      return 'vote_score ASC, ae.created_at DESC';
    case 'popular':
      return '(COALESCE(v.upvotes,0) - COALESCE(v.downvotes,0) + COALESCE(cc.comment_count,0)) DESC, ae.created_at DESC';
    case 'trending':
      return '((COALESCE(v.upvotes,0) - COALESCE(v.downvotes,0) + COALESCE(cc.comment_count,0))::float8 / POW(EXTRACT(EPOCH FROM (NOW() - ae.created_at))/3600 + 2, 1.5)) DESC, ae.created_at DESC';
    case 'latest':
    default:
      return 'ae.created_at DESC';
  }
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function stripUuidDisplayName(name: string | null | undefined): string | null {
  if (!name) return null;
  return UUID_RE.test(name) ? null : name;
}

interface FeedbackRow extends QueryResultRow {
  id: string;
  title: string;
  summary: string | null;
  metadata: Record<string, unknown> | null;
  created_at: Date | string;
  upvotes: string | number | null;
  downvotes: string | number | null;
  vote_score: string | number | null;
  comment_count: string | number | null;
  author_name: string | null;
  author_avatar: string | null;
}

function toNumber(value: string | number | null | undefined): number {
  if (value == null) return 0;
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

function metadataString(
  metadata: Record<string, unknown> | null,
  key: string,
): string | undefined {
  if (!metadata) return undefined;
  const v = metadata[key];
  return typeof v === 'string' ? v : undefined;
}

function rowToEntry(row: FeedbackRow): FeedbackEntry {
  const metadata = row.metadata ?? null;
  const category =
    metadataString(metadata, 'feedbackCategory') ??
    metadataString(metadata, 'feedback_category') ??
    'feedback';
  const status =
    metadataString(metadata, 'feedbackStatus') ??
    metadataString(metadata, 'feedback_status') ??
    'not_started';
  const body =
    metadataString(metadata, 'body') ?? row.summary ?? '';

  const createdAt =
    row.created_at instanceof Date
      ? row.created_at.toISOString()
      : String(row.created_at);

  return {
    id: row.id,
    title: row.title,
    body,
    category: category as FeedbackCategory,
    status: status as FeedbackStatus,
    upvotes: toNumber(row.upvotes),
    downvotes: toNumber(row.downvotes),
    voteScore: toNumber(row.vote_score),
    commentCount: toNumber(row.comment_count),
    createdAt,
    authorName: stripUuidDisplayName(row.author_name),
    authorAvatar: row.author_avatar ?? null,
  };
}

export async function listFeedback(
  params: ListFeedbackParams = {},
): Promise<readonly FeedbackEntry[]> {
  const pool = getPool();
  if (!pool) return [];

  const sort = normalizeSort(params.sort ?? null);
  const category = normalizeCategory(params.category ?? null);
  const status = normalizeStatus(params.status ?? null);
  const limit = Math.max(1, Math.min(params.limit ?? 100, 200));

  const sql = `
    SELECT
      ae.id,
      ae.title,
      ae.summary,
      ae.metadata,
      ae.created_at,
      COALESCE(v.upvotes, 0)   AS upvotes,
      COALESCE(v.downvotes, 0) AS downvotes,
      COALESCE(v.upvotes, 0) - COALESCE(v.downvotes, 0) AS vote_score,
      COALESCE(cc.comment_count, 0) AS comment_count,
      p.display_name AS author_name,
      p.avatar       AS author_avatar
    FROM activity_events ae
    LEFT JOIN profiles p ON p.id = ae.profile_id
    LEFT JOIN LATERAL (
      SELECT
        SUM(CASE WHEN vote =  1 THEN 1 ELSE 0 END)::BIGINT AS upvotes,
        SUM(CASE WHEN vote = -1 THEN 1 ELSE 0 END)::BIGINT AS downvotes
      FROM feedback_votes fv
      WHERE fv.activity_event_id = ae.id
    ) v ON TRUE
    LEFT JOIN LATERAL (
      SELECT COUNT(1)::BIGINT AS comment_count
      FROM comments c
      WHERE c.activity_event_id = ae.id
    ) cc ON TRUE
    WHERE ae.event_type = 'feedback'
      AND COALESCE(ae.metadata->>'feedbackProduct', 'aura') = 'aura'
      AND ($1::text IS NULL OR ae.metadata->>'feedbackCategory' = $1)
      AND ($2::text IS NULL OR ae.metadata->>'feedbackStatus'   = $2)
    ORDER BY ${orderBySql(sort)}
    LIMIT $3
  `;

  try {
    const { rows } = await pool.query<FeedbackRow>(sql, [
      category,
      status,
      limit,
    ]);
    return rows.map(rowToEntry);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[feedback] listFeedback failed', err);
    return [];
  }
}

export function hasDatabaseUrl(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}
