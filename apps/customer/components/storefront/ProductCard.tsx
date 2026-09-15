'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import type { Product } from '@brandcraft/storefront-data';
import { SPRING_SNAPPY } from '@brandcraft/motion';
import { inr } from '../../lib/format';
import { ProductMedia } from './ProductMedia';
import { FavouriteButton } from './FavouriteButton';

export function ProductCard({
  businessSlug,
  businessId,
  product,
}: {
  businessSlug: string;
  businessId: string;
  product: Product;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="product-card-wrap" style={{ position: 'relative' }}>
      <motion.div
        whileHover={reduceMotion ? undefined : { y: -8 }}
        transition={SPRING_SNAPPY}
        style={{ height: '100%' }}
      >
        <Link
          href={`/${businessSlug}/products/${product.id}`}
          className="product-card"
          style={{ height: '100%' }}
        >
          <ProductMedia product={product} />
          <div className="product-body">
            <span className="product-category">{product.category}</span>
            <span className="product-name">{product.name}</span>
            <span className="product-price">
              {inr(product.price)}
              {!product.available && <span className="unit"> · Out of stock</span>}
            </span>
          </div>
        </Link>
      </motion.div>
      <FavouriteButton businessId={businessId} productId={product.id} stopNavigation />
    </div>
  );
}
