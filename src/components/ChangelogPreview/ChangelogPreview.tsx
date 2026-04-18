import { AppLink } from '@/components/AppLink/AppLink';
import { getChangelogEntries, type ChangelogEntry } from '@/server/changelog';
import './ChangelogPreview.css';

type ChangelogPreviewProps = {
  readonly heading?: string;
  readonly limit?: number;
  readonly ctaLabel?: string;
  readonly ctaHref?: string;
};

function formatCardDate(value: string): string {
  const parsed = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed);
}

function getCardTitle(entry: ChangelogEntry): string {
  if (entry.rendered.title && entry.rendered.title.trim().length > 0) {
    return entry.rendered.title;
  }
  const firstTimeline = entry.rendered.entries[0];
  return firstTimeline?.title ?? 'Release update';
}

export async function ChangelogPreview({
  heading = 'Changelog',
  limit = 4,
  ctaLabel = "See what's new in AURA",
  ctaHref = '/changelog',
}: ChangelogPreviewProps = {}): Promise<React.ReactNode> {
  const entries = await getChangelogEntries();
  const visibleEntries = entries.slice(0, limit);

  if (visibleEntries.length === 0) {
    return null;
  }

  return (
    <section className="changelogPreview" aria-label="Recent changelog entries">
      <div className="changelogPreviewShell">
        <h2 className="changelogPreviewHeading">{heading}</h2>
        <div className="changelogPreviewGrid">
          {visibleEntries.map((entry) => {
            const entryKey = `${entry.date}-${entry.version ?? entry.generatedAt}`;
            const title = getCardTitle(entry);
            return (
              <AppLink
                key={entryKey}
                href={ctaHref}
                className="changelogPreviewCard"
              >
                <div className="changelogPreviewCardHead">
                  {entry.version ? (
                    <span className="changelogPreviewVersion">{entry.version}</span>
                  ) : null}
                  <time className="changelogPreviewDate" dateTime={entry.date}>
                    {formatCardDate(entry.date)}
                  </time>
                </div>
                <p className="changelogPreviewTitle">{title}</p>
              </AppLink>
            );
          })}
        </div>
        <AppLink href={ctaHref} className="changelogPreviewCta">
          {ctaLabel} <span aria-hidden="true">&rarr;</span>
        </AppLink>
      </div>
    </section>
  );
}
