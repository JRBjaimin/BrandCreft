import { ForbiddenException } from '@nestjs/common';
import type { AuthPrincipal } from '../auth/auth.types';

/** Sentinel meaning "no tenant restriction" (super admin). */
export const ALL_BUSINESSES = Symbol('ALL_BUSINESSES');

export function canAccessBusiness(principal: AuthPrincipal, businessId: string): boolean {
  if (principal.isSuperAdmin) return true;
  return principal.memberships.some((m) => m.businessId === businessId);
}

/**
 * Throws 403 unless the principal is a super admin or a member of `businessId`.
 * This is the single choke point every tenant-scoped request passes through.
 */
export function assertBusinessAccess(principal: AuthPrincipal, businessId: string): void {
  if (!canAccessBusiness(principal, businessId)) {
    throw new ForbiddenException('You do not have access to this business');
  }
}

/**
 * The set of business ids a principal may read, or ALL_BUSINESSES for a
 * super admin. Use to scope list endpoints.
 */
export function accessibleBusinessIds(principal: AuthPrincipal): string[] | typeof ALL_BUSINESSES {
  if (principal.isSuperAdmin) return ALL_BUSINESSES;
  return [...new Set(principal.memberships.map((m) => m.businessId))];
}
