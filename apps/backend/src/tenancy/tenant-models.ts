/**
 * Prisma models that carry a `businessId` column and must never be queried
 * without a tenant filter. Later phases append their tables here (products,
 * enquiries, ai_generations, campaigns, social_creatives, ...).
 *
 * `Business` itself is NOT in this list: it is scoped by its own `id` and is
 * gated by TenantGuard + service-level filtering, not by this column rewrite.
 */
export const TENANT_SCOPED_MODELS: ReadonlySet<string> = new Set([
  'BusinessUser',
  'BusinessSetting',
  'FeatureFlag',
]);
