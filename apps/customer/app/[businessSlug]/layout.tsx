import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { dataProvider } from '../../lib/data';
import { accentStyle } from '../../lib/accent';
import { SiteHeader } from '../../components/storefront/SiteHeader';
import { SiteFooter } from '../../components/storefront/SiteFooter';

export async function generateMetadata({
  params,
}: {
  params: { businessSlug: string };
}): Promise<Metadata> {
  const business = await dataProvider.getBusinessBySlug(params.businessSlug);
  if (!business) return {};
  return {
    title: `${business.name} — BrandCraft`,
    description: business.description,
  };
}

export default async function BusinessLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { businessSlug: string };
}) {
  const business = await dataProvider.getBusinessBySlug(params.businessSlug);
  if (!business || business.status !== 'ACTIVE') notFound();

  return (
    <div className="page" style={accentStyle(business.branding.colors[0])}>
      <SiteHeader business={business} />
      <main style={{ flex: 1 }}>{children}</main>
      <SiteFooter business={business} />
    </div>
  );
}
