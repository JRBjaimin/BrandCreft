/**
 * Domain types for the admin console mock layer.
 *
 * These mirror what the backend will eventually return (see
 * docs/02_TECHNICAL_WORK_BREAKDOWN.md) but live here so the frontend can be
 * built and demoed with no backend. `lib/mock/store.tsx` is the in-memory,
 * localStorage-backed source of truth; swap it for `@brandcraft/api-client`
 * calls when the API is ready.
 */

export type Role = 'SUPER_ADMIN' | 'BUSINESS_OWNER' | 'BUSINESS_ADMIN' | 'BUSINESS_STAFF';

export type BusinessStatus = 'ACTIVE' | 'DISABLED';
export type SubscriptionPlan = 'trial' | 'starter' | 'growth' | 'enterprise';

export interface CategoryDef {
  key: string;
  label: string;
  rateModuleEnabled: boolean;
  features: string[];
}

export interface Branding {
  logoUrl: string | null;
  coverUrl: string | null;
  colors: string[];
  tone: string;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  status: BusinessStatus;
  categoryKey: string;
  plan: SubscriptionPlan;
  ownerUserId: string;
  description: string;
  gstin: string;
  phone: string;
  email: string;
  address: { line1: string; city: string; state: string; pincode: string };
  socials: { instagram?: string; facebook?: string; website?: string };
  branding: Branding;
  features: Record<string, boolean>;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  roles: Role[];
  businessId: string | null;
  isActive: boolean;
  lastActiveAt: string;
  createdAt: string;
}

export type ProductStatus = 'draft' | 'active' | 'archived';

export interface Product {
  id: string;
  businessId: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  price: number | null;
  currency: 'INR';
  available: boolean;
  status: ProductStatus;
  tags: string[];
  imageUrls: string[];
  attributes: { label: string; value: string }[];
  aiFacts: string[];
  createdAt: string;
  updatedAt: string;
}

export type CampaignStatus = 'draft' | 'scheduled' | 'running' | 'completed' | 'archived';

export interface Festival {
  key: string;
  name: string;
  date: string;
  allowedCategories: string[];
  suggestedCta: string;
}

export interface Campaign {
  id: string;
  businessId: string;
  name: string;
  festivalKey: string | null;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  message: string;
  cta: string;
  theme: string;
  productIds: string[];
  createdAt: string;
}

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

export interface CreativeVersion {
  id: string;
  createdAt: string;
  imageUrl: string;
  caption: string;
  hashtags: string[];
  note: string;
}

export interface Creative {
  id: string;
  businessId: string;
  productId: string;
  campaignId: string | null;
  status: CreativeStatus;
  source: 'whatsapp' | 'admin';
  createdAt: string;
  versions: CreativeVersion[];
  activeVersionId: string;
  history: { at: string; label: string; by: string }[];
  externalPostId?: string;
  failureReason?: string;
}

export type IntegrationState = 'connected' | 'disconnected' | 'error';

export interface Integrations {
  businessId: string;
  instagram: {
    state: IntegrationState;
    accountHandle: string | null;
    tokenExpiresAt: string | null;
    lastPublishAt: string | null;
  };
  whatsapp: {
    state: IntegrationState;
    phoneNumber: string | null;
    displayName: string | null;
    lastEventAt: string | null;
  };
}

export interface RatePoint {
  metal: 'gold-24k' | 'gold-22k' | 'silver' | 'platinum';
  label: string;
  pricePerGram: number;
  changePct: number;
  unit: 'gram';
  purity: string;
  updatedAt: string;
  source: string;
  stale: boolean;
}

export interface WebhookEvent {
  id: string;
  at: string;
  type: string;
  businessId: string | null;
  status: 'processed' | 'duplicate' | 'invalid_signature' | 'unknown_sender' | 'failed';
  detail: string;
}

export interface QueueStat {
  name: string;
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
}

export interface AuditLog {
  id: string;
  at: string;
  actor: string;
  action: string;
  target: string;
  businessId: string | null;
}

export interface FeatureFlag {
  key: string;
  label: string;
  description: string;
  scope: 'global' | 'category' | 'business';
  enabled: boolean;
}

export interface Notification {
  id: string;
  at: string;
  kind: 'ai_complete' | 'approval_pending' | 'publish_success' | 'publish_failure' | 'integration_down';
  title: string;
  body: string;
  read: boolean;
}
