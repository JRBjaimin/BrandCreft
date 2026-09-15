import type { Product } from '@brandcraft/storefront-data';
import { initials } from '../../lib/format';

export function ProductMedia({ product }: { product: Product }) {
  const image = product.imageUrls[0];
  return (
    <div className="product-media">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element -- arbitrary business-supplied URL, no fixed remote host to allow-list yet
        <img src={image} alt={product.name} />
      ) : (
        <div className="product-placeholder" aria-hidden>
          {initials(product.name)}
        </div>
      )}
    </div>
  );
}
