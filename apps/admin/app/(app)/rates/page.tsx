'use client';

import { useData } from '../../../lib/mock/store';
import { useBusiness } from '../../../lib/use-business';
import { Badge, Card, CardHead, EmptyState, PageHeader } from '../../../components/ui';
import { inr, relTime } from '../../../lib/format';

export default function RatesPage() {
  const { data } = useData();
  const ctx = useBusiness();
  if (!ctx) return null;

  if (!ctx.rateModuleEnabled) {
    return (
      <>
        <PageHeader title="Rates" />
        <Card>
          <EmptyState icon="₹" title="Rates module not enabled" hint="This category does not display metal rates." />
        </Card>
      </>
    );
  }

  const rates = data.rates[ctx.business.id] ?? [];
  const anyStale = rates.some((r) => r.stale);

  return (
    <>
      <PageHeader
        title="Metal rates"
        subtitle="Shown on your storefront for enabled categories. Only verified, licensed sources are presented as live."
        actions={
          <span className="badge blue">Source: {rates[0]?.source ?? 'dev feed'}</span>
        }
      />

      {anyStale && (
        <Card pad className="mt-16" style={{ borderColor: 'var(--warning)', background: 'var(--warning-soft)' }}>
          <strong style={{ color: 'var(--warning)' }}>Some rates are stale</strong>
          <div className="cell-sub" style={{ color: 'var(--warning)' }}>
            Stale values are labelled on the storefront and never shown as “live”.
          </div>
        </Card>
      )}

      <div className="grid cols-2 mt-16">
        {rates.map((r) => (
          <Card key={r.metal} pad>
            <div className="between">
              <strong style={{ fontSize: 15 }}>{r.label}</strong>
              {r.stale ? <Badge tone="amber" dot>Stale</Badge> : <Badge tone="green" dot>Live</Badge>}
            </div>
            <div className="value" style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>
              {inr(r.pricePerGram)} <span className="faint" style={{ fontSize: 14, fontWeight: 500 }}>/ gram</span>
            </div>
            <div className="wrap-gap mt-16">
              <span className={r.changePct >= 0 ? 'badge green' : 'badge red'}>
                {r.changePct >= 0 ? '▲' : '▼'} {Math.abs(r.changePct)}%
              </span>
              <span className="badge">Purity {r.purity}</span>
              <span className="badge">Updated {relTime(r.updatedAt)}</span>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-24">
        <CardHead title="Methodology" />
        <div className="card-pad muted">
          Rates are pulled from a development feed on a schedule, validated, normalised to ₹/gram, and stored with
          source + timestamp. Purity is expressed in fineness (999, 916, 950). Diamond pricing is not published.
        </div>
      </Card>
    </>
  );
}
