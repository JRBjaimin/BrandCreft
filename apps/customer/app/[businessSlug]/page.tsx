import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Reveal, StaggerGroup, StaggerItem } from '@brandcraft/motion';
import { dataProvider } from '../../lib/data';
import { generalEnquiryMessage } from '../../lib/whatsapp';
import { BusinessHero } from '../../components/storefront/BusinessHero';
import { OfferRibbon } from '../../components/storefront/OfferRibbon';
import { RatesWidget } from '../../components/storefront/RatesWidget';
import { ProductCard } from '../../components/storefront/ProductCard';
import { WhatsAppButton } from '../../components/storefront/WhatsAppButton';
import { ShareButton } from '../../components/storefront/ShareButton';
import { QrCode } from '../../components/storefront/QrCode';

export default async function BusinessLandingPage({
  params,
}: {
  params: { businessSlug: string };
}) {
  const business = await dataProvider.getBusinessBySlug(params.businessSlug);
  if (!business || business.status !== 'ACTIVE') notFound();

  const [products, offers, rates] = await Promise.all([
    dataProvider.listProducts(business.id),
    dataProvider.listOffers(business.id),
    dataProvider.getRates(business.id),
  ]);

  const featured = products.slice(0, 8);
  const url = `https://storefront.brandcraft.example/${business.slug}`;

  return (
    <>
      <BusinessHero business={business} />
      <OfferRibbon offers={offers} />

      {rates.length > 0 && (
        <Reveal>
          <section className="section container">
            <div className="section-head">
              <h2>Today&apos;s rates</h2>
              <Link href={`/${business.slug}/rates`} className="muted">
                Full history →
              </Link>
            </div>
            <RatesWidget rates={rates} />
          </section>
        </Reveal>
      )}

      <Reveal>
        <section className="section container">
          <div className="section-head">
            <h2>Catalogue</h2>
            <Link href={`/${business.slug}/products`} className="muted">
              View all ({products.length}) →
            </Link>
          </div>
          <StaggerGroup className="product-grid">
            {featured.map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard
                  businessSlug={business.slug}
                  businessId={business.id}
                  product={product}
                />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </section>
      </Reveal>

      <Reveal>
        <section className="section container">
          <div className="section-head">
            <h2>Get in touch</h2>
          </div>
          <div className="action-row">
            <WhatsAppButton
              businessId={business.id}
              productId={null}
              phone={business.contact.whatsappPhone}
              message={generalEnquiryMessage(business.name)}
            />
            <ShareButton title={business.name} url={url} />
          </div>
          <div className="qr-box">
            <QrCode url={url} />
            <div className="stack">
              <strong>Scan to open this storefront</strong>
              <span className="muted" style={{ fontSize: 13 }}>
                Perfect for a counter display or a printed flyer.
              </span>
            </div>
          </div>
        </section>
      </Reveal>
    </>
  );
}
