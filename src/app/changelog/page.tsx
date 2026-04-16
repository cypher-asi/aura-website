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
                        <header className="changelogEntryMetaRow">
                          <div className="changelogEntryMeta">
                            <span className="changelogMetaItem">{entry.channel}</span>
                            <span className="changelogMetaItem">
                              {entry.rendered.entries.length} update{entry.rendered.entries.length === 1 ? '' : 's'}
                            </span>
                            <span className="changelogMetaItem">{entry.filteredCommitCount ?? entry.rawCommitCount} commits</span>
                          </div>
                        </header>

                        <div className="changelogSections">
                          {entry.rendered.entries.map((timelineEntry) => (
                            <section key={`${entry.date}-${timelineEntry.started_at}-${timelineEntry.title}`} className="changelogSection">
                              <span className="changelogSectionTime">
                                {formatTimelineTime(timelineEntry.started_at, timelineEntry.time_label)}
                              </span>
                              <div className="changelogSectionContent">
                                <div className="changelogSectionHeader">
                                  <h3 className="changelogSectionTitle">{timelineEntry.title}</h3>
                                </div>
                                <p className="changelogSectionSummary">{timelineEntry.summary}</p>
                                {timelineEntry.items.length > 0 ? (
                                  <ul className="changelogSectionList">
                                    {timelineEntry.items.map((item) => (
                                      <li key={`${timelineEntry.title}-${item.text}`} className="changelogSectionItem">
                                        <p className="changelogSectionItemText">{item.text}</p>
                                        {item.commit_shas.length > 0 && (
                                          <div className="changelogSectionSources">
                                            <span className="changelogSectionSourcesLabel">Sources</span>
                                            <span className="changelogSectionSourcesLinks">
                                              {item.commit_shas.map((sha) => (
                                                <a
                                                  key={sha}
                                                  href={getCommitUrl(entry.repo, sha)}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="changelogSectionCommitLink"
                                                >
                                                  {sha.slice(0, 7)}
                                                </a>
                                              ))}
                                            </span>
                                          </div>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                ) : null}
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
