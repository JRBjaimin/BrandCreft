import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AuthProvider } from '../lib/auth';
import { DataProvider } from '../lib/mock/store';
import { ToastProvider } from '../components/toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'BrandCraft Admin',
  description: 'Super Admin & Business Admin console',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <DataProvider>
            <ToastProvider>{children}</ToastProvider>
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
