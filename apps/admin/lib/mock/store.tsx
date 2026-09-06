'use client';

/**
 * In-memory mock data store for the admin console, persisted to localStorage.
 * This stands in for the backend API entirely (BE/DB are out of scope for now).
 * Every screen reads and writes through `useData()`. To go live later, replace
 * the action bodies with `@brandcraft/api-client` calls.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { buildSeed, SEED_VERSION, type Dataset } from './seed';
import { daysAgo, id } from '../format';
import type {
  Business,
  Campaign,
  Creative,
  Product,
  Role,
  User,
} from '../types';

const KEY = `brandcraft.admin.mock.v${SEED_VERSION}`;

function loadStored(): Dataset | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Dataset;
  } catch {
    /* ignore */
  }
  return null;
}

interface DataApi {
  data: Dataset;
  reset: () => void;

  // businesses
  createBusiness: (input: Pick<Business, 'name' | 'categoryKey' | 'email' | 'phone'> & { ownerName: string }) => Business;
  updateBusiness: (id: string, patch: Partial<Business>) => void;
  setBusinessStatus: (id: string, status: Business['status']) => void;

  // users
  createUser: (input: { name: string; email: string; roles: Role[]; businessId: string | null }) => void;
  setUserActive: (id: string, isActive: boolean) => void;
  setUserRoles: (id: string, roles: Role[]) => void;

