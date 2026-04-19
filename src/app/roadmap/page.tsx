import type { ReactNode } from 'react';

import { Navbar } from '@/components/Navbar/Navbar';
import { SocialLinks } from '@/components/SocialLinks/SocialLinks';
import { Taskbar } from '@/components/Taskbar/Taskbar';
import {
  hasNetworkUrl,
  listFeedback,
  normalizeCategory,
  normalizeSort,
  normalizeStatus,
} from '@/server/feedback';

import { FeedbackCard } from './FeedbackCard';
import { FeedbackFilters } from './FeedbackFilters';
import './FeedbackPage.css';

export const metadata = {
  title: 'Roadmap',
  description: 'Feature requests, bugs, and feedback from the AURA community.',
};

export const dynamic = 'force-dynamic';

interface FeedbackPageProps {
  readonly searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function firstParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
): string | undefined {
  const raw = params[key];
  if (Array.isArray(raw)) return raw[0];
  return raw;
}

export default async function FeedbackPage({
  searchParams,
}: FeedbackPageProps): Promise<ReactNode> {
  const resolved = (await searchParams) ?? {};
  const sort = normalizeSort(firstParam(resolved, 'sort'));
  const category = normalizeCategory(firstParam(resolved, 'type'));
  const status = normalizeStatus(firstParam(resolved, 'status'));

  const entries = await listFeedback({ sort, category, status });
  const networkConfigured = hasNetworkUrl();

  return (
    <>
      <Navbar />
      <main className="scrollPageMain">
        <section className="feedbackPage">
          <div className="feedbackPageShell">
            <FeedbackFilters
              sort={sort}
              category={category}
              status={status}
            />

            <div className="feedbackListColumn">
              {entries.length > 0 ? (
                <div className="feedbackList" aria-label="Feedback entries">
                  {entries.map((entry) => (
                    <FeedbackCard key={entry.id} entry={entry} />
                  ))}
                </div>
              ) : (
                <div className="feedbackEmptyState">
                  {networkConfigured ? (
                    <>
                      <h2>No feedback yet.</h2>
                      <p>
                        No AURA feedback posts match the current filters.
                      </p>
                    </>
                  ) : (
                    <>
                      <h2>Feedback unavailable.</h2>
                      <p>
                        Set <code>AURA_NETWORK_URL</code> (e.g.{' '}
                        <code>https://network.aura.ai</code>) to load
                        feedback from the aura-network service.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <SocialLinks />
      <Taskbar />
    </>
  );
}
