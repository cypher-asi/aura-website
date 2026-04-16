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
                            <span className="changelogMetaItem">{entry.rawCommitCount} commits</span>
                            {entry.releaseUrl && (
                              <a href={entry.releaseUrl} target="_blank" rel="noopener noreferrer" className="changelogReleaseLink">
                                View release
                              </a>
                            )}
                          </div>
                        </header>

                        <div className="changelogSections">
                          {entry.rendered.sections.map((section) => (
                            <section key={section.title} className="changelogSection">
                              <h3 className="changelogSectionTitle">{section.title}</h3>
                              <ul className="changelogSectionList">
                                {section.items.map((item) => (
                                  <li key={`${section.title}-${item.text}`} className="changelogSectionItem">
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
