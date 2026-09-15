import type {
  Business,
  Enquiry,
  EnquiryInput,
  Offer,
  Product,
  RateHistoryEntry,
  RatePoint,
} from './domain';

/**
 * Read/interaction seam for the customer storefront. `apps/customer` never
 * touches mock data structures directly — it only calls this interface, so a
 * future `ApiStorefrontProvider` (backed by `@brandcraft/api-client` once the
 * backend grows public business/product endpoints) is a drop-in replacement
 * with zero page-level changes.
 */
export interface StorefrontDataProvider {
  /** Active businesses only — used by the dev/demo directory (see apps/customer/app/page.tsx). */
  listBusinesses(): Promise<Business[]>;
  getBusinessBySlug(slug: string): Promise<Business | null>;
  listProducts(businessId: string): Promise<Product[]>;
  getProduct(businessId: string, productId: string): Promise<Product | null>;
  listOffers(businessId: string): Promise<Offer[]>;
  /** Returns `[]` when the business's category does not enable the rate module. */
  getRates(businessId: string): Promise<RatePoint[]>;
  getRateHistory(businessId: string, metal: string): Promise<RateHistoryEntry[]>;

  /** Anonymous, browser-local — no customer account exists yet. */
  isFavourite(businessId: string, productId: string): Promise<boolean>;
  toggleFavourite(businessId: string, productId: string): Promise<boolean>;
  listFavourites(businessId: string): Promise<string[]>;

  /** Records intent locally; the real WhatsApp deep link is built client-side regardless. */
  submitEnquiry(input: EnquiryInput): Promise<Enquiry>;
}
