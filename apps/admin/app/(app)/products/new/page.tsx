'use client';

import { PageHeader, Card } from '../../../../components/ui';
import { ProductForm } from '../../../../components/product-form';
import { useBusiness } from '../../../../lib/use-business';

export default function NewProductPage() {
  const ctx = useBusiness();
  if (!ctx) return null;
  return (
    <>
      <PageHeader title="New product" subtitle={`Adding to ${ctx.business.name}`} />
      <Card pad>
        <ProductForm businessId={ctx.business.id} />
      </Card>
    </>
  );
}
