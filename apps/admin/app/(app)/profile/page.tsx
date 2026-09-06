'use client';

import { useState } from 'react';
import { useData } from '../../../lib/mock/store';
import { useBusiness } from '../../../lib/use-business';
import { useToast } from '../../../components/toast';
import { Button, Card, Field, Input, PageHeader, Select, Swatch, Textarea, Thumb } from '../../../components/ui';
import type { Business } from '../../../lib/types';

type Tab = 'profile' | 'branding' | 'contact';

export default function ProfilePage() {
  const { data, updateBusiness } = useData();
  const { toast } = useToast();
  const ctx = useBusiness();
  const [tab, setTab] = useState<Tab>('profile');
  const [form, setForm] = useState<Business | null>(null);

  if (!ctx) return null;
  const business = form ?? ctx.business;
  const set = (patch: Partial<Business>) => setForm({ ...business, ...patch });
  const dirty = form !== null && JSON.stringify(form) !== JSON.stringify(ctx.business);

  const save = () => {
    if (form) updateBusiness(business.id, form);
    setForm(null);
    toast('Business profile saved');
  };

  return (
    <>
      <PageHeader
        title="Business profile"
        subtitle="Details, branding and contact info. Branding feeds every AI creative."
        actions={
          <>
            {dirty && (
              <Button variant="ghost" onClick={() => setForm(null)}>
                Discard
              </Button>
            )}
            <Button variant="primary" disabled={!dirty} onClick={save}>
              Save changes
            </Button>
          </>
        }
      />

      <div className="tabs">
        {(['profile', 'branding', 'contact'] as Tab[]).map((t) => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'profile' ? 'Profile' : t === 'branding' ? 'Branding' : 'Contact & social'}
          </button>
        ))}
      </div>

      <Card pad>
        {tab === 'profile' && (
          <div className="form-grid">
            <Field label="Business name">
              <Input value={business.name} onChange={(e) => set({ name: e.target.value })} />
            </Field>
            <Field label="Category">
              <Select value={business.categoryKey} onChange={(e) => set({ categoryKey: e.target.value })}>
                {data.categories.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="GSTIN">
              <Input value={business.gstin} onChange={(e) => set({ gstin: e.target.value })} />
            </Field>
            <Field label="Plan">
              <Select value={business.plan} onChange={(e) => set({ plan: e.target.value as Business['plan'] })}>
                <option value="trial">Trial</option>
                <option value="starter">Starter</option>
                <option value="growth">Growth</option>
                <option value="enterprise">Enterprise</option>
              </Select>
            </Field>
            <Field label="Description" full>
              <Textarea value={business.description} onChange={(e) => set({ description: e.target.value })} rows={3} />
            </Field>
          </div>
        )}

        {tab === 'branding' && (
          <div>
            <div className="wrap-gap" style={{ marginBottom: 18 }}>
              <div className="stack">
                <span className="faint">Logo</span>
                <Thumb src={business.branding.logoUrl ?? ''} alt="logo" size="lg" />
              </div>
              <div className="stack" style={{ flex: 1, minWidth: 200 }}>
                <span className="faint">Cover</span>
                <Thumb src={business.branding.coverUrl ?? ''} alt="cover" size="lg" />
              </div>
            </div>
            <Field label="Brand colours" hint="Comma-separated hex values">
              <Input
                value={business.branding.colors.join(', ')}
                onChange={(e) =>
                  set({
                    branding: {
                      ...business.branding,
                      colors: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    },
                  })
                }
              />
            </Field>
            <div className="wrap-gap" style={{ marginBottom: 16 }}>
              {business.branding.colors.map((c) => (
                <span key={c} className="row" style={{ gap: 6 }}>
                  <Swatch color={c} />
                  <span className="mono">{c}</span>
                </span>
              ))}
            </div>
            <Field label="Brand tone" hint="How the AI should write captions and style visuals">
              <Textarea
                value={business.branding.tone}
                onChange={(e) => set({ branding: { ...business.branding, tone: e.target.value } })}
                rows={3}
              />
            </Field>
          </div>
        )}

        {tab === 'contact' && (
          <div className="form-grid">
            <Field label="Phone">
              <Input value={business.phone} onChange={(e) => set({ phone: e.target.value })} />
            </Field>
            <Field label="Email">
              <Input value={business.email} onChange={(e) => set({ email: e.target.value })} />
            </Field>
            <Field label="Address line 1" full>
              <Input
                value={business.address.line1}
                onChange={(e) => set({ address: { ...business.address, line1: e.target.value } })}
              />
            </Field>
            <Field label="City">
              <Input
                value={business.address.city}
                onChange={(e) => set({ address: { ...business.address, city: e.target.value } })}
              />
            </Field>
            <Field label="State">
              <Input
                value={business.address.state}
                onChange={(e) => set({ address: { ...business.address, state: e.target.value } })}
              />
            </Field>
            <Field label="Pincode">
              <Input
                value={business.address.pincode}
                onChange={(e) => set({ address: { ...business.address, pincode: e.target.value } })}
              />
            </Field>
            <Field label="Instagram handle">
              <Input
                value={business.socials.instagram ?? ''}
                onChange={(e) => set({ socials: { ...business.socials, instagram: e.target.value } })}
              />
            </Field>
            <Field label="Website">
              <Input
                value={business.socials.website ?? ''}
                onChange={(e) => set({ socials: { ...business.socials, website: e.target.value } })}
              />
            </Field>
          </div>
        )}
      </Card>
    </>
  );
}
