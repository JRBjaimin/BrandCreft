import Link from 'next/link';
import { Reveal, StaggerGroup, StaggerItem } from '@brandcraft/motion';
import { SiteHeader } from '../components/storefront/SiteHeader';
import { SiteFooter } from '../components/storefront/SiteFooter';
import { dataProvider } from '../lib/data';
import { initials } from '../lib/format';
import { accentStyle } from '../lib/accent';

export default async function HomePage() {
  const businesses = await dataProvider.listBusinesses();

  return (
    <div className="page">
      <SiteHeader />
      <main style={{ flex: 1 }}>
        <Reveal trigger="mount">
          <div className="directory-hero container">
            <span className="eyebrow">Demo storefronts</span>
            <h1>Every business, its own storefront</h1>
            <p>
              In production a customer reaches a business directly via a QR code or shared link —
              this directory exists only so you can preview the storefront experience for the demo
              businesses below.
            </p>
          </div>
        </Reveal>
        <StaggerGroup className="container directory-grid" trigger="mount">
          {businesses.map((business) => (
            <StaggerItem key={business.id}>
              <Link
                href={`/${business.slug}`}
                className="directory-card"
                style={accentStyle(business.branding.colors[0])}
              >
                <span
                  className="logo"
                  style={{ background: 'var(--accent)', color: 'var(--accent-contrast)' }}
                >
                  {initials(business.name)}
                </span>
                <h3>{business.name}</h3>
                <p>{business.description}</p>
                <span className="badge">{business.category.label}</span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </main>
      <SiteFooter />
    </div>
  );
}
