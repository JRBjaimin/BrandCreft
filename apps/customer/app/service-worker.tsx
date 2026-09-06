'use client';

import { useEffect } from 'react';

/**
 * Registers the placeholder service worker so the app is installable.
 * Real caching strategy (offline catalogue, etc.) is Phase 6.
 */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* registration failure is non-fatal for the skeleton */
    });
  }, []);

  return null;
}
