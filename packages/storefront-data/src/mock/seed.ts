import type {
  Business,
  Festival,
  Offer,
  Product,
  RateHistoryEntry,
  RateMetal,
} from '../domain';

/** Bump when the seed shape changes, to invalidate any persisted mock state. */
export const SEED_VERSION = 1;

let counter = 0;
export function id(prefix: string): string {
  counter += 1;
  return `${prefix}_${counter.toString(36)}`;
}

function isoDaysAgo(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}

function isoHoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 3_600_000).toISOString();
}

export interface Dataset {
  businesses: Business[];
  products: Product[];
  offers: Offer[];
  festivals: Festival[];
  rateHistory: Record<string, Record<RateMetal, RateHistoryEntry[]>>;
}

function jewelleryBusiness(): Business {
  return {
    id: 'biz_smr',
    slug: 'smr-jewellers',
    name: 'SMR Jewellers',
    status: 'ACTIVE',
    category: { key: 'jewellery', label: 'Jewellery', rateModuleEnabled: true },
    description:
      'Three generations of goldsmiths crafting heritage jewellery for weddings, festivals, and everyday elegance.',
    branding: {
      logoUrl: null,
      coverUrl: null,
      colors: ['#8a1f2d', '#d4af37'],
      tone: 'Warm, traditional, premium heritage',
    },
    contact: {
      phone: '+91 98200 12345',
      whatsappPhone: '919820012345',
      email: 'hello@smrjewellers.example',
      address: { line1: '14 Zaveri Bazaar', city: 'Mumbai', state: 'Maharashtra', pincode: '400002' },
      socials: { instagram: 'https://instagram.com/smrjewellers', website: 'https://smrjewellers.example' },
    },
  };
}

function bakeryBusiness(): Business {
  return {
    id: 'biz_crumb',
    slug: 'sweet-obsessions',
    name: 'Sweet Obsessions',
    status: 'ACTIVE',
    category: { key: 'bakery', label: 'Bakery & Cake Shop', rateModuleEnabled: false },
    description:
      'Home-made chocolates and cakes, baked and hand-crafted in small batches — no preservatives, just obsession with the craft.',
    branding: {
      logoUrl: null,
      coverUrl: null,
      colors: ['#7c4a1e', '#f4c95d'],
      tone: 'Homely, indulgent, chocolate-forward',
    },
    contact: {
      phone: '+91 98765 43210',
      whatsappPhone: '919876543210',
      email: 'orders@sweetobsessions.example',
      address: { line1: '22 Church Road', city: 'Bengaluru', state: 'Karnataka', pincode: '560008' },
      socials: { instagram: 'https://instagram.com/sweetobsessions' },
    },
  };
}

