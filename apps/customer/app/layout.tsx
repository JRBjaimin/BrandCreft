import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { ServiceWorker } from './service-worker';
import './globals.css';

export const metadata: Metadata = {
  title: 'BrandCraft',
  description: 'Discover local businesses and their products',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'BrandCraft' },
};

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
