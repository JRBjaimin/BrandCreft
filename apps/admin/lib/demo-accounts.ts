/**
 * Demo login credentials for the mock admin console (no backend auth yet —
 * see docs/03_END_TO_END_IMPLEMENTATION_ROADMAP.md, Phase 3).
 *
 * Super Admin uses a small fixed credential list. Every OTHER business gets
 * a login derived from its own name (id === password === the business name
 * with spaces/punctuation stripped) — computed the same way for seeded
 * businesses and any new business created from /admin/businesses, so this
 * never drifts out of sync with lib/mock/seed.ts.
 */
import type { Mode } from './auth';
import type { Business, User } from './types';

export const SUPER_ADMIN_NAME = 'Platform Admin';
export const SUPER_ADMIN_EMAIL = 'admin@brandcraft.io';

const SUPER_ADMIN_CREDENTIALS: { loginId: string; password: string }[] = [
  { loginId: 'admin', password: 'admin' },
  { loginId: 'superadmin', password: 'superadmin' },
];

/** Lowercased, alphanumeric-only — e.g. "SMR Jewellers" -> "smrjewellers". */
export function normalizeLoginId(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export interface ResolvedAccount {
  mode: Mode;
  name: string;
  email: string;
  businessId: string | null;
}

export function matchSuperAdmin(loginId: string, password: string): ResolvedAccount | null {
  const normalized = loginId.trim().toLowerCase();
  const hit = SUPER_ADMIN_CREDENTIALS.find((c) => c.loginId === normalized && c.password === password);
  if (!hit) return null;
  return { mode: 'super', name: SUPER_ADMIN_NAME, email: SUPER_ADMIN_EMAIL, businessId: null };
}

/** Only ACTIVE businesses can log in — a disabled tenant has no working login. */
export function matchBusinessAccount(
  businesses: Business[],
  users: User[],
  loginId: string,
  password: string,
): ResolvedAccount | null {
  const normalized = normalizeLoginId(loginId.trim());
  const business = businesses.find((b) => b.status === 'ACTIVE' && normalizeLoginId(b.name) === normalized);
  if (!business || normalizeLoginId(password) !== normalizeLoginId(business.name)) return null;
  const owner = users.find((u) => u.id === business.ownerUserId);
  return {
    mode: 'business',
    name: owner?.name ?? business.name,
    email: owner?.email ?? '',
    businessId: business.id,
  };
}
