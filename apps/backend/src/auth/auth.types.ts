import type { Request } from 'express';

/**
 * The authenticated caller for a request.
 *
 * Phase 2 populates this from a dev header (see dev-auth.middleware.ts).
 * Phase 3 replaces the mechanism with real JWT verification but keeps this
 * shape, so guards / services / decorators written now do not change.
 */
export interface Membership {
  businessId: string;
  /** Tenant-scoped role, mirrors business_users.role. */
  role: string;
}

export interface AuthPrincipal {
  userId: string;
  email: string;
  /** Platform-level SUPER_ADMIN: bypasses tenant membership checks. */
  isSuperAdmin: boolean;
  memberships: Membership[];
}

export interface AuthedRequest extends Request {
  principal?: AuthPrincipal;
  /** Set by TenantGuard once the caller's access to the target business is proven. */
  businessId?: string;
}
