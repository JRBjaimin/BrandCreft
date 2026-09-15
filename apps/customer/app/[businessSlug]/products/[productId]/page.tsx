import Link from 'next/link';
import { notFound } from 'next/navigation';
import { dataProvider } from '../../../../lib/data';
import { inr } from '../../../../lib/format';
import { productEnquiryMessage } from '../../../../lib/whatsapp';
import { ProductMedia } from '../../../../components/storefront/ProductMedia';
import { FavouriteButton } from '../../../../components/storefront/FavouriteButton';
import { WhatsAppButton } from '../../../../components/storefront/WhatsAppButton';
import { ShareButton } from '../../../../components/storefront/ShareButton';
import { QrCode } from '../../../../components/storefront/QrCode';
import { Badge } from '../../../../components/ui';

export default async function ProductDetailPage({
  params,
}: {
  params: { businessSlug: string; productId: string };
}) {
  const business = await dataProvider.getBusinessBySlug(params.businessSlug);
  if (!business || business.status !== 'ACTIVE') notFound();

  const product = await dataProvider.getProduct(business.id, params.productId);
  if (!product) notFound();

  const url = `https://storefront.brandcraft.example/${business.slug}/products/${product.id}`;

  return (
    <section className="section container">
      <div className="breadcrumb">
        <Link href={`/${business.slug}`}>{business.name}</Link>
        <span>/</span>
        <Link href={`/${business.slug}/products`}>Catalogue</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <div className="detail-grid">
        <div style={{ position: 'relative' }}>
          <div className="gallery-main">
            <ProductMedia product={product} />
          </div>
          <div style={{ position: 'absolute', top: 12, right: 12 }}>
            <FavouriteButton businessId={business.id} productId={product.id} />
          </div>
        </div>

        <div>
          <span className="product-category">{product.category}</span>
          <h1 style={{ fontSize: 26, marginTop: 6 }}>{product.name}</h1>
          <div className="row" style={{ marginTop: 10 }}>
            <span style={{ fontSize: 22, fontWeight: 700 }}>{inr(product.price)}</span>
            <Badge tone={product.available ? 'success' : 'danger'}>
              {product.available ? 'In stock' : 'Out of stock'}
            </Badge>
          </div>
          <p className="muted" style={{ marginTop: 14 }}>
            {product.description}
          </p>

          {product.attributes.length > 0 && (
            <dl className="attribute-list">
              {product.attributes.map((attr) => (
                <div key={attr.label}>
                  <dt>{attr.label}</dt>
                  <dd>{attr.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="action-row">
            <WhatsAppButton
              businessId={business.id}
              productId={product.id}
              phone={business.contact.whatsappPhone}
              message={productEnquiryMessage(business.name, product.name)}
            />
            <ShareButton title={product.name} url={url} />
          </div>

          <div className="qr-box">
            <QrCode url={url} />
            <div className="stack">
              <strong>Scan to open this product</strong>
              <span className="muted" style={{ fontSize: 13 }}>
                Share this at your counter or in a catalogue.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky-cta">
        <WhatsAppButton
          businessId={business.id}
          productId={product.id}
          phone={business.contact.whatsappPhone}
          message={productEnquiryMessage(business.name, product.name)}
          size="sm"
        />
        <FavouriteButton businessId={business.id} productId={product.id} />
      </div>
    </section>
  );
}
