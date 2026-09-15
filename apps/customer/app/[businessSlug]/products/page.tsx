import { notFound } from 'next/navigation';
import { dataProvider } from '../../../lib/data';
import { ProductCatalogue } from '../../../components/storefront/ProductCatalogue';

export default async function CataloguePage({ params }: { params: { businessSlug: string } }) {
  const business = await dataProvider.getBusinessBySlug(params.businessSlug);
  if (!business || business.status !== 'ACTIVE') notFound();

  const products = await dataProvider.listProducts(business.id);

  return (
    <section className="section container">
      <div className="section-head">
        <h2>{business.name} — Catalogue</h2>
      </div>
      <ProductCatalogue businessSlug={business.slug} businessId={business.id} products={products} />
    </section>
  );
}
