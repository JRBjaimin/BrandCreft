'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useData } from '../../../lib/mock/store';
import { useBusiness } from '../../../lib/use-business';
import { Button, Card, Chips, EmptyState, Input, PageHeader, Thumb } from '../../../components/ui';
import { ProductStatusBadge } from '../../../components/status';
import { inr, relTime } from '../../../lib/format';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
];

export default function ProductsPage() {
  const { data } = useData();
  const ctx = useBusiness();
  const router = useRouter();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');

  const rows = useMemo(() => {
    if (!ctx) return [];
    return data.products
      .filter((p) => p.businessId === ctx.business.id)
      .filter((p) => (filter === 'all' ? true : p.status === filter))
      .filter((p) =>
        q.trim()
          ? `${p.name} ${p.sku} ${p.category} ${p.tags.join(' ')}`.toLowerCase().includes(q.toLowerCase())
          : true,
      );
  }, [data.products, ctx, filter, q]);

  if (!ctx) return null;

  return (
    <>
      <PageHeader
        title="Products"
        subtitle="Your catalogue. Everything here can feed a campaign or an AI creative."
        actions={
          <Link href="/products/new" className="btn primary">
            + Add product
          </Link>
        }
      />

      <div className="toolbar">
        <Input className="search input" placeholder="Search products…" value={q} onChange={(e) => setQ(e.target.value)} />
        <Chips options={FILTERS} value={filter} onChange={setFilter} />
      </div>

      <Card>
        {rows.length === 0 ? (
          <EmptyState
            icon="▦"
            title="No products match"
            hint={q || filter !== 'all' ? 'Try clearing filters.' : 'Add your first product to get started.'}
            action={
              <Link href="/products/new" className="btn primary">
                + Add product
              </Link>
            }
          />
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.id} className="row-link" onClick={() => router.push(`/products/${p.id}`)}>
                    <td>
                      <div className="row">
                        <Thumb src={p.imageUrls[0] ?? ''} alt={p.name} />
                        <div className="stack">
                          <span className="cell-primary">{p.name}</span>
                          <span className="cell-sub mono">{p.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td>{p.category}</td>
                    <td>{inr(p.price)}</td>
                    <td>
                      <ProductStatusBadge status={p.status} />
                    </td>
                    <td className="cell-sub">{relTime(p.updatedAt)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/products/${p.id}`);
                        }}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
