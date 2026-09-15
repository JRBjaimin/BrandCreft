'use client';

import { useState } from 'react';
import { StaggerGroup, StaggerItem } from '@brandcraft/motion';
import { useData } from '../../../lib/mock/store';
import { useBusiness } from '../../../lib/use-business';
import { useAuth } from '../../../lib/auth';
import { useToast } from '../../../components/toast';
import {
  Button,
  Card,
  Chips,
  EmptyState,
  Field,
  PageHeader,
  Textarea,
  Thumb,
} from '../../../components/ui';
import { Drawer, ConfirmDialog } from '../../../components/overlay';
import { CreativeStatusBadge } from '../../../components/status';
import { relTime } from '../../../lib/format';
import type { Creative } from '../../../lib/types';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'PENDING_APPROVAL', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'FAILED', label: 'Failed' },
];

export default function CreativesPage() {
  const {
    data,
    approveCreative,
    rejectCreative,
    regenerateCreative,
    retryPublish,
    setActiveVersion,
  } = useData();
  const { session } = useAuth();
  const { toast } = useToast();
  const ctx = useBusiness();
  const [filter, setFilter] = useState('all');
  const [openId, setOpenId] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  if (!ctx) return null;
  const by = session?.name ?? 'Admin';

  const creatives = data.creatives
    .filter((c) => c.businessId === ctx.business.id)
    .filter((c) => (filter === 'all' ? true : c.status === filter));

  const open = data.creatives.find((c) => c.id === openId) ?? null;
  const openProduct = open ? data.products.find((p) => p.id === open.productId) : null;
  const activeVersion =
    open?.versions.find((v) => v.id === open.activeVersionId) ?? open?.versions[0];

  const productName = (c: Creative) =>
    data.products.find((p) => p.id === c.productId)?.name ?? 'Product';

  return (
    <>
      <PageHeader
        title="Creatives"
        subtitle="AI-generated Instagram creatives. Approvals normally happen on WhatsApp — you can also action them here."
      />

      <div className="toolbar">
        <Chips options={FILTERS} value={filter} onChange={setFilter} />
      </div>

      {creatives.length === 0 ? (
        <Card>
          <EmptyState icon="✎" title="Nothing here" hint="No creatives match this filter." />
        </Card>
      ) : (
        <StaggerGroup className="grid cols-3" trigger="mount">
          {creatives.map((c) => {
            const v = c.versions.find((x) => x.id === c.activeVersionId) ?? c.versions[0];
            return (
              <StaggerItem key={c.id}>
                <Card className="row-link" style={{ height: '100%' }}>
                  <div onClick={() => setOpenId(c.id)}>
                    <Thumb src={v?.imageUrl ?? ''} alt={productName(c)} size="lg" />
                    <div className="card-pad">
                      <div className="between">
                        <strong>{productName(c)}</strong>
                        <CreativeStatusBadge status={c.status} />
                      </div>
                      <div className="cell-sub mt-16">
                        via {c.source} · {relTime(c.createdAt)}
                        {c.versions.length > 1 ? ` · v${c.versions.length}` : ''}
                      </div>
                    </div>
                  </div>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      )}

      {open && (
        <Drawer
          title={openProduct?.name ?? 'Creative'}
          onClose={() => setOpenId(null)}
          footer={
            <>
              {open.status === 'PENDING_APPROVAL' && (
                <>
                  <Button variant="ghost" onClick={() => setRejecting(true)}>
                    Reject
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      approveCreative(open.id, by);
                      toast('Creative approved');
                    }}
                  >
                    Approve
                  </Button>
                </>
              )}
              {(open.status === 'REJECTED' || open.status === 'GENERATED') && (
                <Button
                  variant="primary"
                  onClick={() => {
                    regenerateCreative(open.id, by);
                    toast('Regeneration queued');
                  }}
                >
                  Regenerate
                </Button>
              )}
              {open.status === 'FAILED' && (
                <Button
                  variant="primary"
                  onClick={() => {
                    retryPublish(open.id, by);
                    toast('Publish retried');
                  }}
                >
                  Retry publish
                </Button>
              )}
              {open.status === 'PUBLISHED' && open.externalPostId && (
                <span className="badge green">Live · {open.externalPostId}</span>
              )}
            </>
          }
        >
          <div className="between">
            <CreativeStatusBadge status={open.status} />
            <span className="cell-sub">via {open.source}</span>
          </div>

          {activeVersion && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="thumb lg"
              style={{ height: 300, marginTop: 14 }}
              src={activeVersion.imageUrl}
              alt=""
            />
          )}

          {open.failureReason && (
            <div
              className="card"
              style={{
                borderColor: 'var(--danger)',
                background: 'var(--danger-soft)',
                padding: 12,
                marginTop: 12,
              }}
            >
              <strong style={{ color: 'var(--danger)' }}>Publish failed</strong>
              <div className="cell-sub" style={{ color: 'var(--danger)' }}>
                {open.failureReason}
              </div>
            </div>
          )}

          <div className="divider" />
          <Field label="Caption">
            <Textarea readOnly value={activeVersion?.caption ?? ''} rows={3} />
          </Field>
          <div className="wrap-gap">
            {(activeVersion?.hashtags ?? []).map((h) => (
              <span key={h} className="badge blue">
                {h}
              </span>
            ))}
          </div>

          <div className="divider" />
          <strong>Versions</strong>
          <div className="wrap-gap mt-16">
            {open.versions.map((v, i) => (
              <button
                key={v.id}
                className={`chip ${v.id === open.activeVersionId ? 'active' : ''}`}
                onClick={() => setActiveVersion(open.id, v.id)}
              >
                v{i + 1} · {v.note}
              </button>
            ))}
          </div>

          <div className="divider" />
          <strong>History</strong>
          <div className="timeline mt-16">
            {open.history.map((h, i) => (
              <div className="ev" key={i}>
                <span className="when">{relTime(h.at)}</span>
                <span>
                  {h.label}
                  <div className="cell-sub">{h.by}</div>
                </span>
              </div>
            ))}
          </div>
        </Drawer>
      )}

      {rejecting && open && (
        <ConfirmDialog
          title="Reject creative"
          body={
            <div>
              <p>Give a short reason — it helps the next regeneration.</p>
              <input
                className="input"
                autoFocus
                placeholder="e.g. background too busy"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          }
          confirmLabel="Reject"
          danger
          onConfirm={() => {
            rejectCreative(open.id, by, rejectReason || 'no reason given');
            setRejectReason('');
            toast('Creative rejected');
          }}
          onClose={() => setRejecting(false)}
        />
      )}
    </>
  );
}
