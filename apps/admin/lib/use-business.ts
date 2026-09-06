'use client';

import { useAuth } from './auth';
import { useData } from './mock/store';
import type { Business, CategoryDef } from './types';

interface BusinessContext {
  business: Business;
  category: CategoryDef | undefined;
  rateModuleEnabled: boolean;
}

/**
 * The business the Business Admin console is currently scoped to. Assumes it is
 * called from inside the (app) shell where a business session is guaranteed;
 * returns null only during the brief redirect window.
 */
export function useBusiness(): BusinessContext | null {
  const { session } = useAuth();
  const { data } = useData();
  const business = data.businesses.find((b) => b.id === session?.activeBusinessId);
  if (!business) return null;
  const category = data.categories.find((c) => c.key === business.categoryKey);
  return { business, category, rateModuleEnabled: category?.rateModuleEnabled ?? false };
}
