import Link from 'next/link';
import { SiteHeader } from '../components/storefront/SiteHeader';
import { SiteFooter } from '../components/storefront/SiteFooter';
import { EmptyState } from '../components/ui';

export default function NotFound() {
  return (
    <div className="page">
      <SiteHeader />
      <main style={{ flex: 1 }} className="container">
        <EmptyState
          icon="🧭"
          title="We couldn't find that page"
          hint="The business or product you're looking for may have moved or doesn't exist."
        />
        <div style={{ textAlign: 'center' }}>
          <Link href="/" className="btn primary">
            Back to storefronts
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
