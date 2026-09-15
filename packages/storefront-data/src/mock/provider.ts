import type {
  Business,
  Enquiry,
  EnquiryInput,
  Offer,
  Product,
  RateHistoryEntry,
  RateMetal,
  RatePoint,
} from '../domain';
import type { StorefrontDataProvider } from '../provider';
import { buildDataset, id, SEED_VERSION, type Dataset } from './seed';

const FAVOURITES_KEY = `brandcraft.customer.favourites.v${SEED_VERSION}`;
const ENQUIRIES_KEY = `brandcraft.customer.enquiries.v${SEED_VERSION}`;
/** Rates older than this are surfaced as stale rather than silently shown as live. */
const RATE_FRESHNESS_MS = 6 * 60 * 60 * 1000;

const RATE_META: Record<RateMetal, { label: string; purity: string; source: string }> = {
  'gold-24k': { label: 'Gold 24K', purity: '999 (24K)', source: 'Illustrative dev-tier rate source — demo only' },
  'gold-22k': { label: 'Gold 22K', purity: '916 (22K)', source: 'Illustrative dev-tier rate source — demo only' },
  silver: { label: 'Silver', purity: '999', source: 'Illustrative dev-tier rate source — demo only' },
  platinum: { label: 'Platinum', purity: '950', source: 'Illustrative dev-tier rate source — demo only' },
};

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function readJson<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota / private mode */
  }
}

function favouriteKey(businessId: string, productId: string): string {
  return `${businessId}:${productId}`;
}

/**
 * In-memory + localStorage-backed implementation of the storefront data
 * seam. Dataset is generated once per page load (module scope), matching
 * the SSR-safe pattern used by apps/admin/lib/mock/store.tsx: identical
 * output on server and first client render, favourites hydrate from
 * localStorage only on the client.
 */
export class MockStorefrontProvider implements StorefrontDataProvider {
  private readonly dataset: Dataset;

  constructor(dataset: Dataset = buildDataset()) {
    this.dataset = dataset;
  }

  async listBusinesses(): Promise<Business[]> {
    return this.dataset.businesses.filter((b) => b.status === 'ACTIVE');
  }

  async getBusinessBySlug(slug: string): Promise<Business | null> {
    return this.dataset.businesses.find((b) => b.slug === slug) ?? null;
  }

  async listProducts(businessId: string): Promise<Product[]> {
    return this.dataset.products.filter((p) => p.businessId === businessId);
  }

  async getProduct(businessId: string, productId: string): Promise<Product | null> {
    return (
      this.dataset.products.find((p) => p.businessId === businessId && p.id === productId) ?? null
    );
  }

  async listOffers(businessId: string): Promise<Offer[]> {
    const now = Date.now();
    return this.dataset.offers.filter(
      (o) =>
        o.businessId === businessId &&
        new Date(o.startDate).getTime() <= now &&
        new Date(o.endDate).getTime() >= now,
    );
  }

  async getRates(businessId: string): Promise<RatePoint[]> {
    const history = this.dataset.rateHistory[businessId];
    if (!history) return [];
    const now = Date.now();
    const points: RatePoint[] = [];
    for (const metal of Object.keys(history) as RateMetal[]) {
      const series = history[metal];
      const latest = series[series.length - 1];
      if (!latest) continue;
      const previous = series[series.length - 2] ?? latest;
      const changePct = previous.pricePerGram
        ? ((latest.pricePerGram - previous.pricePerGram) / previous.pricePerGram) * 100
        : 0;
      const meta = RATE_META[metal];
      points.push({
        metal,
        label: meta.label,
        pricePerGram: latest.pricePerGram,
        changePct: Math.round(changePct * 100) / 100,
        unit: 'gram',
        purity: meta.purity,
        updatedAt: latest.at,
        source: meta.source,
        stale: now - new Date(latest.at).getTime() > RATE_FRESHNESS_MS,
      });
    }
    return points;
  }

  async getRateHistory(businessId: string, metal: string): Promise<RateHistoryEntry[]> {
    return this.dataset.rateHistory[businessId]?.[metal as RateMetal] ?? [];
  }

  async isFavourite(businessId: string, productId: string): Promise<boolean> {
    const favourites = readJson<string[]>(FAVOURITES_KEY, []);
    return favourites.includes(favouriteKey(businessId, productId));
  }

  async toggleFavourite(businessId: string, productId: string): Promise<boolean> {
    const key = favouriteKey(businessId, productId);
    const favourites = readJson<string[]>(FAVOURITES_KEY, []);
    const next = favourites.includes(key)
      ? favourites.filter((k) => k !== key)
      : [...favourites, key];
    writeJson(FAVOURITES_KEY, next);
    return next.includes(key);
  }

  async listFavourites(businessId: string): Promise<string[]> {
    const favourites = readJson<string[]>(FAVOURITES_KEY, []);
    const prefix = `${businessId}:`;
    return favourites.filter((k) => k.startsWith(prefix)).map((k) => k.slice(prefix.length));
  }

  async submitEnquiry(input: EnquiryInput): Promise<Enquiry> {
    const enquiry: Enquiry = {
      ...input,
      id: id('enq'),
      createdAt: new Date().toISOString(),
      channel: 'whatsapp',
    };
    const existing = readJson<Enquiry[]>(ENQUIRIES_KEY, []);
    writeJson(ENQUIRIES_KEY, [enquiry, ...existing].slice(0, 100));
    return enquiry;
  }
}
