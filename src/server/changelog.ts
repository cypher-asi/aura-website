interface ChangelogIndexEntry {
  readonly date: string;
  readonly channel: string;
  readonly version: string | null;
  readonly title: string;
  readonly intro: string;
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

interface ChangelogRendered {
  readonly title: string;
  readonly intro: string;
  readonly highlights: readonly string[];
  readonly sections: readonly ChangelogSection[];
}

export interface ChangelogEntry {
  readonly repo: string;
  readonly date: string;
  readonly channel: string;
  readonly version: string | null;
  readonly generatedAt: string;
  readonly releaseUrl: string | null;
  readonly rawCommitCount: number;
  readonly rendered: ChangelogRendered;
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

export async function getChangelogEntries(): Promise<readonly ChangelogEntry[]> {
  const indexUrl = getChangelogIndexUrl();
  const index = await fetchJson<readonly ChangelogIndexEntry[]>(indexUrl);

  if (!index?.length) {
    return [];
  }

  const resolved = await Promise.all(
    index.map(async (item) => {
      const url = toEntryUrl(indexUrl, item.path);
      return fetchJson<ChangelogEntry>(url);
    }),
  );

  return resolved.filter((entry): entry is ChangelogEntry => Boolean(entry));
}
