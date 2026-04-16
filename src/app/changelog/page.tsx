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
          <div className="changelogPageShell">
            {entries.length > 0 ? (
              <div className="changelogPageContent">
                <div className="changelogEntries" aria-label="Aura changelog entries">
                  {entries.map((entry) => (
                    <article key={`${entry.date}-${entry.version ?? entry.generatedAt}`} className="changelogEntry">
                      <div className="changelogEntryDateColumn">
                        <p className="changelogEntryDate">{formatDateLabel(entry.date)}</p>
                      </div>

                      <div className="changelogEntryBody">
                        <header className="changelogEntryHeader">
                          <h2 className="changelogEntryTitle">{entry.rendered.title}</h2>
                          <p className="changelogEntryIntro">{entry.rendered.intro}</p>
                          <div className="changelogEntryMeta">
                            <span className="changelogMetaItem">{entry.channel}</span>
                            {entry.version && <span className="changelogMetaItem">{entry.version}</span>}
                            <span className="changelogMetaItem">{entry.filteredCommitCount ?? entry.rawCommitCount} commits</span>
                            {entry.releaseUrl && (
                              <a href={entry.releaseUrl} target="_blank" rel="noopener noreferrer" className="changelogReleaseLink">
                                View release
                              </a>
                            )}
                          </div>
                        </header>

                        <div className="changelogSections">
                          {entry.rendered.entries.map((timelineEntry) => (
                            <section key={`${entry.date}-${timelineEntry.started_at}-${timelineEntry.title}`} className="changelogSection">
                              <div className="changelogSectionHeader">
                                <span className="changelogSectionTime">
                                  {formatTimelineTime(timelineEntry.started_at, timelineEntry.time_label)}
                                </span>
                                <h3 className="changelogSectionTitle">{timelineEntry.title}</h3>
                              </div>
                              <p className="changelogSectionSummary">{timelineEntry.summary}</p>
                              {timelineEntry.items.length > 0 ? (
                                <ul className="changelogSectionList">
                                  {timelineEntry.items.map((item) => (
                                    <li key={`${timelineEntry.title}-${item.text}`} className="changelogSectionItem">
                                      <span>
                                        {item.text}
                                        {item.commit_shas.length > 0 && ' '}
                                        {item.commit_shas.map((sha, index) => (
                                          <span key={sha}>
                                            {index === 0 ? '(' : ', '}
                                            <a
                                              href={getCommitUrl(entry.repo, sha)}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="changelogSectionCommitLink"
                                            >
                                              {sha.slice(0, 7)}
                                            </a>
                                            {index === item.commit_shas.length - 1 ? ')' : ''}
                                          </span>
                                        ))}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="changelogSectionSummary">{timelineEntry.summary}</p>
                              )}
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
                  ))}
                </div>
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
