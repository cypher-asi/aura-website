interface ChangelogIndexEntry {
  readonly date: string;
  readonly channel: string;
  readonly version: string | null;
  readonly title: string;
  readonly intro: string;
  readonly entryCount?: number;
  readonly highlights: readonly string[];
  readonly rawCommitCount: number;
  readonly generatedAt: string;
  readonly releaseUrl: string | null;
  readonly path: string;
}

interface ChangelogSectionItem {
  readonly text: string;
  readonly commit_shas: readonly string[];
  readonly confidence: 'high' | 'medium';
}

interface ChangelogSection {
  readonly title: string;
  readonly items: readonly ChangelogSectionItem[];
}

interface ChangelogTimelineItem {
  readonly text: string;
  readonly commit_shas: readonly string[];
  readonly confidence: 'high' | 'medium';
}

interface ChangelogTimelineEntry {
  readonly time_label: string;
  readonly started_at: string;
  readonly ended_at: string;
  readonly title: string;
  readonly summary: string;
  readonly items: readonly ChangelogTimelineItem[];
}

interface ChangelogRendered {
  readonly title: string;
  readonly intro: string;
  readonly highlights: readonly string[];
  readonly sections?: readonly ChangelogSection[];
  readonly entries?: readonly ChangelogTimelineEntry[];
  readonly raw_commit_count?: number;
}

interface ChangelogSourceEntry {
  readonly repo: string;
  readonly date: string;
  readonly channel: string;
  readonly version: string | null;
  readonly generatedAt: string;
  readonly releaseUrl: string | null;
  readonly rawCommitCount: number;
  readonly rendered: ChangelogRendered;
}

export interface ChangelogEntry {
  readonly repo: string;
  readonly date: string;
  readonly channel: string;
  readonly version: string | null;
  readonly generatedAt: string;
  readonly releaseUrl: string | null;
  readonly rawCommitCount: number;
  readonly filteredCommitCount: number | null;
  readonly rendered: {
    readonly title: string;
    readonly intro: string;
    readonly highlights: readonly string[];
    readonly entries: readonly ChangelogTimelineEntry[];
  };
}

const DEFAULT_CHANGELOG_INDEX_URL = 'https://cypher-asi.github.io/aura-os/changelog/nightly/index.json';

function readUrl(envKey: string): string | undefined {
  const value = process.env[envKey]?.trim();
  return value ? value : undefined;
}

function getChangelogIndexUrl(): string {
  return readUrl('CHANGELOG_INDEX_URL') || DEFAULT_CHANGELOG_INDEX_URL;
}

async function fetchJson<T>(url: string): Promise<T | undefined> {
  try {
    const response = await fetch(url, {
      next: { revalidate: 300 },
    });
    if (!response.ok) {
      return undefined;
    }
    return (await response.json()) as T;
  } catch {
    return undefined;
  }
}

function toEntryUrl(indexUrl: string, entryPath: string): string {
  return new URL(entryPath, indexUrl).toString();
}

function normalizeEntry(
  entry: ChangelogSourceEntry,
  fallbackFilteredCommitCount?: number,
): ChangelogEntry {
  const timelineEntries = (Array.isArray(entry.rendered.entries) && entry.rendered.entries.length > 0
    ? entry.rendered.entries
    : (entry.rendered.sections || []).map((section, index) => ({
        time_label: index === 0 ? 'All day' : `Update ${index + 1}`,
        started_at: entry.generatedAt,
        ended_at: entry.generatedAt,
        title: section.title,
        summary: section.items[0]?.text || entry.rendered.intro,
        items: section.items,
      })))
    .map((timelineEntry, index) => ({ timelineEntry, index }))
    .sort((left, right) => {
      const leftTime = new Date(left.timelineEntry.started_at).getTime();
      const rightTime = new Date(right.timelineEntry.started_at).getTime();

      if (Number.isNaN(leftTime) || Number.isNaN(rightTime) || leftTime === rightTime) {
        return left.index - right.index;
      }

      return rightTime - leftTime;
    })
    .map(({ timelineEntry }) => timelineEntry);

  return {
    ...entry,
    filteredCommitCount: entry.rendered.raw_commit_count ?? fallbackFilteredCommitCount ?? null,
    rendered: {
      title: entry.rendered.title,
      intro: entry.rendered.intro,
      highlights: entry.rendered.highlights,
      entries: timelineEntries,
    },
  };
}

function shiftIsoDate(iso: string, daysBack: number): string {
  const parsed = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return iso;
  parsed.setUTCDate(parsed.getUTCDate() - daysBack);
  return parsed.toISOString().slice(0, 10);
}

function shiftTimestamp(iso: string, daysBack: number): string {
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return iso;
  parsed.setUTCDate(parsed.getUTCDate() - daysBack);
  return parsed.toISOString();
}

function buildDevMockEntries(seed: ChangelogEntry): readonly ChangelogEntry[] {
  const copies: ChangelogEntry[] = [seed];
  for (let i = 1; i <= 5; i += 1) {
    copies.push({
      ...seed,
      date: shiftIsoDate(seed.date, i),
      generatedAt: shiftTimestamp(seed.generatedAt, i),
      rendered: {
        ...seed.rendered,
        entries: seed.rendered.entries.map((entry) => ({
          ...entry,
          started_at: shiftTimestamp(entry.started_at, i),
          ended_at: shiftTimestamp(entry.ended_at, i),
        })),
      },
    });
  }
  return copies;
}

export async function getChangelogEntries(): Promise<readonly ChangelogEntry[]> {
  const indexUrl = getChangelogIndexUrl();
  const index = await fetchJson<readonly ChangelogIndexEntry[]>(indexUrl);

  if (!index?.length) {
    return [];
  }

  const resolved = await Promise.all(
    index.map(async (item) => {
      const url = toEntryUrl(indexUrl, item.path);
      const entry = await fetchJson<ChangelogSourceEntry>(url);
      return entry ? { entry, indexItem: item } : undefined;
    }),
  );

  const entries = resolved
    .filter((result): result is { entry: ChangelogSourceEntry; indexItem: ChangelogIndexEntry } => Boolean(result))
    .map(({ entry, indexItem }) => normalizeEntry(entry, indexItem.entryCount))
    .sort((left, right) => {
      const dateDiff = new Date(right.date).getTime() - new Date(left.date).getTime();
      if (dateDiff !== 0) {
        return dateDiff;
      }

      return new Date(right.generatedAt).getTime() - new Date(left.generatedAt).getTime();
    });

  if (process.env.NODE_ENV !== 'production' && entries.length > 0 && entries.length < 3) {
    return buildDevMockEntries(entries[0]);
  }

  return entries;
}
