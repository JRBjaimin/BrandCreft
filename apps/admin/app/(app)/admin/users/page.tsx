'use client';

import { useMemo, useState } from 'react';
import { useData } from '../../../../lib/mock/store';
import { useToast } from '../../../../components/toast';
import { Badge, Button, Card, EmptyState, Field, Input, PageHeader, Select } from '../../../../components/ui';
import { Modal } from '../../../../components/overlay';
import { initials, relTime } from '../../../../lib/format';
import type { Role, User } from '../../../../lib/types';

const ROLES: Role[] = ['SUPER_ADMIN', 'BUSINESS_OWNER', 'BUSINESS_ADMIN', 'BUSINESS_STAFF'];

export default function AdminUsersPage() {
  const { data, createUser, setUserActive, setUserRoles } = useData();
  const { toast } = useToast();
  const [q, setQ] = useState('');
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [f, setF] = useState<{ name: string; email: string; role: Role; businessId: string }>({
    name: '',
    email: '',
    role: 'BUSINESS_STAFF',
    businessId: data.businesses[0]?.id ?? '',
  });

  const rows = useMemo(
    () =>
      data.users.filter((u) =>
        q ? `${u.name} ${u.email} ${u.roles.join(' ')}`.toLowerCase().includes(q.toLowerCase()) : true,
      ),
    [data.users, q],
  );

  const bizName = (id: string | null) =>
    id ? data.businesses.find((b) => b.id === id)?.name ?? '—' : 'Platform';

  return (
    <>
      <PageHeader
        title="Users"
        subtitle="People with access to the platform or a business console."
        actions={
          <Button variant="primary" onClick={() => setCreating(true)}>
            + Add user
          </Button>
        }
      />

      <div className="toolbar">
        <Input className="search input" placeholder="Search users…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <Card>
        {rows.length === 0 ? (
          <EmptyState icon="☺" title="No users match" />
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Roles</th>
                  <th>Scope</th>
                  <th>Last active</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="row">
                        <span className="avatar">{initials(u.name)}</span>
                        <div className="stack">
                          <span className="cell-primary">{u.name}</span>
                          <span className="cell-sub">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="wrap-gap">
                        {u.roles.map((r) => (
                          <Badge key={r} tone={r === 'SUPER_ADMIN' ? 'violet' : 'grey'}>
                            {r.replace('BUSINESS_', '').toLowerCase()}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="cell-sub">{bizName(u.businessId)}</td>
                    <td className="cell-sub">{relTime(u.lastActiveAt)}</td>
                    <td>
                      {u.isActive ? <Badge tone="green" dot>Active</Badge> : <Badge tone="grey" dot>Disabled</Badge>}
                    </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <Button size="sm" variant="ghost" onClick={() => setEditing(u)}>
                        Roles
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setUserActive(u.id, !u.isActive);
                          toast(`${u.name} ${u.isActive ? 'disabled' : 'enabled'}`);
                        }}
                      >
                        {u.isActive ? 'Disable' : 'Enable'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {creating && (
        <Modal
          title="Add user"
          onClose={() => setCreating(false)}
          footer={
            <>
              <Button onClick={() => setCreating(false)}>Cancel</Button>
              <Button
                variant="primary"
                onClick={() => {
                  if (!f.name || !f.email.includes('@')) return;
                  createUser({
                    name: f.name,
                    email: f.email,
                    roles: [f.role],
                    businessId: f.role === 'SUPER_ADMIN' ? null : f.businessId,
                  });
                  toast('User added');
                  setCreating(false);
                  setF({ ...f, name: '', email: '' });
                }}
              >
                Add user
              </Button>
            </>
          }
        >
          <Field label="Name">
            <Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          </Field>
          <Field label="Email">
            <Input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
          </Field>
          <Field label="Role">
            <Select value={f.role} onChange={(e) => setF({ ...f, role: e.target.value as Role })}>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </Field>
          {f.role !== 'SUPER_ADMIN' && (
            <Field label="Business">
              <Select value={f.businessId} onChange={(e) => setF({ ...f, businessId: e.target.value })}>
                {data.businesses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </Select>
            </Field>
          )}
        </Modal>
      )}

      {editing && (
        <Modal
          title={`Roles — ${editing.name}`}
          onClose={() => setEditing(null)}
          footer={<Button onClick={() => setEditing(null)}>Done</Button>}
        >
          <div className="stack" style={{ gap: 8 }}>
            {ROLES.map((r) => {
              const on = editing.roles.includes(r);
              return (
                <button
                  key={r}
                  className={`chip ${on ? 'active' : ''}`}
                  style={{ textAlign: 'left', padding: '10px 12px' }}
                  onClick={() => {
                    const next = on ? editing.roles.filter((x) => x !== r) : [...editing.roles, r];
                    setUserRoles(editing.id, next);
                    setEditing({ ...editing, roles: next });
                  }}
                >
                  {on ? '✓ ' : ''}
                  {r}
                </button>
              );
            })}
          </div>
        </Modal>
      )}
    </>
  );
}
