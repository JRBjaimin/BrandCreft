'use client';

import { useState } from 'react';
import { StaggerGroup, StaggerItem } from '@brandcraft/motion';
import { useData } from '../../../lib/mock/store';
import { useBusiness } from '../../../lib/use-business';
import { Button, Card, EmptyState, PageHeader } from '../../../components/ui';
import { CampaignStatusBadge } from '../../../components/status';
import { CampaignFormModal } from '../../../components/campaign-form';
import { dateLabel } from '../../../lib/format';
import type { Campaign } from '../../../lib/types';

export default function CampaignsPage() {
  const { data } = useData();
  const ctx = useBusiness();
  const [modal, setModal] = useState<{ open: boolean; editing?: Campaign }>({ open: false });

  if (!ctx) return null;
  const campaigns = data.campaigns.filter((c) => c.businessId === ctx.business.id);

  return (
    <>
      <PageHeader
        title="Campaigns"
        subtitle="Festival and promotional campaigns. Each one becomes deterministic context for the AI engine."
        actions={
          <Button variant="primary" onClick={() => setModal({ open: true })}>
            + New campaign
          </Button>
        }
      />

      {campaigns.length === 0 ? (
        <Card>
          <EmptyState
            icon="✦"
            title="No campaigns yet"
            hint="Create a campaign to tie products, a festival, and brand direction together."
            action={
              <Button variant="primary" onClick={() => setModal({ open: true })}>
                + New campaign
              </Button>
            }
          />
        </Card>
      ) : (
        <StaggerGroup className="grid cols-2" trigger="mount">
          {campaigns.map((c) => {
            const fest = data.festivals.find((f) => f.key === c.festivalKey);
            return (
              <StaggerItem key={c.id}>
                <Card pad style={{ height: '100%' }}>
                  <div className="between">
                    <strong style={{ fontSize: 15 }}>{c.name}</strong>
                    <CampaignStatusBadge status={c.status} />
                  </div>
                  <div className="cell-sub mt-16">
                    {fest ? `${fest.name} · ` : ''}
                    {dateLabel(c.startDate)} → {dateLabel(c.endDate)}
                  </div>
                  <p className="muted" style={{ marginBottom: 8 }}>
                    {c.message || <span className="faint">No message set</span>}
                  </p>
                  <div className="wrap-gap">
                    {c.productIds.map((pid) => {
                      const p = data.products.find((x) => x.id === pid);
                      return p ? (
                        <span key={pid} className="badge">
                          {p.name}
                        </span>
                      ) : null;
                    })}
                    {c.productIds.length === 0 && <span className="faint">No products linked</span>}
                  </div>
                  <div className="btn-row mt-16">
                    <Button size="sm" onClick={() => setModal({ open: true, editing: c })}>
                      Edit
                    </Button>
                    {c.cta && <span className="badge violet">CTA: {c.cta}</span>}
                  </div>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      )}

      {modal.open && (
        <CampaignFormModal
          businessId={ctx.business.id}
          categoryKey={ctx.business.categoryKey}
          existing={modal.editing}
          onClose={() => setModal({ open: false })}
        />
      )}
    </>
  );
}
