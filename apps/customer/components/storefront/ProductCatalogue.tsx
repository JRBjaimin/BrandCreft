'use client';

import { useMemo, useState } from 'react';
import type { Product } from '@brandcraft/storefront-data';
import { StaggerGroup, StaggerItem } from '@brandcraft/motion';
import { Chips, EmptyState } from '../ui';
import { ProductCard } from './ProductCard';

export function ProductCatalogue({
  businessSlug,
  businessId,
  products,
}: {
  businessSlug: string;
  businessId: string;
  products: Product[];
}) {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return [
      { value: 'all', label: 'All' },
      ...Array.from(set).map((c) => ({ value: c, label: c })),
    ];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (q.trim() && !`${p.name} ${p.tags.join(' ')}`.toLowerCase().includes(q.toLowerCase()))
        return false;
      return true;
    });
  }, [products, category, q]);

  return (
    <div>
      <div className="between" style={{ marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <input
          className="search-input"
          placeholder="Search products…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Chips options={categories} value={category} onChange={setCategory} />
      </div>
      {filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No products match"
          hint="Try a different search or category."
        />
      ) : (
        <StaggerGroup className="product-grid" trigger="mount">
          {filtered.map((p) => (
            <StaggerItem key={p.id}>
              <ProductCard businessSlug={businessSlug} businessId={businessId} product={p} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      )}
    </div>
  );
}
