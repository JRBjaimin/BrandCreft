'use client';

import { useData } from '../../../lib/mock/store';
import { useBusiness } from '../../../lib/use-business';
import { useToast } from '../../../components/toast';
import { Button, Card, CardHead, EmptyState, PageHeader } from '../../../components/ui';
import { IntegrationBadge } from '../../../components/status';
import { dateLabel, relTime } from '../../../lib/format';

export default function IntegrationsPage() {
  const { data, setIntegration } = useData();
  const { toast } = useToast();
  const ctx = useBusiness();
  if (!ctx) return null;

  const integ = data.integrations.find((i) => i.businessId === ctx.business.id);
  const publishHistory = data.creatives
    .filter((c) => c.businessId === ctx.business.id && (c.status === 'PUBLISHED' || c.status === 'FAILED'))
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  if (!integ) {
    return (
      <>
        <PageHeader title="Integrations" />
        <Card>
          <EmptyState icon="⇄" title="No integration record" />
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Integrations"
        subtitle="Connect the channels BrandCraft publishes to and receives creatives from."
      />

      <div className="grid cols-2">
        <Card>
          <CardHead title="Instagram">
            <IntegrationBadge state={integ.instagram.state} />
          </CardHead>
          <div className="card-pad">
            <dl className="kv">
              <dt>Account</dt>
              <dd>{integ.instagram.accountHandle ?? '—'}</dd>
              <dt>Token expires</dt>
              <dd>
                {integ.instagram.tokenExpiresAt ? dateLabel(integ.instagram.tokenExpiresAt) : '—'}
                {integ.instagram.state === 'error' && (
                  <span className="badge red" style={{ marginLeft: 8 }}>
                    expired
                  </span>
                )}
              </dd>
              <dt>Last publish</dt>
              <dd>{integ.instagram.lastPublishAt ? relTime(integ.instagram.lastPublishAt) : 'never'}</dd>
            </dl>
            <div className="btn-row mt-16">
              {integ.instagram.state === 'connected' ? (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIntegration(ctx.business.id, 'instagram', false);
                    toast('Instagram disconnected');
                  }}
                >
                  Disconnect
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => {
                    setIntegration(ctx.business.id, 'instagram', true);
                    toast('Instagram connected');
                  }}
                >
                  {integ.instagram.state === 'error' ? 'Reconnect' : 'Connect Instagram'}
                </Button>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <CardHead title="WhatsApp">
            <IntegrationBadge state={integ.whatsapp.state} />
          </CardHead>
          <div className="card-pad">
            <dl className="kv">
              <dt>Business number</dt>
              <dd>{integ.whatsapp.phoneNumber ?? '—'}</dd>
              <dt>Display name</dt>
              <dd>{integ.whatsapp.displayName ?? '—'}</dd>
              <dt>Last event</dt>
              <dd>{integ.whatsapp.lastEventAt ? relTime(integ.whatsapp.lastEventAt) : 'never'}</dd>
            </dl>
            <div className="btn-row mt-16">
              {integ.whatsapp.state === 'connected' ? (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIntegration(ctx.business.id, 'whatsapp', false);
                    toast('WhatsApp disconnected');
                  }}
                >
                  Disconnect
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => {
                    setIntegration(ctx.business.id, 'whatsapp', true);
                    toast('WhatsApp connected');
                  }}
                >
                  Connect WhatsApp
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>

      <Card className="mt-24">
        <CardHead title="Publishing history" />
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Product</th>
                <th>Result</th>
                <th>External post</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {publishHistory.length === 0 && (
                <tr>
                  <td colSpan={4} className="muted" style={{ textAlign: 'center', padding: 28 }}>
                    Nothing published yet.
                  </td>
                </tr>
              )}
              {publishHistory.map((c) => (
                <tr key={c.id}>
                  <td className="cell-primary">
                    {data.products.find((p) => p.id === c.productId)?.name ?? 'Product'}
                  </td>
                  <td>
                    {c.status === 'PUBLISHED' ? (
                      <span className="badge green">Published</span>
                    ) : (
                      <span className="badge red">Failed</span>
                    )}
                  </td>
                  <td className="mono">{c.externalPostId ?? (c.failureReason ? 'see error' : '—')}</td>
                  <td className="cell-sub">{relTime(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
