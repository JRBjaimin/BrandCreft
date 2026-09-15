/**
 * Public storefront domain types.
 *
 * These describe what the CUSTOMER-facing storefront needs to read. They are
 * deliberately a small, read-oriented surface — not a general admin/CRUD model.
 *
 * Where a shape already exists in `@brandcraft/types` (the contract shared
 * with the real backend), it is reused here rather than redefined, so this
 * package never drifts from the backend the way `apps/admin/lib/types.ts`
 * has (see docs/03_END_TO_END_IMPLEMENTATION_ROADMAP.md, Known Gaps).
 *
 * Everything below is currently backed by mock data only (see `mock/`).
 * None of Category.rateModuleEnabled aside, no Product/Campaign/Rate model
 * exists in prisma/schema.prisma yet — that is future backend work, not
 * implemented by this package.
 */
import type { BusinessStatus } from '@brandcraft/types';

export interface Category {
  key: string;
  label: string;
  rateModuleEnabled: boolean;
}

export interface BusinessBranding {
  logoUrl: string | null;
  coverUrl: string | null;
  colors: string[];
  tone: string;
}

export interface BusinessAddress {
  line1: string;
  city: string;
  state: string;
  pincode: string;
}

export interface BusinessSocials {
  instagram?: string;
  facebook?: string;
  website?: string;
}

export interface BusinessContact {
  phone: string;
  whatsappPhone: string;
  email: string;
  address: BusinessAddress;
  socials: BusinessSocials;
}

export interface Business {
  id: string;
  slug: string;
  name: string;
  status: BusinessStatus;
  category: Category;
  description: string;
  branding: BusinessBranding;
  contact: BusinessContact;
}

export interface ProductAttribute {
  label: string;
  value: string;
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
  attributes: ProductAttribute[];
  createdAt: string;
  updatedAt: string;
}

export interface Offer {
  id: string;
  businessId: string;
  title: string;
  message: string;
  cta: string;
  festivalKey: string | null;
  startDate: string;
  endDate: string;
  productIds: string[];
}

export interface Festival {
  key: string;
  name: string;
  date: string;
  suggestedCta: string;
}

export type RateMetal = 'gold-24k' | 'gold-22k' | 'silver' | 'platinum';

export interface RatePoint {
  metal: RateMetal;
  label: string;
  pricePerGram: number;
  changePct: number;
  unit: 'gram';
  purity: string;
  updatedAt: string;
  source: string;
  /** Freshness must always be surfaced explicitly — never present stale data as live. */
  stale: boolean;
}

export interface RateHistoryEntry {
  at: string;
  pricePerGram: number;
}

export interface EnquiryInput {
  businessId: string;
  productId: string | null;
  message: string;
}

export interface Enquiry extends EnquiryInput {
  id: string;
  createdAt: string;
  channel: 'whatsapp';
}
