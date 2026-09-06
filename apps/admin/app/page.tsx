'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth';

export default function IndexPage() {
  const { session, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!session) router.replace('/login');
    else router.replace(session.mode === 'super' ? '/admin' : '/dashboard');
  }, [ready, session, router]);

  return (
    <div className="login-wrap">
      <span className="muted">Loading…</span>
    </div>
  );
}
