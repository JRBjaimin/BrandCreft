'use client';

import Link from 'next/link';
import { useData } from '../../../lib/mock/store';
import { useBusiness } from '../../../lib/use-business';
import { Card, CardHead, PageHeader, StatCard } from '../../../components/ui';
import { CreativeStatusBadge, IntegrationBadge } from '../../../components/status';
import { dateLabel, inr, relTime } from '../../../lib/format';

export default function DashboardPage() {
  const { data } = useData();
  const ctx = useBusiness();
  if (!ctx) return null;
  const { business, rateModuleEnabled } = ctx;

  const products = data.products.filter((p) => p.businessId === business.id);
  const creatives = data.creatives.filter((c) => c.businessId === business.id);
  const campaigns = data.campaigns.filter((c) => c.businessId === business.id);
  const integ = data.integrations.find((i) => i.businessId === business.id);
  const rates = data.rates[business.id] ?? [];

  const pending = creatives.filter((c) => c.status === 'PENDING_APPROVAL');
  const published = creatives.filter((c) => c.status === 'PUBLISHED');
  const failed = creatives.filter((c) => c.status === 'FAILED');

  const activity = [...creatives]
    .flatMap((c) =>
      c.history.map((h) => ({
        at: h.at,
        label: h.label,
        by: h.by,
        product: data.products.find((p) => p.id === c.productId)?.name ?? 'Product',
      })),
    )
    .sort((a, b) => +new Date(b.at) - +new Date(a.at))
    .slice(0, 8);

  return (
    <>
      <PageHeader
        title={`Good day, ${business.name}`}
        subtitle={`${dateLabel(new Date().toISOString())} · ${business.plan} plan`}
      />

      <div className="grid cols-4">
        <StatCard label="Active products" value={products.filter((p) => p.status === 'active').length} delta={`${products.length} total`} />
        <StatCard label="Pending approvals" value={pending.length} delta={pending.length ? 'Needs attention' : 'All clear'} trend={pending.length ? 'down' : 'up'} />
        <StatCard label="Published creatives" value={published.length} delta="all time" />
        <StatCard label="Running campaigns" value={campaigns.filter((c) => c.status === 'running').length} delta={`${campaigns.length} total`} />
      </div>

      <div className="grid cols-2 mt-24">
        <Card>
          <CardHead title="Recent activity" />
          <div className="card-pad">
            {activity.length === 0 ? (
              <span className="muted">No activity yet.</span>
            ) : (
              <div className="timeline">
                {activity.map((a, i) => (
                  <div className="ev" key={i}>
                    <span className="when">{relTime(a.at)}</span>
                    <span>
                      <strong>{a.label}</strong>
                      <div className="cell-sub">
                        {a.product} · {a.by}
                      </div>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        <div className="stack" style={{ gap: 16 }}>
          <Card>
            <CardHead title="Integrations" />
            <div className="card-pad stack" style={{ gap: 12 }}>
              <div className="between">
                <span>Instagram {integ?.instagram.accountHandle ? <span className="faint">{integ.instagram.accountHandle}</span> : null}</span>
                <IntegrationBadge state={integ?.instagram.state ?? 'disconnected'} />
              </div>
              <div className="between">
                <span>WhatsApp {integ?.whatsapp.phoneNumber ? <span className="faint">{integ.whatsapp.phoneNumber}</span> : null}</span>
                <IntegrationBadge state={integ?.whatsapp.state ?? 'disconnected'} />
              </div>
              <Link href="/integrations" className="btn sm" style={{ alignSelf: 'flex-start' }}>
                Manage integrations
              </Link>
            </div>
          </Card>

          {rateModuleEnabled && (
            <Card>
              <CardHead title="Metal rates" />
              <div className="card-pad">
                <div className="kv">
                  {rates.slice(0, 3).map((r) => (
                    <div key={r.metal} style={{ display: 'contents' }}>
                      <dt>{r.label}</dt>
                      <dd>
                        {inr(r.pricePerGram)}/g{' '}
                        <span className={r.changePct >= 0 ? 'badge green' : 'badge red'} style={{ marginLeft: 6 }}>
                          {r.changePct >= 0 ? '+' : ''}
                          {r.changePct}%
                        </span>
                        {r.stale && <span className="badge amber" style={{ marginLeft: 6 }}>stale</span>}
                      </dd>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {failed.length > 0 && (
            <Card>
              <CardHead title="Attention" />
              <div className="card-pad stack" style={{ gap: 10 }}>
                {failed.map((c) => (
                  <div key={c.id} className="between">
                    <span>{data.products.find((p) => p.id === c.productId)?.name}</span>
                    <CreativeStatusBadge status={c.status} />
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
