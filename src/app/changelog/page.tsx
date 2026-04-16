import { Navbar } from '@/components/Navbar/Navbar';
import { SocialLinks } from '@/components/SocialLinks/SocialLinks';
import { Taskbar } from '@/components/Taskbar/Taskbar';
import { getChangelogEntries } from '@/server/changelog';
import './ChangelogPage.css';

function formatDateLabel(value: string): string {
  const parsed = new Date(`${value}T12:00:00Z`);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed);
}

function formatShortDate(value: string): { month: string; day: string; year: string } {
  const parsed = new Date(`${value}T12:00:00Z`);
  const parts = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).formatToParts(parsed);

  return {
    month: parts.find((part) => part.type === 'month')?.value.toUpperCase() || '',
    day: parts.find((part) => part.type === 'day')?.value || '',
    year: parts.find((part) => part.type === 'year')?.value || '',
  };
}

function getCommitUrl(repo: string, sha: string): string {
  return `https://github.com/cypher-asi/${repo}/commit/${sha}`;
}

function formatTimelineTime(value: string, fallbackLabel: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return fallbackLabel;
  }

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(parsed);
}

export const metadata = {
  title: 'Changelog',
  description: 'Daily release notes and product updates for Aura.',
};

export default async function ChangelogPage(): Promise<React.ReactNode> {
  const entries = await getChangelogEntries();

  return (
    <>
      <Navbar />
      <main className="scrollPageMain">
        <section className="changelogPage">
          <div className="changelogPageContent">
            <header className="changelogHero">
              <span className="changelogHeroLabel">Changelog</span>
              <h1 className="changelogHeroHeadline">
                Daily product updates,
                <br />
                <span className="changelogHeroHeadlineMuted">shipped as a living timeline.</span>
              </h1>
              <p className="changelogHeroDescription">
                Every entry is generated from the day&apos;s release commits, diff context, and shipped artifacts so the
                notes stay closer to what actually changed.
              </p>
            </header>

            {entries.length > 0 ? (
              <div className="changelogTimeline" aria-label="Aura changelog timeline">
                {entries.map((entry) => {
                  const date = formatShortDate(entry.date);
                  return (
                    <article key={`${entry.date}-${entry.version ?? entry.generatedAt}`} className="changelogEntry">
                      <div className="changelogDateRail">
                        <div className="changelogDateBadge">
                          <span className="changelogDateMonth">{date.month}</span>
                          <span className="changelogDateDay">{date.day}</span>
                          <span className="changelogDateYear">{date.year}</span>
                        </div>
                      </div>
                      <div className="changelogCard">
                        <div className="changelogCardHeader">
                          <div className="changelogCardMeta">
                            <span className="changelogChannel">{entry.channel}</span>
                            {entry.version && <span className="changelogVersion">{entry.version}</span>}
                            <span className="changelogCommitCount">{entry.rawCommitCount} commits</span>
                          </div>
                          <div className="changelogCardSubmeta">
                            <span>{formatDateLabel(entry.date)}</span>
                            {entry.releaseUrl && (
                              <a href={entry.releaseUrl} target="_blank" rel="noopener noreferrer" className="changelogReleaseLink">
                                View release
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="changelogEntryTimeline">
                          {entry.rendered.entries.map((timelineEntry) => (
                            <section
                              key={`${entry.date}-${timelineEntry.started_at}-${timelineEntry.title}`}
                              className="changelogTimelineEntry"
                            >
                              <div className="changelogTimelineEntryRail">
                                <span className="changelogTimelineTime">
                                  {formatTimelineTime(timelineEntry.started_at, timelineEntry.time_label)}
                                </span>
                              </div>
                              <div className="changelogTimelineEntryCard">
                                <div className="changelogTimelineEntryHeader">
                                  <h2 className="changelogTimelineEntryTitle">{timelineEntry.title}</h2>
                                  <p className="changelogTimelineEntrySummary">{timelineEntry.summary}</p>
                                </div>
                                <ul className="changelogSectionList">
                                  {timelineEntry.items.map((item) => (
                                    <li key={`${timelineEntry.title}-${item.text}`} className="changelogSectionItem">
                                      <span>{item.text}</span>
                                      {item.commit_shas.length > 0 && (
                                        <span className="changelogSectionShas">
                                          {item.commit_shas.map((sha) => (
                                            <a
                                              key={sha}
                                              href={getCommitUrl(entry.repo, sha)}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="changelogCommitLink"
                                              aria-label={`View commit ${sha.slice(0, 7)} on GitHub`}
                                            >
                                              <code>{sha.slice(0, 7)}</code>
                                            </a>
                                          ))}
                                        </span>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </section>
                          ))}
                        </div>

                        {entry.rendered.highlights.length > 0 && (
                          <div className="changelogHighlights">
                            {entry.rendered.highlights.map((highlight) => (
                              <span key={highlight} className="changelogHighlightPill">
                                {highlight}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="changelogEmptyState">
                <h2>No changelog entries yet.</h2>
                <p>The release feed is connected, but no published changelog entries were found yet.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <SocialLinks />
      <Taskbar />
    </>
  );
}
