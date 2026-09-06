'use client';

import Link from 'next/link';
import { useData } from '../../../lib/mock/store';
import { Card, CardHead, PageHeader, StatCard } from '../../../components/ui';
import { BusinessStatusBadge } from '../../../components/status';
import { num, relTime } from '../../../lib/format';

export default function SuperOverviewPage() {
  const { data } = useData();

  const active = data.businesses.filter((b) => b.status === 'ACTIVE').length;
  const aiJobs = data.queues.find((q) => q.name === 'ai');
  const failedQueue = data.queues.reduce((s, q) => s + q.failed, 0);
  const igErrors = data.integrations.filter((i) => i.instagram.state === 'error').length;

  return (
    <>
      <PageHeader title="Platform overview" subtitle="Everything running on BrandCraft right now." />

      <div className="grid cols-4">
        <StatCard label="Businesses" value={data.businesses.length} delta={`${active} active`} />
        <StatCard label="Users" value={data.users.length} delta={`${data.users.filter((u) => u.isActive).length} active`} />
        <StatCard label="Products" value={data.products.length} />
        <StatCard label="AI generations" value={num(aiJobs?.completed ?? 0)} delta={`${aiJobs?.failed ?? 0} failed`} trend={aiJobs?.failed ? 'down' : 'up'} />
      </div>

      <div className="grid cols-2 mt-24">
        <Card>
          <CardHead title="Businesses">
            <Link href="/admin/businesses" className="btn ghost sm">
              View all
            </Link>
          </CardHead>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Business</th>
                  <th>Category</th>
                  <th>Plan</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.businesses.map((b) => (
                  <tr key={b.id}>
                    <td className="cell-primary">{b.name}</td>
                    <td>{data.categories.find((c) => c.key === b.categoryKey)?.label}</td>
                    <td style={{ textTransform: 'capitalize' }}>{b.plan}</td>
                    <td>
                      <BusinessStatusBadge status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="stack" style={{ gap: 16 }}>
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
                  {Object.values(data.rates).flat().filter((r) => r.stale).length}
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
      </div>
    </>
  );
}
