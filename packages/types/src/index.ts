/**
 * Shared domain types for BrandCraft.
 *
 * These are transport/contract types shared between the backend API and the
 * frontend apps. They are intentionally framework-agnostic (no Prisma, no Nest,
 * no React). Keep them in sync with prisma/schema.prisma.
 */

// --- Identity & RBAC -------------------------------------------------------

export type RoleName = 'SUPER_ADMIN' | 'BUSINESS_OWNER' | 'BUSINESS_ADMIN' | 'BUSINESS_STAFF';

export interface UserSummary {
  id: string;
  email: string;
  name: string | null;
  isActive: boolean;
  roles: RoleName[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string; // ISO-8601
}

// --- Tenancy -------------------------------------------------------------

export type BusinessStatus = 'ACTIVE' | 'DISABLED';

export interface BusinessSummary {
  id: string;
  name: string;
  slug: string;
  status: BusinessStatus;
  categoryKey: string;
}

// --- Category / feature configuration ----------------------------------

export interface CategoryConfig {
  key: string;
  label: string;
  features: string[];
  rateModuleEnabled: boolean;
}

// --- Creative lifecycle (see docs/02, section 16) ---------------------

export type CreativeStatus =
  | 'GENERATING'
  | 'GENERATED'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'PUBLISHING'
  | 'PUBLISHED'
  | 'FAILED'
  | 'EXPIRED';

// --- API envelope -----------------------------------------------------

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
  requestId?: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface HealthResponse {
  status: 'ok' | 'degraded' | 'error';
  uptimeSeconds: number;
  version: string;
  checks: Record<string, 'up' | 'down'>;
}
