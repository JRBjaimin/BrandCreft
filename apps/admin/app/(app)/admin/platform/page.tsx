'use client';

import { useState } from 'react';
import { useData } from '../../../../lib/mock/store';
import { useToast } from '../../../../components/toast';
import { Badge, Card, CardHead, PageHeader } from '../../../../components/ui';
import { dateLabel } from '../../../../lib/format';

type Tab = 'categories' | 'flags' | 'festivals' | 'providers';

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onChange}
      style={{
        width: 40,
        height: 23,
        borderRadius: 999,
        border: 'none',
        cursor: 'pointer',
        background: on ? 'var(--primary)' : 'var(--border-strong)',
        position: 'relative',
        transition: 'background .15s',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 2,
          left: on ? 19 : 2,
          width: 19,
          height: 19,
          borderRadius: 999,
          background: '#fff',
          transition: 'left .15s',
        }}
      />
    </button>
  );
}

export default function PlatformConfigPage() {
  const { data, toggleFlag } = useData();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>('categories');

  return (
    <>
      <PageHeader title="Platform configuration" subtitle="Categories, feature flags, the festival calendar and provider settings." />

      <div className="tabs">
        {(
          [
            ['categories', 'Categories'],
            ['flags', 'Feature flags'],
            ['festivals', 'Festival calendar'],
            ['providers', 'Providers'],
          ] as [Tab, string][]
        ).map(([t, label]) => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'categories' && (
        <div className="grid cols-2">
          {data.categories.map((c) => (
            <Card key={c.key} pad>
              <div className="between">
                <strong style={{ fontSize: 15 }}>{c.label}</strong>
                {c.rateModuleEnabled && <Badge tone="violet">rates on</Badge>}
              </div>
              <div className="cell-sub mono">{c.key}</div>
              <div className="wrap-gap mt-16">
                {c.features.map((f) => (
                  <span key={f} className="badge">
                    {f}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'flags' && (
        <Card>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Flag</th>
                  <th>Scope</th>
                  <th>Description</th>
                  <th style={{ textAlign: 'right' }}>State</th>
                </tr>
              </thead>
              <tbody>
                {data.featureFlags.map((f) => (
                  <tr key={f.key}>
                    <td>
                      <div className="stack">
                        <span className="cell-primary">{f.label}</span>
                        <span className="cell-sub mono">{f.key}</span>
                      </div>
                    </td>
                    <td>
                      <Badge tone={f.scope === 'global' ? 'blue' : f.scope === 'category' ? 'violet' : 'grey'}>
                        {f.scope}
                      </Badge>
                    </td>
                    <td className="cell-sub">{f.description}</td>
                    <td style={{ textAlign: 'right' }}>
                      <Toggle
                        on={f.enabled}
                        onChange={() => {
                          toggleFlag(f.key);
                          toast(`${f.label} ${f.enabled ? 'disabled' : 'enabled'}`);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'festivals' && (
        <Card>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Festival</th>
                  <th>Date</th>
                  <th>Allowed categories</th>
                  <th>Suggested CTA</th>
                </tr>
              </thead>
              <tbody>
                {data.festivals.map((f) => (
                  <tr key={f.key}>
                    <td className="cell-primary">{f.name}</td>
                    <td>{dateLabel(f.date)}</td>
                    <td>
                      <div className="wrap-gap">
                        {f.allowedCategories.map((c) => (
                          <span key={c} className="badge">
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="cell-sub">{f.suggestedCta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'providers' && (
        <div className="grid cols-2">
          <Card>
            <CardHead title="AI provider" />
            <div className="card-pad">
              <dl className="kv">
                <dt>Active provider</dt>
                <dd>
                  Gemini <Badge tone="green">connected</Badge>
                </dd>
                <dt>Model</dt>
                <dd className="mono">gemini-2.5-flash-image</dd>
                <dt>Fallback</dt>
                <dd>None configured</dd>
                <dt>Monthly generations</dt>
                <dd>{data.queues.find((q) => q.name === 'ai')?.completed ?? 0}</dd>
              </dl>
            </div>
          </Card>
          <Card>
            <CardHead title="Rate provider" />
            <div className="card-pad">
              <dl className="kv">
                <dt>Provider</dt>
                <dd>
                  IBJA (dev feed) <Badge tone="amber">unlicensed</Badge>
                </dd>
                <dt>Sync interval</dt>
                <dd>Every 30 min</dd>
                <dt>Redistribution rights</dt>
                <dd>Not verified — see Phase 12</dd>
                <dt>Units</dt>
                <dd>₹ per gram, fineness purity</dd>
              </dl>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
