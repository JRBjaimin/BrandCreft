'use client';

import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { Business } from '@brandcraft/storefront-data';
import { initials } from '../../lib/format';

export function SiteHeader({ business }: { business?: Business }) {
  const { scrollY } = useScroll();
  const reduceMotion = useReducedMotion();
  const padding = useTransform(scrollY, [0, 120], [14, 8]);
  const markSize = useTransform(scrollY, [0, 120], [36, 28]);

  return (
    <header className="site-header">
      <motion.div
        className="site-header-inner"
        style={reduceMotion ? undefined : { paddingTop: padding, paddingBottom: padding }}
      >
        <Link href={business ? `/${business.slug}` : '/'} className="row">
          <motion.span
            className="brand-mark"
            style={reduceMotion ? undefined : { width: markSize, height: markSize }}
          >
            {business?.branding.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- arbitrary business-supplied URL, no fixed remote host to allow-list yet
              <img src={business.branding.logoUrl} alt="" />
            ) : (
              initials(business?.name ?? 'BrandCraft')
            )}
          </motion.span>
          <span className="stack">
            <span className="site-header-name">{business?.name ?? 'BrandCraft'}</span>
            {business && <span className="site-header-sub">{business.category.label}</span>}
          </span>
        </Link>
        <div className="spacer" />
        {business && (
          <nav className="row" style={{ gap: 18, fontSize: 13 }}>
            <Link href={`/${business.slug}`}>Home</Link>
            <Link href={`/${business.slug}/products`}>Catalogue</Link>
            {business.category.rateModuleEnabled && (
              <Link href={`/${business.slug}/rates`}>Rates</Link>
            )}
          </nav>
        )}
      </motion.div>
    </header>
  );
}