function jewelleryProducts(businessId: string): Product[] {
  const now = new Date().toISOString();
  const specs: Array<[string, string, string, number, string[], Array<[string, string]>]> = [
    ['Heritage Temple Necklace Set', 'Necklaces', 'A hand-finished temple-motif necklace with matching earrings, inspired by South Indian temple carvings.', 284500, ['bestseller', 'bridal'], [['Purity', '22K Gold'], ['Gross weight', '48.2g'], ['Stones', 'Ruby & CZ'], ['Making charges', '12%']]],
    ['Solitaire Diamond Ring', 'Rings', 'A classic 4-prong solitaire set in 18K white gold, IGI certified.', 156000, ['diamond'], [['Purity', '18K White Gold'], ['Diamond', '0.9ct, VS1, F'], ['Certification', 'IGI'], ['Ring size', 'Made to order']]],
    ['Kundan Bridal Bangles (Set of 6)', 'Bangles', 'Layered kundan and meenakari bangles for bridal and festive wear.', 198000, ['bridal', 'festive'], [['Purity', '22K Gold'], ['Gross weight', '62g'], ['Work', 'Kundan & Meenakari']]],
    ['Silver Filigree Anklets', 'Anklets', 'Lightweight sterling silver anklets with intricate filigree work.', 4200, ['silver', 'everyday'], [['Purity', '92.5 Sterling Silver'], ['Weight', '38g pair']]],
    ['Platinum Wedding Band (Pair)', 'Rings', 'Matte-finish platinum bands for couples, comfort-fit profile.', 112000, ['platinum', 'wedding'], [['Purity', 'Platinum 950'], ['Weight', '12g pair'], ['Finish', 'Matte']]],
    ['Antique Gold Jhumka Earrings', 'Earrings', 'Oxidised antique-finish jhumkas with pearl drops.', 68500, ['antique', 'festive'], [['Purity', '22K Gold'], ['Weight', '18.4g'], ['Drops', 'Freshwater pearl']]],
    ["Children's Gold Chain", 'Chains', 'Delicate 18-inch gold chain, safety clasp, ideal for kids.', 32800, ['kids'], [['Purity', '22K Gold'], ['Weight', '6.1g'], ['Length', '18 inch']]],
    ['Polki Choker Necklace', 'Necklaces', 'Uncut polki diamond choker with emerald accents, statement bridal piece.', 412000, ['bridal', 'polki'], [['Purity', '22K Gold'], ['Stones', 'Polki & Emerald'], ['Weight', '54g']]],
  ];
  return specs.map(([name, category, description, price, tags, attrs], i) => ({
    id: id('prd'),
    businessId,
    name,
    sku: `SMR-${(i + 1).toString().padStart(3, '0')}`,
    category,
    description,
    price,
    currency: 'INR',
    available: true,
    status: 'active',
    tags,
    imageUrls: [],
    attributes: attrs.map(([label, value]) => ({ label, value })),
    createdAt: isoDaysAgo(60 - i * 3),
    updatedAt: now,
  }));
}

function bakeryProducts(businessId: string): Product[] {
  const now = new Date().toISOString();
  const specs: Array<[string, string, string, number, string[], Array<[string, string]>]> = [
    ['Belgian Chocolate Truffle Cake', 'Cakes', 'Rich dark chocolate sponge layered with Belgian ganache and truffle shavings.', 1450, ['bestseller', 'chocolate'], [['Size', '1 kg'], ['Serves', '8-10'], ['Eggless option', 'Available']]],
    ['Classic Red Velvet Cake', 'Cakes', 'Velvety red sponge with cream-cheese frosting.', 1350, ['classic'], [['Size', '1 kg'], ['Serves', '8-10']]],
    ['Fresh Cream Pastry Box (6pc)', 'Pastries', 'An assorted box of six fresh cream pastries — pineapple, chocolate, and butterscotch.', 480, ['pastry', 'box'], [['Count', '6 pieces'], ['Shelf life', '2 days refrigerated']]],
    ['Artisan Sourdough Loaf', 'Breads', '48-hour fermented sourdough, crisp crust and open crumb.', 260, ['bread', 'sourdough'], [['Weight', '600g'], ['Shelf life', '3 days']]],
    ['Butter Croissants (6pc)', 'Breads', 'Flaky, laminated butter croissants baked fresh every morning.', 390, ['breakfast'], [['Count', '6 pieces']]],
    ['Custom Birthday Theme Cake', 'Cakes', 'Fully customisable theme cake — share your reference and occasion.', 2200, ['custom', 'birthday'], [['Size', '1.5 kg'], ['Lead time', '48 hours']]],
    ['Eggless Vanilla Bean Cake', 'Cakes', 'Light vanilla sponge made with real vanilla bean, completely eggless.', 1100, ['eggless'], [['Size', '1 kg'], ['Serves', '8-10']]],
    ['Assorted Cookie Jar', 'Cookies', 'A gifting jar of chocolate chip, oatmeal, and butter cookies.', 550, ['gifting', 'cookies'], [['Weight', '400g'], ['Shelf life', '2 weeks']]],
  ];
  return specs.map(([name, category, description, price, tags, attrs], i) => ({
    id: id('prd'),
    businessId,
    name,
    sku: `CRB-${(i + 1).toString().padStart(3, '0')}`,
    category,
    description,
    price,
    currency: 'INR',
    available: true,
    status: 'active',
    tags,
    imageUrls: [],
    attributes: attrs.map(([label, value]) => ({ label, value })),
    createdAt: isoDaysAgo(40 - i * 2),
    updatedAt: now,
  }));
}

