/**
 * Shared Zod schemas. Used by the backend for request validation and by the
 * frontend apps for form validation, so the contract lives in one place.
 */
import { z } from 'zod';

export const emailSchema = z.string().email().max(320);
export const passwordSchema = z
  .string()
  .min(10, 'Password must be at least 10 characters')
  .max(200);

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});
export type RefreshInput = z.infer<typeof refreshSchema>;

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
export type PaginationInput = z.infer<typeof paginationSchema>;

export const businessSlugSchema = z
  .string()
  .min(2)
  .max(60)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens');

export const createBusinessSchema = z.object({
  name: z.string().min(2).max(120),
  slug: businessSlugSchema,
  categoryKey: z.string().min(2).max(60),
  ownerEmail: emailSchema,
});
export type CreateBusinessInput = z.infer<typeof createBusinessSchema>;

const hexColor = z.string().regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Expected a hex colour');

export const updateBusinessSettingsSchema = z
  .object({
    brandColors: z.array(hexColor).max(12).optional(),
    brandTone: z.string().max(500).nullable().optional(),
    timezone: z.string().min(1).max(64).optional(),
    locale: z.string().min(2).max(35).optional(),
  })
  .strict();
export type UpdateBusinessSettingsInput = z.infer<typeof updateBusinessSettingsSchema>;
