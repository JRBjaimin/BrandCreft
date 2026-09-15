import { notFound } from 'next/navigation';
import { dataProvider } from '../../../lib/data';
import { RatesWidget } from '../../../components/storefront/RatesWidget';

export default async function RatesPage({ params }: { params: { businessSlug: string } }) {
  const business = await dataProvider.getBusinessBySlug(params.businessSlug);
  if (!business || business.status !== 'ACTIVE' || !business.category.rateModuleEnabled) notFound();

  const rates = await dataProvider.getRates(business.id);
  const historyEntries = await Promise.all(
    rates.map(async (r) => [r.metal, await dataProvider.getRateHistory(business.id, r.metal)] as const),
  );
  const history = Object.fromEntries(historyEntries);

  return (
    <section className="section container">
      <div className="section-head">
        <h2>{business.name} — Today&apos;s rates</h2>
      </div>
      <p className="muted" style={{ marginTop: -10, marginBottom: 20, maxWidth: 560 }}>
        Reference rates shown for guidance. These are not automatically the shop&apos;s final selling
        price — confirm with {business.name} before purchase.
      </p>
      <RatesWidget rates={rates} history={history} />
    </section>
  );
}
