import type {
  AuditLog,
  Business,
  Campaign,
  CategoryDef,
  Creative,
  FeatureFlag,
  Festival,
  Integrations,
  Notification,
  Product,
  QueueStat,
  RatePoint,
  User,
  WebhookEvent,
} from '../types';
import { daysAgo, daysAhead, hoursAgo, placeholder } from '../format';

export interface Dataset {
  categories: CategoryDef[];
  festivals: Festival[];
  businesses: Business[];
  users: User[];
  products: Product[];
  campaigns: Campaign[];
  creatives: Creative[];
  integrations: Integrations[];
  rates: Record<string, RatePoint[]>;
  webhookEvents: WebhookEvent[];
  queues: QueueStat[];
  auditLogs: AuditLog[];
  featureFlags: FeatureFlag[];
  notifications: Notification[];
}

const BIZ_A = 'biz_smr'; // jewellery
const BIZ_B = 'biz_crumb'; // bakery

export const SEED_VERSION = 3;

export function buildSeed(): Dataset {
  const categories: CategoryDef[] = [
    {
      key: 'jewellery',
      label: 'Jewellery',
      rateModuleEnabled: true,
      features: ['rates', 'campaigns', 'ai_creatives', 'whatsapp', 'instagram', 'catalogue'],
    },
    {
      key: 'bakery',
      label: 'Bakery & Desserts',
      rateModuleEnabled: false,
      features: ['campaigns', 'ai_creatives', 'whatsapp', 'instagram', 'catalogue', 'menu'],
    },
    {
      key: 'restaurant',
      label: 'Restaurant',
      rateModuleEnabled: false,
      features: ['campaigns', 'ai_creatives', 'whatsapp', 'instagram', 'menu'],
    },
    {
      key: 'apparel',
      label: 'Apparel',
      rateModuleEnabled: false,
      features: ['campaigns', 'ai_creatives', 'whatsapp', 'instagram', 'catalogue'],
    },
  ];

  const festivals: Festival[] = [
    { key: 'janmashtami', name: 'Janmashtami', date: daysAhead(9), allowedCategories: ['jewellery', 'bakery', 'restaurant', 'apparel'], suggestedCta: 'Shop the collection' },
    { key: 'ganesh-chaturthi', name: 'Ganesh Chaturthi', date: daysAhead(21), allowedCategories: ['jewellery', 'bakery', 'restaurant'], suggestedCta: 'Order now' },
    { key: 'navratri', name: 'Navratri', date: daysAhead(44), allowedCategories: ['jewellery', 'apparel'], suggestedCta: 'Explore festive picks' },
    { key: 'dhanteras', name: 'Dhanteras', date: daysAhead(66), allowedCategories: ['jewellery'], suggestedCta: 'Book your piece' },
    { key: 'diwali', name: 'Diwali', date: daysAhead(70), allowedCategories: ['jewellery', 'bakery', 'restaurant', 'apparel'], suggestedCta: 'Celebrate with us' },
    { key: 'christmas', name: 'Christmas', date: daysAhead(110), allowedCategories: ['bakery', 'restaurant', 'apparel'], suggestedCta: 'Pre-order today' },
  ];

  const businesses: Business[] = [
    {
      id: BIZ_A,
      name: 'SMR Jewellers',
      slug: 'smr-jewellers',
      status: 'ACTIVE',
      categoryKey: 'jewellery',
      plan: 'growth',
      ownerUserId: 'usr_owner_a',
      description: 'Family-run fine jewellery house since 1978. Bridal gold, diamond, and temple jewellery.',
      gstin: '24AABCS1429P1ZV',
      phone: '+91 98250 11122',
      email: 'care@smrjewellers.in',
      address: { line1: 'Ratna Sagar, MG Road', city: 'Rajkot', state: 'Gujarat', pincode: '360001' },
      socials: { instagram: '@smrjewellers', website: 'smrjewellers.in' },
      branding: {
        logoUrl: placeholder('SMR Jewellers', 'SMR'),
        coverUrl: placeholder('smr-cover', ''),
        colors: ['#7c1d3f', '#d4af37', '#1a1a1a'],
        tone: 'Elegant, premium, heritage-led. Warm and trustworthy, never flashy.',
      },
      features: { rates: true, campaigns: true, ai_creatives: true, whatsapp: true, instagram: true, catalogue: true },
      createdAt: daysAgo(420),
    },
    {
      id: BIZ_B,
      name: 'The Crumb Story',
      slug: 'the-crumb-story',
      status: 'ACTIVE',
      categoryKey: 'bakery',
      plan: 'starter',
      ownerUserId: 'usr_owner_b',
      description: 'Small-batch artisanal bakery. Sourdough, celebration cakes, and European pastries.',
      gstin: '27AAECT7712Q1Z8',
      phone: '+91 90040 55667',
      email: 'hello@thecrumbstory.com',
      address: { line1: '14 Baner Link Road', city: 'Pune', state: 'Maharashtra', pincode: '411045' },
      socials: { instagram: '@thecrumbstory', website: 'thecrumbstory.com' },
      branding: {
        logoUrl: placeholder('The Crumb Story', 'CS'),
        coverUrl: placeholder('crumb-cover', ''),
        colors: ['#8a5a44', '#f4e3c1', '#3f2d23'],
        tone: 'Cosy, handmade, playful. Speaks like a friendly neighbourhood baker.',
      },
      features: { rates: false, campaigns: true, ai_creatives: true, whatsapp: true, instagram: true, catalogue: true, menu: true },
      createdAt: daysAgo(180),
    },
    {
      id: 'biz_thread',
      name: 'Thread & Grain',
      slug: 'thread-and-grain',
      status: 'DISABLED',
      categoryKey: 'apparel',
      plan: 'trial',
      ownerUserId: 'usr_owner_c',
      description: 'Handloom-first contemporary apparel label.',
      gstin: '29AAFCT0001R1Z5',
      phone: '+91 99000 12345',
      email: 'studio@threadandgrain.in',
      address: { line1: '3 Indiranagar 12th Main', city: 'Bengaluru', state: 'Karnataka', pincode: '560038' },
      socials: { instagram: '@threadandgrain' },
      branding: { logoUrl: placeholder('Thread and Grain', 'TG'), coverUrl: null, colors: ['#2f4858', '#c8b6a6'], tone: 'Minimal, earthy, considered.' },
      features: { rates: false, campaigns: true, ai_creatives: false, whatsapp: false, instagram: false, catalogue: true },
      createdAt: daysAgo(31),
    },
  ];

  const users: User[] = [
    { id: 'usr_super', name: 'Platform Admin', email: 'admin@brandcraft.io', roles: ['SUPER_ADMIN'], businessId: null, isActive: true, lastActiveAt: hoursAgo(1), createdAt: daysAgo(500) },
    { id: 'usr_owner_a', name: 'Meera Shah', email: 'meera@smrjewellers.in', roles: ['BUSINESS_OWNER'], businessId: BIZ_A, isActive: true, lastActiveAt: hoursAgo(3), createdAt: daysAgo(420) },
    { id: 'usr_staff_a1', name: 'Ravi Trivedi', email: 'ravi@smrjewellers.in', roles: ['BUSINESS_ADMIN'], businessId: BIZ_A, isActive: true, lastActiveAt: daysAgo(1), createdAt: daysAgo(300) },
    { id: 'usr_staff_a2', name: 'Nisha Patel', email: 'nisha@smrjewellers.in', roles: ['BUSINESS_STAFF'], businessId: BIZ_A, isActive: false, lastActiveAt: daysAgo(26), createdAt: daysAgo(120) },
    { id: 'usr_owner_b', name: 'Aditya Rao', email: 'aditya@thecrumbstory.com', roles: ['BUSINESS_OWNER'], businessId: BIZ_B, isActive: true, lastActiveAt: hoursAgo(7), createdAt: daysAgo(180) },
    { id: 'usr_staff_b1', name: 'Fatima Khan', email: 'fatima@thecrumbstory.com', roles: ['BUSINESS_ADMIN'], businessId: BIZ_B, isActive: true, lastActiveAt: daysAgo(2), createdAt: daysAgo(90) },
    { id: 'usr_owner_c', name: 'Kabir Nair', email: 'kabir@threadandgrain.in', roles: ['BUSINESS_OWNER'], businessId: 'biz_thread', isActive: true, lastActiveAt: daysAgo(30), createdAt: daysAgo(31) },
  ];

  const jewelleryProducts: Product[] = [
    prod(BIZ_A, 'Antara Bridal Necklace Set', 'SMR-NK-041', 'Bridal', 22, 268000, ['bridal', 'gold', '22k', 'kundan'], 'jewellery',
      'Handcrafted 22k gold bridal necklace with matching jhumkas. Kundan and uncut polki work.',
      [{ label: 'Metal', value: '22k Yellow Gold' }, { label: 'Gross weight', value: '84.6 g' }, { label: 'Stones', value: 'Uncut polki, kundan' }],
      ['22k hallmarked gold', 'Gross weight 84.6 g', 'Includes necklace + jhumkas', 'BIS certified']),
    prod(BIZ_A, 'Ira Solitaire Ring', 'SMR-RG-112', 'Rings', 45, 154000, ['diamond', 'ring', 'solitaire', '18k'], 'jewellery',
      'Classic 6-prong solitaire in 18k white gold. GIA-graded centre stone.',
      [{ label: 'Centre stone', value: '0.72 ct, VVS2, F' }, { label: 'Metal', value: '18k White Gold' }, { label: 'Certification', value: 'GIA' }],
      ['0.72 ct centre diamond', 'GIA certificate no. supplied', '18k white gold band', 'Free resizing within 30 days']),
    prod(BIZ_A, 'Meenakari Temple Jhumka', 'SMR-ER-078', 'Earrings', 60, 48500, ['temple', 'earrings', 'meenakari', '22k'], 'jewellery',
      'South Indian temple jhumkas with green and red meenakari and pearl drops.',
      [{ label: 'Metal', value: '22k Gold' }, { label: 'Weight', value: '18.2 g' }, { label: 'Drop', value: 'Freshwater pearl' }],
      ['22k gold, 18.2 g', 'Hand-painted meenakari', 'Freshwater pearl drops']),
    prod(BIZ_A, 'Silver Payal (Pair)', 'SMR-AN-205', 'Silver', 120, 6800, ['silver', 'anklet', 'daily'], 'jewellery',
      '92.5 sterling silver anklets with ghungroo. Everyday wear.',
      [{ label: 'Purity', value: '92.5 Sterling' }, { label: 'Weight', value: '42 g pair' }],
      ['92.5 sterling silver', '42 g per pair', 'Adjustable clasp']),
    prod(BIZ_A, 'Rose Gold Mangalsutra', 'SMR-MS-019', 'Mangalsutra', 30, 62000, ['mangalsutra', 'rose-gold', '18k', 'diamond'], 'jewellery',
      'Contemporary 18k rose gold mangalsutra with a diamond-set pendant.',
      [{ label: 'Metal', value: '18k Rose Gold' }, { label: 'Diamonds', value: '0.18 ct total' }, { label: 'Chain', value: '18 inch' }],
      ['18k rose gold', '0.18 ct diamonds total', '18 inch black-bead chain']),
  ];

  const bakeryProducts: Product[] = [
    prod(BIZ_B, 'Classic Country Sourdough', 'CS-BR-01', 'Bread', 200, 320, ['sourdough', 'bread', 'vegan'], 'bakery',
      'Naturally leavened 800g loaf. 30-hour ferment, crackling crust.',
      [{ label: 'Weight', value: '800 g' }, { label: 'Ferment', value: '30 hours' }],
      ['800 g loaf', 'Naturally leavened, no commercial yeast', 'Contains: wheat']),
    prod(BIZ_B, 'Belgian Chocolate Truffle Cake', 'CS-CK-07', 'Cakes', 40, 1450, ['cake', 'chocolate', 'eggless-option'], 'bakery',
      'Three layers of dark chocolate sponge, 55% Belgian ganache. Serves 8–10.',
      [{ label: 'Size', value: '1 kg' }, { label: 'Serves', value: '8–10' }, { label: 'Eggless', value: 'On request' }],
      ['1 kg, serves 8–10', '55% Belgian couverture', 'Eggless option available', 'Contains: wheat, dairy, soy']),
    prod(BIZ_B, 'Butter Croissant (Box of 4)', 'CS-PY-03', 'Pastry', 24, 480, ['croissant', 'viennoiserie', 'butter'], 'bakery',
      'Laminated with French cultured butter. 72-hour process.',
      [{ label: 'Count', value: '4 pieces' }, { label: 'Butter', value: 'French cultured' }],
      ['Box of 4', 'French cultured butter', 'Baked fresh each morning']),
    prod(BIZ_B, 'Pistachio Rose Entremet', 'CS-DS-12', 'Desserts', 12, 2200, ['entremet', 'pistachio', 'premium'], 'bakery',
      'Pistachio mousse, raspberry insert, rose crémeux, almond dacquoise.',
      [{ label: 'Size', value: '6 inch' }, { label: 'Serves', value: '6–8' }],
      ['6 inch, serves 6–8', 'Contains: nuts, dairy, egg', '48-hour advance order']),
  ];

  const products = [...jewelleryProducts, ...bakeryProducts];

  const campaigns: Campaign[] = [
    {
      id: 'cmp_a1', businessId: BIZ_A, name: 'Janmashtami Gold Edit', festivalKey: 'janmashtami', status: 'running',
      startDate: daysAgo(3), endDate: daysAhead(11), message: 'Blessings in gold — a curated Janmashtami edit of temple and bridal pieces.',
      cta: 'Book an appointment', theme: 'Deep maroon, gold foil, peacock motifs',
      productIds: [jewelleryProducts[0].id, jewelleryProducts[2].id],
      createdAt: daysAgo(6),
    },
    {
      id: 'cmp_a2', businessId: BIZ_A, name: 'Dhanteras Pre-Book', festivalKey: 'dhanteras', status: 'scheduled',
      startDate: daysAhead(50), endDate: daysAhead(67), message: 'Reserve your Dhanteras piece now, lock today’s making charges.',
      cta: 'Pre-book now', theme: 'Diya glow, coin motifs, warm gold', productIds: [jewelleryProducts[1].id, jewelleryProducts[4].id],
      createdAt: daysAgo(2),
    },
    {
      id: 'cmp_b1', businessId: BIZ_B, name: 'Weekend Sourdough Drop', festivalKey: null, status: 'running',
      startDate: daysAgo(1), endDate: daysAhead(2), message: 'Saturday bake is live. Country sourdough + seeded rye, while they last.',
      cta: 'Order for pickup', theme: 'Flour dust, kraft paper, warm tones', productIds: [bakeryProducts[0].id],
      createdAt: daysAgo(2),
    },
    {
      id: 'cmp_b2', businessId: BIZ_B, name: 'Christmas Cake Pre-Order', festivalKey: 'christmas', status: 'draft',
      startDate: daysAhead(90), endDate: daysAhead(120), message: 'Rum-soaked fruit cakes and Yule logs. Pre-orders open soon.',
      cta: 'Join the waitlist', theme: 'Pine, cranberry, candlelight', productIds: [bakeryProducts[1].id],
      createdAt: daysAgo(1),
    },
  ];

  const creatives: Creative[] = [
    creative({
      businessId: BIZ_A, productId: jewelleryProducts[0].id, status: 'PENDING_APPROVAL', source: 'whatsapp', ageDays: 4,
      history: [
        { label: 'Received image on WhatsApp', by: 'Meera Shah', back: 4 },
        { label: 'AI generation started', by: 'system', back: 4 },
        { label: 'Creative generated', by: 'system', back: 4 },
        { label: 'Sent to WhatsApp for approval', by: 'system', back: 4 },
      ],
    }),
    creative({
      businessId: BIZ_A, productId: jewelleryProducts[1].id, status: 'PUBLISHED', source: 'admin', ageDays: 26,
      externalPostId: 'IG_17912345678901234',
      history: [
        { label: 'Creative generated', by: 'system', back: 27 },
        { label: 'Approved', by: 'Meera Shah', back: 26 },
        { label: 'Published to Instagram', by: 'system', back: 26 },
      ],
    }),
    creative({
      businessId: BIZ_A, productId: jewelleryProducts[2].id, status: 'REJECTED', source: 'whatsapp', ageDays: 30,
      history: [
        { label: 'Creative generated', by: 'system', back: 31 },
        { label: 'Rejected — background too busy', by: 'Ravi Trivedi', back: 30 },
      ],
    }),
    creative({
      businessId: BIZ_B, productId: bakeryProducts[0].id, status: 'APPROVED', source: 'admin', ageDays: 8,
      history: [
        { label: 'Creative generated', by: 'system', back: 9 },
        { label: 'Approved', by: 'Aditya Rao', back: 8 },
        { label: 'Queued for publishing', by: 'system', back: 8 },
      ],
    }),
    creative({
      businessId: BIZ_B, productId: bakeryProducts[1].id, status: 'GENERATED', source: 'admin', ageDays: 2,
      history: [{ label: 'Creative generated', by: 'system', back: 2 }],
    }),
    creative({
      businessId: BIZ_B, productId: bakeryProducts[2].id, status: 'FAILED', source: 'whatsapp', ageDays: 20,
      failureReason: 'Instagram access token expired (190). Reconnect the account and retry.',
      history: [
        { label: 'Creative generated', by: 'system', back: 21 },
        { label: 'Approved', by: 'Fatima Khan', back: 20 },
        { label: 'Publish failed — Instagram token expired', by: 'system', back: 20 },
      ],
    }),
  ];

  const integrations: Integrations[] = [
    {
      businessId: BIZ_A,
      instagram: { state: 'connected', accountHandle: '@smrjewellers', tokenExpiresAt: daysAhead(41), lastPublishAt: daysAgo(26) },
      whatsapp: { state: 'connected', phoneNumber: '+91 98250 11122', displayName: 'SMR Jewellers', lastEventAt: hoursAgo(4) },
    },
    {
      businessId: BIZ_B,
      instagram: { state: 'error', accountHandle: '@thecrumbstory', tokenExpiresAt: daysAgo(1), lastPublishAt: daysAgo(20) },
      whatsapp: { state: 'connected', phoneNumber: '+91 90040 55667', displayName: 'The Crumb Story', lastEventAt: hoursAgo(9) },
    },
  ];

  const rates: Record<string, RatePoint[]> = {
    [BIZ_A]: [
      { metal: 'gold-24k', label: 'Gold 24K', pricePerGram: 7412, changePct: 0.6, unit: 'gram', purity: '999', updatedAt: hoursAgo(2), source: 'IBJA (dev feed)', stale: false },
      { metal: 'gold-22k', label: 'Gold 22K', pricePerGram: 6795, changePct: 0.6, unit: 'gram', purity: '916', updatedAt: hoursAgo(2), source: 'IBJA (dev feed)', stale: false },
      { metal: 'silver', label: 'Silver', pricePerGram: 92.4, changePct: -0.3, unit: 'gram', purity: '999', updatedAt: hoursAgo(2), source: 'IBJA (dev feed)', stale: false },
      { metal: 'platinum', label: 'Platinum', pricePerGram: 3180, changePct: 0.1, unit: 'gram', purity: '950', updatedAt: hoursAgo(31), source: 'IBJA (dev feed)', stale: true },
    ],
  };

  const webhookEvents: WebhookEvent[] = [
    wh('messages', BIZ_A, 'processed', 'Inbound image from +91 98250 11122 → creative job cr_ created', 4),
    wh('messages', BIZ_A, 'processed', 'Approval reply "YES" → creative cr_ approved', 26),
    wh('messages', BIZ_B, 'processed', 'Inbound text "Weekend order" → routed to enquiries', 9),
    wh('messages', null, 'unknown_sender', 'Inbound from +91 70000 00000 — no business match', 12),
    wh('messages', null, 'invalid_signature', 'X-Hub-Signature-256 mismatch, request dropped', 14),
    wh('messages', BIZ_B, 'duplicate', 'Event id evt_88213 already processed, ignored', 15),
    wh('status', BIZ_A, 'processed', 'Message status: delivered', 27),
    wh('messages', BIZ_B, 'failed', 'Media download timed out after 3 retries', 20),
  ];

  const queues: QueueStat[] = [
    { name: 'ai', waiting: 2, active: 1, completed: 1284, failed: 7, delayed: 0 },
    { name: 'whatsapp', waiting: 0, active: 0, completed: 5321, failed: 3, delayed: 1 },
    { name: 'instagram', waiting: 1, active: 0, completed: 842, failed: 12, delayed: 0 },
    { name: 'rate', waiting: 0, active: 0, completed: 2190, failed: 0, delayed: 1 },
    { name: 'notification', waiting: 0, active: 0, completed: 9903, failed: 0, delayed: 0 },
    { name: 'media', waiting: 0, active: 2, completed: 4410, failed: 5, delayed: 0 },
  ];

  const auditLogs: AuditLog[] = [
    al('usr_super', 'business.disable', 'Thread & Grain', 'biz_thread', 30),
    al('usr_owner_a', 'creative.approve', 'cr_ Ira Solitaire Ring', BIZ_A, 26),
    al('usr_owner_a', 'product.create', 'Rose Gold Mangalsutra', BIZ_A, 40),
    al('usr_super', 'featureflag.update', 'ai_captions → on (global)', null, 12),
    al('usr_owner_b', 'integration.connect', 'WhatsApp — The Crumb Story', BIZ_B, 60),
    al('usr_staff_a1', 'creative.reject', 'cr_ Meenakari Temple Jhumka', BIZ_A, 30),
    al('usr_super', 'user.role.assign', 'Ravi Trivedi → BUSINESS_ADMIN', BIZ_A, 120),
  ];

  const featureFlags: FeatureFlag[] = [
    { key: 'ai_captions', label: 'AI captions', description: 'Generate Instagram captions alongside the image.', scope: 'global', enabled: true },
    { key: 'ai_hashtags', label: 'AI hashtags', description: 'Suggest hashtags per creative.', scope: 'global', enabled: true },
    { key: 'rates_module', label: 'Rates module', description: 'Show live metal rates. Auto-on for jewellery.', scope: 'category', enabled: true },
    { key: 'whatsapp_inbound', label: 'WhatsApp inbound creatives', description: 'Allow creating creatives by sending a photo on WhatsApp.', scope: 'business', enabled: true },
    { key: 'auto_publish', label: 'Auto-publish on approval', description: 'Skip the publish queue delay after approval.', scope: 'business', enabled: false },
    { key: 'multi_platform', label: 'Facebook cross-post', description: 'Also publish approved creatives to the linked Facebook Page.', scope: 'global', enabled: false },
  ];

  const notifications: Notification[] = [
    { id: 'ntf_1', at: hoursAgo(4), kind: 'approval_pending', title: 'Approval pending', body: 'Antara Bridal Necklace Set creative is waiting on WhatsApp approval.', read: false },
    { id: 'ntf_2', at: hoursAgo(20), kind: 'publish_failure', title: 'Publish failed', body: 'Butter Croissant creative failed — Instagram token expired.', read: false },
    { id: 'ntf_3', at: daysAgo(1), kind: 'ai_complete', title: 'Creative ready', body: 'Belgian Chocolate Truffle Cake creative generated.', read: true },
    { id: 'ntf_4', at: daysAgo(26), kind: 'publish_success', title: 'Published', body: 'Ira Solitaire Ring is live on @smrjewellers.', read: true },
  ];

  return {
    categories,
    festivals,
    businesses,
    users,
    products,
    campaigns,
    creatives,
    integrations,
    rates,
    webhookEvents,
    queues,
    auditLogs,
    featureFlags,
    notifications,
  };
}

