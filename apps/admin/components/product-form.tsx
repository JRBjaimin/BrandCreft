'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useData } from '../lib/mock/store';
import { useToast } from './toast';
import { Button, Field, Input, Select, Textarea } from './ui';
import { placeholder, slugify } from '../lib/format';
import type { Product, ProductStatus } from '../lib/types';

type Draft = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'currency'>;

function emptyDraft(businessId: string): Draft {
  return {
    businessId,
    name: '',
    sku: '',
    category: '',
    description: '',
    price: null,
    available: true,
    status: 'draft',
    tags: [],
    imageUrls: [],
    attributes: [],
    aiFacts: [],
  };
}

export function ProductForm({ businessId, existing }: { businessId: string; existing?: Product }) {
  const { createProduct, updateProduct } = useData();
  const { toast } = useToast();
  const router = useRouter();

  const [d, setD] = useState<Draft>(existing ?? emptyDraft(businessId));
  const [tagText, setTagText] = useState(existing?.tags.join(', ') ?? '');
  const [factsText, setFactsText] = useState(existing?.aiFacts.join('\n') ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((p) => ({ ...p, [k]: v }));

  const setAttr = (i: number, key: 'label' | 'value', v: string) =>
    setD((p) => ({
      ...p,
      attributes: p.attributes.map((a, idx) => (idx === i ? { ...a, [key]: v } : a)),
    }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (d.name.trim().length < 2) errs.name = 'Name is required';
    if (!d.category.trim()) errs.category = 'Pick a category';
    if (d.price != null && d.price < 0) errs.price = 'Price cannot be negative';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const payload: Draft = {
      ...d,
      sku: d.sku.trim() || `SKU-${slugify(d.name).slice(0, 12).toUpperCase()}`,
      tags: tagText.split(',').map((t) => t.trim()).filter(Boolean),
      aiFacts: factsText.split('\n').map((t) => t.trim()).filter(Boolean),
      attributes: d.attributes.filter((a) => a.label.trim() && a.value.trim()),
      imageUrls: d.imageUrls.length ? d.imageUrls : [placeholder(d.name || 'product', d.category)],
    };

    if (existing) {
      updateProduct(existing.id, payload);
      toast('Product updated');
    } else {
      createProduct(payload);
      toast('Product created');
    }
    router.push('/products');
  };

  return (
    <form onSubmit={submit}>
      <div className="form-grid">
        <Field label="Product name" error={errors.name} full>
          <Input value={d.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Antara Bridal Necklace Set" />
        </Field>
        <Field label="SKU" hint="Auto-generated if left blank">
          <Input value={d.sku} onChange={(e) => set('sku', e.target.value)} />
        </Field>
        <Field label="Category" error={errors.category}>
          <Input value={d.category} onChange={(e) => set('category', e.target.value)} placeholder="Bridal / Rings / Cakes …" />
        </Field>
        <Field label="Price (INR)" error={errors.price} hint="Leave blank to hide price">
          <Input
            type="number"
            value={d.price ?? ''}
            onChange={(e) => set('price', e.target.value === '' ? null : Number(e.target.value))}
          />
        </Field>
        <Field label="Status">
          <Select value={d.status} onChange={(e) => set('status', e.target.value as ProductStatus)}>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </Select>
        </Field>
        <Field label="Description" full>
          <Textarea value={d.description} onChange={(e) => set('description', e.target.value)} rows={3} />
        </Field>
        <Field label="Tags" hint="Comma-separated" full>
          <Input value={tagText} onChange={(e) => setTagText(e.target.value)} placeholder="bridal, gold, 22k" />
        </Field>
        <Field label="Availability">
          <Select value={d.available ? 'yes' : 'no'} onChange={(e) => set('available', e.target.value === 'yes')}>
            <option value="yes">In stock</option>
            <option value="no">Out of stock</option>
          </Select>
        </Field>
      </div>

      <div className="divider" />
      <div className="between" style={{ marginBottom: 10 }}>
        <strong>Attributes</strong>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => setD((p) => ({ ...p, attributes: [...p.attributes, { label: '', value: '' }] }))}
        >
          + Add attribute
        </Button>
      </div>
      {d.attributes.map((a, i) => (
        <div className="row" key={i} style={{ marginBottom: 8 }}>
          <Input placeholder="Label" value={a.label} onChange={(e) => setAttr(i, 'label', e.target.value)} />
          <Input placeholder="Value" value={a.value} onChange={(e) => setAttr(i, 'value', e.target.value)} />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setD((p) => ({ ...p, attributes: p.attributes.filter((_, idx) => idx !== i) }))}
          >
            Remove
          </Button>
        </div>
      ))}

      <div className="divider" />
      <Field
        label="AI-safe product facts"
        hint="One per line. The AI engine may only state these facts — no invented specs, prices or claims."
      >
        <Textarea value={factsText} onChange={(e) => setFactsText(e.target.value)} rows={4} />
      </Field>

      <div className="btn-row mt-16">
        <Button variant="primary" type="submit">
          {existing ? 'Save changes' : 'Create product'}
        </Button>
        <Button type="button" onClick={() => router.push('/products')}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
