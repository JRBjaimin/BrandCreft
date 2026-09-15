'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { StaggerGroup, StaggerItem } from '@brandcraft/motion';
import { useAuth } from '../../../lib/auth';
import { useData } from '../../../lib/mock/store';
import { Card, CardHead, PageHeader, StatCard } from '../../../components/ui';
import { BusinessStatusBadge } from '../../../components/status';
import { num, relTime, initials } from '../../../lib/format';

export default function SuperOverviewPage() {
  const { data } = useData();
  const { setActiveBusiness } = useAuth();
  const router = useRouter();

  const active = data.businesses.filter((b) => b.status === 'ACTIVE').length;
  const aiJobs = data.queues.find((q) => q.name === 'ai');
  const failedQueue = data.queues.reduce((s, q) => s + q.failed, 0);
  const igErrors = data.integrations.filter((i) => i.instagram.state === 'error').length;

  const openBusiness = (businessId: string) => {
    setActiveBusiness(businessId);
    router.push('/dashboard');
  };

  return (
    <>
      <PageHeader
        title="Platform overview"
        subtitle="Everything running on BrandCraft right now."
      />

      <div className="grid cols-4">
        <StatCard label="Businesses" value={data.businesses.length} delta={`${active} active`} />
        <StatCard
          label="Users"
          value={data.users.length}
          delta={`${data.users.filter((u) => u.isActive).length} active`}
        />
        <StatCard label="Products" value={data.products.length} />
        <StatCard
          label="AI generations"
          value={num(aiJobs?.completed ?? 0)}
          delta={`${aiJobs?.failed ?? 0} failed`}
          trend={aiJobs?.failed ? 'down' : 'up'}
        />
      </div>

      <div className="between mt-24" style={{ marginBottom: 12 }}>
        <h3 style={{ fontSize: 16 }}>Businesses</h3>
        <Link href="/admin/businesses" className="btn ghost sm">
          View all
        </Link>
      </div>
      <StaggerGroup className="grid cols-3" trigger="mount">
        {data.businesses.map((b) => {
          const category = data.categories.find((c) => c.key === b.categoryKey);
          return (
            <StaggerItem key={b.id}>
              <Card
                pad
                onClick={() => openBusiness(b.id)}
                style={{ cursor: 'pointer', height: '100%' }}
              >
                <div className="between">
                  <span className="avatar">{initials(b.name)}</span>
                  <BusinessStatusBadge status={b.status} />
                </div>
                <strong style={{ display: 'block', marginTop: 10, fontSize: 15 }}>{b.name}</strong>
                <span className="cell-sub">{category?.label ?? b.categoryKey}</span>
                <div className="between mt-16">
                  <span className="cell-sub" style={{ textTransform: 'capitalize' }}>
                    {b.plan} plan
                  </span>
                  <span className="muted" style={{ fontSize: 13 }}>
                    Open →
                  </span>
                </div>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerGroup>

      <div className="grid cols-2 mt-24">
        <Card>
          <CardHead title="System health" />
          <div className="card-pad stack" style={{ gap: 10 }}>
            <div className="between">
              <span>Queue failures (all queues)</span>
              <span className={failedQueue > 20 ? 'badge red' : 'badge green'}>{failedQueue}</span>
            </div>
            <div className="between">
              <span>Instagram connections needing action</span>
              <span className={igErrors ? 'badge amber' : 'badge green'}>{igErrors}</span>
            </div>
            <div className="between">
              <span>Stale rate feeds</span>
              <span className="badge amber">
                {
                  Object.values(data.rates)
                    .flat()
                    .filter((r) => r.stale).length
                }
              </span>
            </div>
            <Link href="/admin/operations" className="btn sm" style={{ alignSelf: 'flex-start' }}>
              Open operations
            </Link>
          </div>
        </Card>

        <Card>
          <CardHead title="Recent audit events" />
          <div className="card-pad">
            <div className="timeline">
              {data.auditLogs.slice(0, 5).map((a) => (
                <div className="ev" key={a.id}>
                  <span className="when">{relTime(a.at)}</span>
                  <span>
                    <strong>{a.action}</strong>
                    <div className="cell-sub">
                      {a.target} · {data.users.find((u) => u.id === a.actor)?.name ?? a.actor}
                    </div>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