// ---------- builders ----------

function prod(
  businessId: string,
  name: string,
  sku: string,
  category: string,
  daysOld: number,
  price: number | null,
  tags: string[],
  cat: string,
  description: string,
  attributes: { label: string; value: string }[],
  aiFacts: string[],
): Product {
  return {
    id: `prd_${sku.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
    businessId,
    name,
    sku,
    category,
    description,
    price,
    currency: 'INR',
    available: true,
    status: 'active',
    tags,
    imageUrls: [placeholder(name, category), placeholder(name + '2', '')],
    attributes,
    aiFacts,
    createdAt: daysAgo(daysOld),
    updatedAt: daysAgo(Math.max(0, daysOld - 3)),
  };
}

interface CreativeSpec {
  businessId: string;
  productId: string;
  status: Creative['status'];
  source: Creative['source'];
  ageDays: number;
  history: { label: string; by: string; back: number }[];
  externalPostId?: string;
  failureReason?: string;
}

function creative(spec: CreativeSpec): Creative {
  const { businessId, productId, status, source, ageDays, history, externalPostId, failureReason } = spec;
  const cid = `cr_${Math.random().toString(36).slice(2, 8)}`;
  const versions: Creative['versions'] = [
    {
      id: `${cid}_v1`,
      createdAt: daysAgo(ageDays + 1),
      imageUrl: placeholder(cid + productId, ''),
      caption: 'Crafted for the occasion. Tap to enquire. #handcrafted',
      hashtags: ['#festivepicks', '#handcrafted', '#shoplocal'],
      note: 'Initial generation',
    },
  ];
  if (status === 'REJECTED' || status === 'FAILED') {
    versions.push({
      id: `${cid}_v2`,
      createdAt: daysAgo(ageDays),
      imageUrl: placeholder(cid + productId + '2', ''),
      caption: 'A second take with a cleaner backdrop.',
      hashtags: ['#festivepicks', '#handcrafted'],
      note: 'Regenerated after feedback',
    });
  }
  return {
    id: cid,
    businessId,
    productId,
    campaignId: null,
    status,
    source,
    createdAt: daysAgo(ageDays + 1),
    versions,
    activeVersionId: versions[versions.length - 1].id,
    history: history.map((h) => ({ at: daysAgo(h.back), label: h.label, by: h.by })),
    externalPostId,
    failureReason,
  };
}

function wh(
  type: string,
  businessId: string | null,
  status: WebhookEvent['status'],
  detail: string,
  hoursOld: number,
): WebhookEvent {
  return { id: `evt_${Math.random().toString(36).slice(2, 8)}`, at: hoursAgo(hoursOld), type, businessId, status, detail };
}

function al(actor: string, action: string, target: string, businessId: string | null, hoursOld: number): AuditLog {
  return { id: `aud_${Math.random().toString(36).slice(2, 8)}`, at: hoursAgo(hoursOld), actor, action, target, businessId };
}
