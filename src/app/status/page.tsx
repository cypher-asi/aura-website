import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Gauge,
  Server,
  XCircle,
} from 'lucide-react';

import { Navbar } from '@/components/Navbar/Navbar';
import { SocialLinks } from '@/components/SocialLinks/SocialLinks';
import { Taskbar } from '@/components/Taskbar/Taskbar';
import {
  getStatusFeed,
  type FeatureHealthStatus,
  type StatusCheck,
  type StatusFeature,
} from '@/server/status';

import './StatusPage.css';

export const metadata = {
  title: 'Status',
  description: 'Live Aura feature health backed by production eval probes.',
};

export const dynamic = 'force-dynamic';

const STATUS_LABELS: Record<FeatureHealthStatus, string> = {
  operational: 'Operational',
  degraded: 'Degraded',
  partial_outage: 'Partial Outage',
  major_outage: 'Major Outage',
  unknown: 'Unknown',
  maintenance: 'Maintenance',
};

const CATEGORY_LABELS: Record<string, string> = {
  agents: 'Agents',
  automation: 'Automation',
  media: 'Media',
  models: 'Models',
  platform: 'Platform',
  website: 'Website',
};

function formatTimestamp(value: string | null): string {
  if (!value) return 'No run yet';
  const date = new Date(value);
  if (Number.isNaN(date.getTime()) || date.getTime() === 0) {
    return 'No run yet';
  }
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function formatLatency(value: number | null): string {
  if (value == null) return '-';
  if (value < 1000) return `${Math.round(value)} ms`;
  return `${(value / 1000).toFixed(value < 10_000 ? 1 : 0)} s`;
}

function statusIcon(status: FeatureHealthStatus): React.ReactNode {
  if (status === 'operational') return <CheckCircle2 size={16} strokeWidth={1.9} />;
  if (status === 'degraded' || status === 'maintenance') {
    return <AlertTriangle size={16} strokeWidth={1.9} />;
  }
  if (status === 'partial_outage' || status === 'major_outage') {
    return <XCircle size={16} strokeWidth={1.9} />;
  }
  return <Clock3 size={16} strokeWidth={1.9} />;
}

function StatusBadge({ status }: { readonly status: FeatureHealthStatus }): React.ReactNode {
  return (
    <span className={`statusBadge statusBadge-${status}`}>
      {statusIcon(status)}
      {STATUS_LABELS[status]}
    </span>
  );
}

function groupFeatures(features: readonly StatusFeature[]): Array<[string, StatusFeature[]]> {
  const groups = new Map<string, StatusFeature[]>();
  for (const feature of features) {
    const key = feature.category || 'other';
    groups.set(key, [...(groups.get(key) ?? []), feature]);
  }
  return [...groups.entries()].sort(([left], [right]) => left.localeCompare(right));
}

function checkClass(status: StatusCheck['status']): string {
  if (status === 'pass') return 'statusCheckPass';
  if (status === 'warn') return 'statusCheckWarn';
  if (status === 'fail') return 'statusCheckFail';
  if (status === 'skip') return 'statusCheckSkip';
  return 'statusCheckUnknown';
}

function evidenceLabel(check: StatusCheck): string {
  const evidence = check.evidence ?? {};
  if (typeof evidence.passed === 'number' && typeof evidence.total === 'number') {
    return `${evidence.passed}/${evidence.total}`;
  }
  if (typeof evidence.network === 'string') return evidence.network;
  if (typeof evidence.remoteState === 'string') return evidence.remoteState;
  if (typeof evidence.model === 'string') return evidence.model;
  if (typeof evidence.overall === 'string') return evidence.overall;
  if (typeof evidence.status === 'string') return evidence.status;
  return Object.keys(evidence).length > 0 ? 'Captured' : '-';
}

function FeatureRow({ feature }: { readonly feature: StatusFeature }): React.ReactNode {
  return (
    <article className="statusFeature">
      <div className="statusFeatureHead">
        <div>
          <h3>{feature.label}</h3>
          <p>{feature.publicSummary}</p>
        </div>
        <StatusBadge status={feature.status} />
      </div>
      <div className="statusFeatureMeta" aria-label={`${feature.label} metrics`}>
        <span>{feature.checksPassed}/{feature.checksTotal} checks</span>
        <span>{formatLatency(feature.latencyP95Ms)} p95</span>
        <span>{formatTimestamp(feature.lastCheckedAt)}</span>
      </div>
      <p className="statusFeatureMessage">{feature.message}</p>
      <div className="statusChecks" role="table" aria-label={`${feature.label} checks`}>
        <div className="statusCheckHeader" role="row">
          <span role="columnheader">Check</span>
          <span role="columnheader">State</span>
          <span role="columnheader">Latency</span>
          <span role="columnheader">Evidence</span>
        </div>
        {feature.checks.map((check) => (
          <div className="statusCheckRow" role="row" key={check.id}>
            <span className="statusCheckName" role="cell">
              {check.id}
              {!check.required && <span className="statusOptional">Optional</span>}
            </span>
            <span className={`statusCheckState ${checkClass(check.status)}`} role="cell">
              {check.status}
            </span>
            <span role="cell">{formatLatency(check.latencyMs)}</span>
            <span role="cell">{evidenceLabel(check)}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

export default async function StatusPage(): Promise<React.ReactNode> {
  const { snapshot, configured, error } = await getStatusFeed();
  const grouped = groupFeatures(snapshot.features);
  const passingChecks = snapshot.features.reduce(
    (sum, feature) => sum + feature.checksPassed,
    0,
  );
  const totalChecks = snapshot.features.reduce(
    (sum, feature) => sum + feature.checksTotal,
    0,
  );
  const latencyValues = snapshot.features
    .map((feature) => feature.latencyP95Ms)
    .filter((value): value is number => typeof value === 'number');
  const averageLatency =
    latencyValues.length > 0
      ? latencyValues.reduce((sum, value) => sum + value, 0) / latencyValues.length
      : null;

  return (
    <>
      <Navbar />
      <main className="scrollPageMain">
        <section className="statusPage">
          <div className="statusPageShell">
            <header className="statusHero">
              <div className="statusHeroCopy">
                <span className="statusEyebrow">Live evals</span>
                <h1>Aura Feature Health</h1>
                <p>
                  Production probes exercise agents, model responses, media generation,
                  public routes, billing, and x402 payment readiness.
                </p>
              </div>
              <div className="statusOverall" aria-label="Overall status">
                <StatusBadge status={snapshot.overall} />
                <strong>{STATUS_LABELS[snapshot.overall]}</strong>
                <span>Updated {formatTimestamp(snapshot.generatedAt)}</span>
              </div>
            </header>

            <section className="statusMetrics" aria-label="Status summary">
              <div className="statusMetric">
                <Server size={18} strokeWidth={1.8} />
                <strong>{snapshot.totals.features}</strong>
                <span>Features</span>
              </div>
              <div className="statusMetric">
                <CheckCircle2 size={18} strokeWidth={1.8} />
                <strong>{passingChecks}/{totalChecks}</strong>
                <span>Passing checks</span>
              </div>
              <div className="statusMetric">
                <Gauge size={18} strokeWidth={1.8} />
                <strong>{formatLatency(averageLatency)}</strong>
                <span>Average p95</span>
              </div>
              <div className="statusMetric">
                <Activity size={18} strokeWidth={1.8} />
                <strong>{snapshot.source}</strong>
                <span>{snapshot.environment}</span>
              </div>
            </section>

            {error && (
              <div className="statusNotice" role="status">
                <AlertTriangle size={16} strokeWidth={1.8} />
                {configured ? error : 'Status feed is not configured for this deployment.'}
              </div>
            )}

            {grouped.length === 0 ? (
              <div className="statusEmpty">
                <Clock3 size={18} strokeWidth={1.8} />
                No live status snapshot has been published yet.
              </div>
            ) : (
              <div className="statusGroups" aria-label="Feature health">
                {grouped.map(([category, features]) => (
                  <section className="statusGroup" key={category}>
                    <h2>{CATEGORY_LABELS[category] ?? category}</h2>
                    <div className="statusFeatureList">
                      {features.map((feature) => (
                        <FeatureRow feature={feature} key={feature.id} />
                      ))}
                    </div>
                  </section>
                ))}
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
