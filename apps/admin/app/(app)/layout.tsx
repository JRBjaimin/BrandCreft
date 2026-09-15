'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useAuth } from '../../lib/auth';
import { Sidebar, Topbar } from '../../components/shell';

export default function AppLayout({ children }: { children: ReactNode }) {
  const { session, ready } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!ready) return;
    if (!session) {
      router.replace('/login');
      return;
    }
    // Keep the URL space consistent with the active console.
    if (session.mode === 'super' && !pathname.startsWith('/admin')) {
      router.replace('/admin');
    }
    if (session.mode === 'business' && pathname.startsWith('/admin')) {
      router.replace('/dashboard');
    }
  }, [ready, session, pathname, router]);

  if (!ready || !session) {
    return (
      <div className="route-loading">
        <span className="muted">Loading…</span>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Topbar />
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}