  // products
  createProduct: (input: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'currency'>) => Product;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // campaigns
  createCampaign: (input: Omit<Campaign, 'id' | 'createdAt'>) => Campaign;
  updateCampaign: (id: string, patch: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;

  // creatives
  approveCreative: (id: string, by: string) => void;
  rejectCreative: (id: string, by: string, reason: string) => void;
  regenerateCreative: (id: string, by: string) => void;
  retryPublish: (id: string, by: string) => void;
  setActiveVersion: (id: string, versionId: string) => void;

  // integrations
  setIntegration: (businessId: string, channel: 'instagram' | 'whatsapp', connected: boolean) => void;

  // platform
  toggleFlag: (key: string) => void;
  markNotificationsRead: () => void;
}

const Ctx = createContext<DataApi | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  // Start from the seed so server and first client render match, then hydrate
  // from localStorage after mount.
  const [data, setData] = useState<Dataset>(() => buildSeed());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadStored();
    if (stored) setData(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      /* ignore quota / private mode */
    }
  }, [data, hydrated]);

  const reset = useCallback(() => setData(buildSeed()), []);

  const createBusiness = useCallback<DataApi['createBusiness']>((input) => {
    const ownerId = id('usr');
    const biz: Business = {
      id: id('biz'),
      name: input.name,
      slug: input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      status: 'ACTIVE',
      categoryKey: input.categoryKey,
      plan: 'trial',
      ownerUserId: ownerId,
      description: '',
      gstin: '',
      phone: input.phone,
      email: input.email,
      address: { line1: '', city: '', state: '', pincode: '' },
      socials: {},
      branding: { logoUrl: null, coverUrl: null, colors: ['#4f46e5'], tone: '' },
      features: { campaigns: true, ai_creatives: true, whatsapp: true, instagram: true, catalogue: true },
      createdAt: new Date().toISOString(),
    };
    const owner: User = {
      id: ownerId,
      name: input.ownerName,
      email: input.email,
      roles: ['BUSINESS_OWNER'],
      businessId: biz.id,
      isActive: true,
      lastActiveAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    setData((d) => ({ ...d, businesses: [biz, ...d.businesses], users: [owner, ...d.users] }));
    return biz;
  }, []);

  const updateBusiness = useCallback<DataApi['updateBusiness']>((bid, patch) => {
    setData((d) => ({
      ...d,
      businesses: d.businesses.map((b) => (b.id === bid ? { ...b, ...patch } : b)),
    }));
  }, []);

  const setBusinessStatus = useCallback<DataApi['setBusinessStatus']>((bid, status) => {
    setData((d) => ({
      ...d,
      businesses: d.businesses.map((b) => (b.id === bid ? { ...b, status } : b)),
    }));
  }, []);

  const createUser = useCallback<DataApi['createUser']>((input) => {
    const u: User = {
      id: id('usr'),
      name: input.name,
      email: input.email,
      roles: input.roles,
      businessId: input.businessId,
      isActive: true,
      lastActiveAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    setData((d) => ({ ...d, users: [u, ...d.users] }));
  }, []);

  const setUserActive = useCallback<DataApi['setUserActive']>((uid, isActive) => {
    setData((d) => ({ ...d, users: d.users.map((u) => (u.id === uid ? { ...u, isActive } : u)) }));
  }, []);

  const setUserRoles = useCallback<DataApi['setUserRoles']>((uid, roles) => {
    setData((d) => ({ ...d, users: d.users.map((u) => (u.id === uid ? { ...u, roles } : u)) }));
  }, []);

  const createProduct = useCallback<DataApi['createProduct']>((input) => {
    const now = new Date().toISOString();
    const p: Product = { ...input, id: id('prd'), currency: 'INR', createdAt: now, updatedAt: now };
    setData((d) => ({ ...d, products: [p, ...d.products] }));
    return p;
  }, []);

  const updateProduct = useCallback<DataApi['updateProduct']>((pid, patch) => {
    setData((d) => ({
      ...d,
      products: d.products.map((p) =>
        p.id === pid ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p,
      ),
    }));
  }, []);

  const deleteProduct = useCallback<DataApi['deleteProduct']>((pid) => {
    setData((d) => ({ ...d, products: d.products.filter((p) => p.id !== pid) }));
  }, []);

  const createCampaign = useCallback<DataApi['createCampaign']>((input) => {
    const c: Campaign = { ...input, id: id('cmp'), createdAt: new Date().toISOString() };
    setData((d) => ({ ...d, campaigns: [c, ...d.campaigns] }));
    return c;
  }, []);

  const updateCampaign = useCallback<DataApi['updateCampaign']>((cid, patch) => {
    setData((d) => ({
      ...d,
      campaigns: d.campaigns.map((c) => (c.id === cid ? { ...c, ...patch } : c)),
    }));
  }, []);

  const deleteCampaign = useCallback<DataApi['deleteCampaign']>((cid) => {
    setData((d) => ({ ...d, campaigns: d.campaigns.filter((c) => c.id !== cid) }));
  }, []);

  const mutateCreative = (cid: string, fn: (c: Creative) => Creative) =>
    setData((d) => ({ ...d, creatives: d.creatives.map((c) => (c.id === cid ? fn(c) : c)) }));

  const approveCreative = useCallback<DataApi['approveCreative']>((cid, by) => {
    mutateCreative(cid, (c) => ({
      ...c,
      status: 'APPROVED',
      history: [...c.history, { at: new Date().toISOString(), label: 'Approved', by }],
    }));
  }, []);

  const rejectCreative = useCallback<DataApi['rejectCreative']>((cid, by, reason) => {
    mutateCreative(cid, (c) => ({
      ...c,
      status: 'REJECTED',
      history: [...c.history, { at: new Date().toISOString(), label: `Rejected — ${reason}`, by }],
    }));
  }, []);

  const regenerateCreative = useCallback<DataApi['regenerateCreative']>((cid, by) => {
    mutateCreative(cid, (c) => {
      const v = {
        id: `${cid}_v${c.versions.length + 1}`,
        createdAt: new Date().toISOString(),
        imageUrl: c.versions[0]?.imageUrl ?? '',
        caption: c.versions[c.versions.length - 1]?.caption ?? '',
        hashtags: c.versions[c.versions.length - 1]?.hashtags ?? [],
        note: 'Regenerated from admin',
      };
      return {
        ...c,
        status: 'GENERATED',
        versions: [...c.versions, v],
        activeVersionId: v.id,
        history: [...c.history, { at: new Date().toISOString(), label: 'Regenerated', by }],
      };
    });
  }, []);

  const retryPublish = useCallback<DataApi['retryPublish']>((cid, by) => {
    mutateCreative(cid, (c) => ({
      ...c,
      status: 'PUBLISHED',
      failureReason: undefined,
      externalPostId: `IG_${Math.floor(Math.random() * 1e17)}`,
      history: [
        ...c.history,
        { at: new Date().toISOString(), label: 'Retried publish', by },
        { at: new Date().toISOString(), label: 'Published to Instagram', by: 'system' },
      ],
    }));
  }, []);

  const setActiveVersion = useCallback<DataApi['setActiveVersion']>((cid, versionId) => {
    mutateCreative(cid, (c) => ({ ...c, activeVersionId: versionId }));
  }, []);

  const setIntegration = useCallback<DataApi['setIntegration']>((businessId, channel, connected) => {
    setData((d) => ({
      ...d,
      integrations: d.integrations.map((i) => {
        if (i.businessId !== businessId) return i;
        if (channel === 'instagram') {
          return {
            ...i,
            instagram: connected
              ? { state: 'connected', accountHandle: i.instagram.accountHandle ?? '@account', tokenExpiresAt: daysAgo(-60), lastPublishAt: i.instagram.lastPublishAt }
              : { state: 'disconnected', accountHandle: null, tokenExpiresAt: null, lastPublishAt: i.instagram.lastPublishAt },
          };
        }
        return {
          ...i,
          whatsapp: connected
            ? { state: 'connected', phoneNumber: i.whatsapp.phoneNumber ?? '+91 00000 00000', displayName: i.whatsapp.displayName ?? 'Business', lastEventAt: new Date().toISOString() }
            : { state: 'disconnected', phoneNumber: null, displayName: null, lastEventAt: i.whatsapp.lastEventAt },
        };
      }),
    }));
  }, []);

  const toggleFlag = useCallback<DataApi['toggleFlag']>((key) => {
    setData((d) => ({
      ...d,
      featureFlags: d.featureFlags.map((f) => (f.key === key ? { ...f, enabled: !f.enabled } : f)),
    }));
  }, []);

  const markNotificationsRead = useCallback<DataApi['markNotificationsRead']>(() => {
    setData((d) => ({ ...d, notifications: d.notifications.map((n) => ({ ...n, read: true })) }));
  }, []);

  const api = useMemo<DataApi>(
    () => ({
      data,
      reset,
      createBusiness,
      updateBusiness,
      setBusinessStatus,
      createUser,
      setUserActive,
      setUserRoles,
      createProduct,
      updateProduct,
      deleteProduct,
      createCampaign,
      updateCampaign,
      deleteCampaign,
      approveCreative,
      rejectCreative,
      regenerateCreative,
      retryPublish,
      setActiveVersion,
      setIntegration,
      toggleFlag,
      markNotificationsRead,
    }),
    [
      data,
      reset,
      createBusiness,
      updateBusiness,
      setBusinessStatus,
      createUser,
      setUserActive,
      setUserRoles,
      createProduct,
      updateProduct,
      deleteProduct,
      createCampaign,
      updateCampaign,
      deleteCampaign,
      approveCreative,
      rejectCreative,
      regenerateCreative,
      retryPublish,
      setActiveVersion,
      setIntegration,
      toggleFlag,
      markNotificationsRead,
    ],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useData(): DataApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useData must be used within <DataProvider>');
  return ctx;
}
