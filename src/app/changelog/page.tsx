import { Fragment } from 'react';
import { Navbar } from '@/components/Navbar/Navbar';
import { SocialLinks } from '@/components/SocialLinks/SocialLinks';
import { Taskbar } from '@/components/Taskbar/Taskbar';
import { getChangelogEntries } from '@/server/changelog';
import './ChangelogPage.css';

const CHANGELOG_TIME_ZONE = 'America/Los_Angeles';

function formatDateLabel(value: string): string {
  const parsed = new Date(`${value}T12:00:00Z`);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed);
}

function formatTimelineTime(value: string, fallbackLabel: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return fallbackLabel;
  }

  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: CHANGELOG_TIME_ZONE,
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'shortGeneric',
    }).format(parsed);
  } catch {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: CHANGELOG_TIME_ZONE,
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(parsed);
  }
}

function getCommitUrl(repo: string, sha: string): string {
  return `https://github.com/cypher-asi/${repo}/commit/${sha}`;
}

function getMediaAltText(title: string, alt: string | undefined): string {
  return alt?.trim() || `${title} screenshot`;
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
              <div className="changelogEntries" aria-label="Aura changelog entries">
                {entries.map((entry) => {
                  const entryKey = `${entry.date}-${entry.version ?? entry.generatedAt}`;
                  const releaseCount = entry.rendered.entries.length;
                  const commitCount = entry.filteredCommitCount ?? entry.rawCommitCount;
                  const highlights = Array.from(new Set(entry.rendered.highlights));

                  return (
                    <article key={entryKey} className="changelogEntry">
                      <time className="changelogEntryDate" dateTime={entry.date}>
                        {formatDateLabel(entry.date)}
                      </time>

                      <div className="changelogEntryHead">
                        <div className="changelogEntryMeta">
                          <span>{entry.channel}</span>
                          <span>
                            {releaseCount} release{releaseCount === 1 ? '' : 's'}
                          </span>
                          <span>{commitCount} commits</span>
                        </div>

                        {highlights.length > 0 && (
                          <section className="changelogTldr" aria-label="Daily Update">
                            <h2 className="changelogTldrLabel">Daily Update</h2>
                            <ol className="changelogTldrList">
                              {highlights.map((highlight, highlightIndex) => (
                                <li key={highlight} className="changelogTldrItem">
                                  <span className="changelogTldrItemNumber">{highlightIndex + 1}.</span>
                                  <span>{highlight}</span>
                                </li>
                              ))}
                            </ol>
                          </section>
                        )}
                      </div>

                      {entry.rendered.entries.map((timelineEntry, timelineIndex) => {
                        const media =
                          timelineEntry.media?.status === 'published' && timelineEntry.media.assetUrl
                            ? timelineEntry.media
                            : undefined;

                        return (
                          <Fragment key={`${entryKey}-${timelineIndex}-${timelineEntry.started_at}`}>
                            <span className="changelogSectionTime">
                              {formatTimelineTime(timelineEntry.started_at, timelineEntry.time_label)}
                            </span>
                            <section className="changelogSection">
                              <h3 className="changelogSectionTitle">{timelineEntry.title}</h3>
                              <p className="changelogSectionSummary">{timelineEntry.summary}</p>
                              {media && (
                                <figure className="changelogSectionMedia">
                                  <a
                                    href={media.assetUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="changelogSectionMediaLink"
                                    aria-label={`Open screenshot for ${timelineEntry.title}`}
                                  >
                                    <img
                                      src={media.assetUrl}
                                      alt={getMediaAltText(timelineEntry.title, media.alt)}
                                      className="changelogSectionMediaImage"
                                      loading="lazy"
                                      decoding="async"
                                    />
                                  </a>
                                  <figcaption className="changelogSectionMediaCaption">
                                    <span>Demo screenshot</span>
                                    <span>Open full size</span>
                                  </figcaption>
                                </figure>
                              )}
                              {timelineEntry.items.length > 0 && (
                                <ul className="changelogSectionList">
                                  {timelineEntry.items.map((item, itemIndex) => (
                                    <li key={`${timelineEntry.title}-${itemIndex}`} className="changelogSectionItem">
                                      <p>{item.text}</p>
                                      {item.commit_shas.length > 0 && (
                                        <div className="changelogSectionSources">
                                          <span className="changelogSectionSourcesLabel">Sources</span>
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
                                        </div>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </section>
                          </Fragment>
                        );
                      })}
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
