import { Navbar } from '@/components/Navbar/Navbar';
import { ScrollClassToggle } from '@/components/ScrollClassToggle/ScrollClassToggle';
import { SocialLinks } from '@/components/SocialLinks/SocialLinks';
import { Taskbar } from '@/components/Taskbar/Taskbar';
import { getChangelogEntries } from '@/server/changelog';
import './ChangelogPage.css';

const GITHUB_COMMIT_URL_BASE = 'https://github.com/cypher-asi/aura-os/commit/';

function formatDateLabel(value: string): string {
  const parsed = new Date(`${value}T12:00:00Z`);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed);
}

function getCommitUrl(sha: string): string {
  return `${GITHUB_COMMIT_URL_BASE}${sha}`;
}

export const metadata = {
  title: 'Changelog',
  description: 'Daily release notes and product updates for Aura.',
};

export default async function ChangelogPage(): Promise<React.ReactNode> {
  const entries = await getChangelogEntries();

  return (
    <>
      <ScrollClassToggle className="changelogPageScrollEnabled" />
      <Navbar />
      <main>
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
                                    <span>
                                      {item.text}
                                      {item.commit_shas.length > 0 && ' '}
                                      {item.commit_shas.map((sha, index) => (
                                        <span key={sha}>
                                          {index === 0 ? '(' : ', '}
                                          <a
                                            href={getCommitUrl(sha)}
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
