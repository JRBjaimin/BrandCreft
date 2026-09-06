/* BrandCraft placeholder service worker.
 * Phase 1: no caching, just a valid registrable worker so the app is
 * installable. Phase 6 replaces this with a real offline strategy. */

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', () => {
  // Network passthrough. Intentionally no-op.
});
