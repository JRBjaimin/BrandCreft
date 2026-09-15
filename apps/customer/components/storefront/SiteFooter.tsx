import type { Business } from '@brandcraft/storefront-data';

export function SiteFooter({ business }: { business?: Business }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="between" style={{ flexWrap: 'wrap', gap: 12 }}>
          <span>
            {business ? `${business.name} · ${business.contact.address.city}` : 'BrandCraft'}
          </span>
          <span className="faint">Powered by BrandCraft</span>
        </div>
        {business && (
          <div className="footer-links">
            <span>{business.contact.phone}</span>
            <span>{business.contact.email}</span>
          </div>
        )}
      </div>
    </footer>
  );
}
