'use client';

import { useState } from 'react';
import { useData } from '../../../../lib/mock/store';
import { Badge, Card, PageHeader, StatCard } from '../../../../components/ui';
import { num, relTime } from '../../../../lib/format';
import type { WebhookEvent } from '../../../../lib/types';

type Tab = 'webhooks' | 'queues' | 'audit' | 'health';

const WH_TONE: Record<WebhookEvent['status'], 'green' | 'grey' | 'red' | 'amber'> = {
  processed: 'green',
  duplicate: 'grey',
  invalid_signature: 'red',
  unknown_sender: 'amber',
  failed: 'red',
};

export default function OperationsPage() {
  const { data } = useData();
  const [tab, setTab] = useState<Tab>('webhooks');

  const bizName = (id: string | null) =>
    id ? data.businesses.find((b) => b.id === id)?.name ?? id : '—';

  return (
    <>
      <PageHeader title="Operations" subtitle="Webhook delivery, queue health, audit trail and system status." />

      <div className="tabs">
        {(
          [
            ['webhooks', 'Webhook events'],
            ['queues', 'Queues'],
            ['audit', 'Audit log'],
            ['health', 'System health'],
          ] as [Tab, string][]
        ).map(([t, label]) => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'webhooks' && (
        <Card>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Type</th>
                  <th>Business</th>
                  <th>Result</th>
                  <th>Detail</th>
                </tr>
              </thead>
              <tbody>
                {data.webhookEvents.map((e) => (
                  <tr key={e.id}>
                    <td className="cell-sub">{relTime(e.at)}</td>
                    <td className="mono">{e.type}</td>
                    <td>{bizName(e.businessId)}</td>
                    <td>
                      <Badge tone={WH_TONE[e.status]}>{e.status.replace('_', ' ')}</Badge>
                    </td>
                    <td className="cell-sub">{e.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'queues' && (
        <>
          <div className="grid cols-3">
            {data.queues.map((q) => (
              <StatCard
                key={q.name}
                label={`${q.name} queue`}
                value={num(q.completed)}
                delta={`${q.waiting} waiting · ${q.active} active · ${q.failed} failed`}
                trend={q.failed > 10 ? 'down' : 'flat'}
              />
            ))}
          </div>
          <Card className="mt-24">
            <div className="table-wrap">
              <table className="data">
                <thead>
                  <tr>
                    <th>Queue</th>
                    <th>Waiting</th>
                    <th>Active</th>
                    <th>Delayed</th>
                    <th>Completed</th>
                    <th>Failed</th>
                  </tr>
                </thead>
                <tbody>
                  {data.queues.map((q) => (
                    <tr key={q.name}>
                      <td className="cell-primary">{q.name}</td>
                      <td>{q.waiting}</td>
                      <td>{q.active}</td>
                      <td>{q.delayed}</td>
                      <td>{num(q.completed)}</td>
                      <td>
                        {q.failed > 0 ? <span className="badge red">{q.failed}</span> : <span className="badge green">0</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {tab === 'audit' && (
        <Card>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Actor</th>
                  <th>Action</th>
                  <th>Target</th>
                  <th>Business</th>
                </tr>
              </thead>
              <tbody>
                {data.auditLogs.map((a) => (
                  <tr key={a.id}>
                    <td className="cell-sub">{relTime(a.at)}</td>
                    <td>{data.users.find((u) => u.id === a.actor)?.name ?? a.actor}</td>
                    <td className="mono">{a.action}</td>
                    <td>{a.target}</td>
                    <td className="cell-sub">{bizName(a.businessId)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'health' && (
        <div className="grid cols-2">
          {[
            ['API', 'up', 'p95 142ms'],
            ['PostgreSQL', 'up', '38 connections'],
            ['Redis', 'up', '0.4 GB used'],
            ['Object storage', 'up', '12.4 GB'],
            ['AI provider (Gemini)', 'up', 'quota 61% used'],
            ['Rate feed', 'degraded', '1 stale metal'],
          ].map(([name, state, detail]) => (
            <Card key={name} pad>
              <div className="between">
                <strong>{name}</strong>
                <Badge tone={state === 'up' ? 'green' : 'amber'} dot>
                  {state}
                </Badge>
              </div>
              <div className="cell-sub mt-16">{detail}</div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
