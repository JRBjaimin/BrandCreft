'use client';

import { useState } from 'react';
import { useData } from '../lib/mock/store';
import { useToast } from './toast';
import { Modal } from './overlay';
import { Button, Field, Input, Select, Textarea } from './ui';
import { dateInput, daysAhead } from '../lib/format';
import type { Campaign, CampaignStatus } from '../lib/types';

export function CampaignFormModal({
  businessId,
  categoryKey,
  existing,
  onClose,
}: {
  businessId: string;
  categoryKey: string;
  existing?: Campaign;
  onClose: () => void;
}) {
  const { data, createCampaign, updateCampaign } = useData();
  const { toast } = useToast();

  const festivals = data.festivals.filter((f) => f.allowedCategories.includes(categoryKey));
  const products = data.products.filter((p) => p.businessId === businessId);

  const [name, setName] = useState(existing?.name ?? '');
  const [festivalKey, setFestivalKey] = useState(existing?.festivalKey ?? '');
  const [status, setStatus] = useState<CampaignStatus>(existing?.status ?? 'draft');
  const [startDate, setStartDate] = useState(dateInput(existing?.startDate ?? new Date().toISOString()));
  const [endDate, setEndDate] = useState(dateInput(existing?.endDate ?? daysAhead(14)));
  const [message, setMessage] = useState(existing?.message ?? '');
  const [cta, setCta] = useState(existing?.cta ?? '');
  const [theme, setTheme] = useState(existing?.theme ?? '');
  const [productIds, setProductIds] = useState<string[]>(existing?.productIds ?? []);
  const [err, setErr] = useState('');

  const toggleProduct = (id: string) =>
    setProductIds((xs) => (xs.includes(id) ? xs.filter((x) => x !== id) : [...xs, id]));

  const onFestival = (key: string) => {
    setFestivalKey(key);
    const f = festivals.find((x) => x.key === key);
    if (f && !cta) setCta(f.suggestedCta);
    if (f && !name) setName(`${f.name} Campaign`);
  };

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (name.trim().length < 2) return setErr('Give the campaign a name');
    if (new Date(endDate) < new Date(startDate)) return setErr('End date is before start date');
    setErr('');

    const payload = {
      businessId,
      name: name.trim(),
      festivalKey: festivalKey || null,
      status,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      message: message.trim(),
      cta: cta.trim(),
      theme: theme.trim(),
      productIds,
    };

    if (existing) {
      updateCampaign(existing.id, payload);
      toast('Campaign updated');
    } else {
      createCampaign(payload);
      toast('Campaign created');
    }
    onClose();
  };

  return (
    <Modal
      wide
      title={existing ? 'Edit campaign' : 'New campaign'}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={() => submit()}>
            {existing ? 'Save' : 'Create campaign'}
          </Button>
        </>
      }
    >
      <form onSubmit={submit}>
        <div className="form-grid">
          <Field label="Campaign name" full error={err || undefined}>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Janmashtami Gold Edit" />
          </Field>
          <Field label="Festival" hint="Gives the AI deterministic campaign context">
            <Select value={festivalKey} onChange={(e) => onFestival(e.target.value)}>
              <option value="">None</option>
              {festivals.map((f) => (
                <option key={f.key} value={f.key}>
                  {f.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Status">
            <Select value={status} onChange={(e) => setStatus(e.target.value as CampaignStatus)}>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="running">Running</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </Select>
          </Field>
          <Field label="Start date">
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </Field>
          <Field label="End date">
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </Field>
          <Field label="Campaign message" full>
            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={2} />
          </Field>
          <Field label="Call to action">
            <Input value={cta} onChange={(e) => setCta(e.target.value)} placeholder="Book an appointment" />
          </Field>
          <Field label="Visual theme / brand direction">
            <Input value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="Deep maroon, gold foil, peacock motifs" />
          </Field>
        </div>

        <div className="divider" />
        <strong>Products in this campaign</strong>
        <div className="wrap-gap mt-16">
          {products.length === 0 && <span className="muted">No products yet.</span>}
          {products.map((p) => (
            <button
              type="button"
              key={p.id}
              className={`chip ${productIds.includes(p.id) ? 'active' : ''}`}
              onClick={() => toggleProduct(p.id)}
            >
              {p.name}
            </button>
          ))}
        </div>
      </form>
    </Modal>
  );
}
