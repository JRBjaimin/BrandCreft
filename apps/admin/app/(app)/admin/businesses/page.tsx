'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useData } from '../../../../lib/mock/store';
import { useAuth } from '../../../../lib/auth';
import { useToast } from '../../../../components/toast';
import { Button, Card, EmptyState, Field, Input, PageHeader, Select } from '../../../../components/ui';
import { Modal } from '../../../../components/overlay';
import { BusinessStatusBadge } from '../../../../components/status';
import { dateLabel } from '../../../../lib/format';

export default function AdminBusinessesPage() {
  const { data, createBusiness, setBusinessStatus } = useData();
  const { setActiveBusiness } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [f, setF] = useState({ name: '', ownerName: '', email: '', phone: '', categoryKey: 'jewellery' });
  const [err, setErr] = useState('');

  const create = () => {
    if (f.name.trim().length < 2) return setErr('Business name required');
    if (!f.email.includes('@')) return setErr('Valid owner email required');
    setErr('');
    createBusiness(f);
    toast('Business created');
    setCreating(false);
    setF({ name: '', ownerName: '', email: '', phone: '', categoryKey: 'jewellery' });
  };

  return (
    <>
      <PageHeader
        title="Businesses"
        subtitle="Every tenant on the platform."
        actions={
          <Button variant="primary" onClick={() => setCreating(true)}>
            + Create business
          </Button>
        }
      />

      <Card>
        {data.businesses.length === 0 ? (
          <EmptyState icon="▤" title="No businesses" />
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Business</th>
                  <th>Category</th>
                  <th>Plan</th>
                  <th>Owner</th>
                  <th>Created</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {data.businesses.map((b) => {
                  const owner = data.users.find((u) => u.id === b.ownerUserId);
                  return (
                    <tr key={b.id}>
                      <td>
                        <div className="stack">
                          <span className="cell-primary">{b.name}</span>
                          <span className="cell-sub mono">{b.slug}</span>
                        </div>
                      </td>
                      <td>{data.categories.find((c) => c.key === b.categoryKey)?.label ?? b.categoryKey}</td>
                      <td style={{ textTransform: 'capitalize' }}>{b.plan}</td>
                      <td className="cell-sub">{owner?.email ?? '—'}</td>
                      <td className="cell-sub">{dateLabel(b.createdAt)}</td>
                      <td>
                        <BusinessStatusBadge status={b.status} />
                      </td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setActiveBusiness(b.id);
                            router.push('/dashboard');
                          }}
                        >
                          Open
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            const next = b.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
                            setBusinessStatus(b.id, next);
                            toast(`${b.name} ${next === 'ACTIVE' ? 'enabled' : 'disabled'}`);
                          }}
                        >
                          {b.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {creating && (
        <Modal
          title="Create business"
          onClose={() => setCreating(false)}
          footer={
            <>
              <Button onClick={() => setCreating(false)}>Cancel</Button>
              <Button variant="primary" onClick={create}>
                Create
              </Button>
            </>
          }
        >
          {err && <div className="field err" style={{ marginBottom: 12 }}>{err}</div>}
          <Field label="Business name">
            <Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          </Field>
          <Field label="Category">
            <Select value={f.categoryKey} onChange={(e) => setF({ ...f, categoryKey: e.target.value })}>
              {data.categories.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Owner name">
            <Input value={f.ownerName} onChange={(e) => setF({ ...f, ownerName: e.target.value })} />
          </Field>
          <Field label="Owner email">
            <Input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
          </Field>
          <Field label="Phone">
            <Input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
          </Field>
        </Modal>
      )}
    </>
  );
}
