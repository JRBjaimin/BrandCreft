'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useData } from '../../../../lib/mock/store';
import { useToast } from '../../../../components/toast';
import { ProductForm } from '../../../../components/product-form';
import { Button, Card, EmptyState, PageHeader, Thumb } from '../../../../components/ui';
import { ConfirmDialog } from '../../../../components/overlay';

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const { data, deleteProduct } = useData();
  const { toast } = useToast();
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);

  const product = data.products.find((p) => p.id === params.id);

  if (!product) {
    return (
      <Card>
        <EmptyState
          icon="▦"
          title="Product not found"
          hint="It may have been deleted."
          action={
            <Button variant="primary" onClick={() => router.push('/products')}>
              Back to products
            </Button>
          }
        />
      </Card>
    );
  }

  return (
    <>
      <PageHeader
        title={product.name}
        subtitle={`SKU ${product.sku}`}
        actions={
          <Button variant="danger" onClick={() => setConfirm(true)}>
            Delete
          </Button>
        }
      />

      <div className="grid cols-2" style={{ alignItems: 'start' }}>
        <Card pad>
          <ProductForm businessId={product.businessId} existing={product} />
        </Card>
        <Card pad>
          <strong>Images</strong>
          <div className="wrap-gap mt-16">
            {product.imageUrls.map((u, i) => (
              <Thumb key={i} src={u} alt={`${product.name} ${i + 1}`} size="lg" />
            ))}
          </div>
          <div className="divider" />
          <strong>AI-safe facts</strong>
          <ul className="muted" style={{ marginTop: 8, paddingLeft: 18 }}>
            {product.aiFacts.length ? product.aiFacts.map((f, i) => <li key={i}>{f}</li>) : <li>None set</li>}
          </ul>
        </Card>
      </div>

      {confirm && (
        <ConfirmDialog
          title="Delete product?"
          body={`"${product.name}" will be removed from the catalogue. This cannot be undone.`}
          confirmLabel="Delete product"
          danger
          onConfirm={() => {
            deleteProduct(product.id);
            toast('Product deleted');
            router.push('/products');
          }}
          onClose={() => setConfirm(false)}
        />
      )}
    </>
  );
}