function festivals(): Festival[] {
  return [
    { key: 'akshaya-tritiya', name: 'Akshaya Tritiya', date: isoDaysAgo(-20), suggestedCta: 'Book your gold today' },
    { key: 'diwali', name: 'Diwali', date: isoDaysAgo(-90), suggestedCta: 'Shop the festive edit' },
    { key: 'weekend', name: 'Weekend Special', date: isoDaysAgo(-2), suggestedCta: 'Order for the weekend' },
  ];
}

function offers(smrId: string, smrProducts: Product[], crumbId: string, crumbProducts: Product[]): Offer[] {
  return [
    {
      id: id('off'),
      businessId: smrId,
      title: 'Akshaya Tritiya Gold Edit',
      message: 'Zero making charges on select necklaces and bangles this Akshaya Tritiya.',
      cta: 'Book your gold today',
      festivalKey: 'akshaya-tritiya',
      startDate: isoDaysAgo(2),
      endDate: isoDaysAgo(-18),
      productIds: smrProducts.slice(0, 3).map((p) => p.id),
    },
    {
      id: id('off'),
      businessId: smrId,
      title: 'Diwali Sparkle Collection',
      message: 'Festive polki and antique-finish pieces, curated for Diwali gifting.',
      cta: 'Shop the festive edit',
      festivalKey: 'diwali',
      startDate: isoDaysAgo(10),
      endDate: isoDaysAgo(-80),
      productIds: smrProducts.slice(5).map((p) => p.id),
    },
    {
      id: id('off'),
      businessId: crumbId,
      title: 'Weekend Cake Special',
      message: '10% off on all 1kg cakes, Friday to Sunday.',
      cta: 'Order for the weekend',
      festivalKey: 'weekend',
      startDate: isoDaysAgo(1),
      endDate: isoDaysAgo(-1),
      productIds: crumbProducts.slice(0, 2).map((p) => p.id),
    },
  ];
}

function rateSeries(base: number, days: number, driftPerDay: number): RateHistoryEntry[] {
  const out: RateHistoryEntry[] = [];
  for (let d = days - 1; d >= 0; d -= 1) {
    // Deterministic gentle wave so the sparkline looks organic without randomness.
    const wave = Math.sin(d / 2.3) * (base * 0.004);
    const price = Math.round(base + driftPerDay * (days - 1 - d) + wave);
    out.push({ at: isoDaysAgo(d), pricePerGram: price });
  }
  return out;
}

function rateHistoryFor(businessId: string): Record<RateMetal, RateHistoryEntry[]> {
  return {
    'gold-24k': rateSeries(7150, 14, 6),
    'gold-22k': rateSeries(6553, 14, 5.5),
    silver: rateSeries(86, 14, 0.3),
    platinum: rateSeries(3220, 14, -2),
  };
}

export function buildDataset(): Dataset {
  const smr = jewelleryBusiness();
  const crumb = bakeryBusiness();
  const smrProducts = jewelleryProducts(smr.id);
  const crumbProducts = bakeryProducts(crumb.id);

  return {
    businesses: [smr, crumb],
    products: [...smrProducts, ...crumbProducts],
    offers: offers(smr.id, smrProducts, crumb.id, crumbProducts),
    festivals: festivals(),
    rateHistory: {
      [smr.id]: rateHistoryFor(smr.id),
    },
  };
}
