export * from './domain';
export type { StorefrontDataProvider } from './provider';
export { MockStorefrontProvider } from './mock/provider';

import { MockStorefrontProvider } from './mock/provider';
import type { StorefrontDataProvider } from './provider';

export type StorefrontDataSource = 'mock';

let cached: StorefrontDataProvider | null = null;

/**
 * Single seam the customer app calls through. Today this only returns the
 * mock implementation. Once the backend exposes public business/product
 * endpoints (see docs/03_END_TO_END_IMPLEMENTATION_ROADMAP.md, Phase 6
 * backend items), add an `ApiStorefrontProvider` here backed by
 * `@brandcraft/api-client` and branch on `source` — no page in apps/customer
 * needs to change, since they only depend on `StorefrontDataProvider`.
 */
export function createStorefrontDataProvider(
  source: StorefrontDataSource = 'mock',
): StorefrontDataProvider {
  if (source !== 'mock') {
    throw new Error(`Unsupported storefront data source: "${source}" (only "mock" exists today)`);
  }
  if (!cached) cached = new MockStorefrontProvider();
  return cached;
}
