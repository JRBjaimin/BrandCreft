import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TENANT_SCOPED_MODELS } from './tenant-models';

type AnyArgs = { where?: Record<string, unknown>; data?: unknown };

// Operations whose `where` must be narrowed to the tenant.
const WHERE_SCOPED_OPS = new Set([
  'findFirst',
  'findFirstOrThrow',
  'findMany',
  'count',
  'aggregate',
  'groupBy',
  'updateMany',
  'deleteMany',
  'update',
  'delete',
]);

// `findUnique` only accepts unique selectors in `where`, so we cannot always add
// `businessId` to it. Rather than risk an unscoped read, forbid it on tenant
// models through the scoped client and point callers at `findFirst`.
const FORBIDDEN_OPS = new Set(['findUnique', 'findUniqueOrThrow']);

/**
 * Produces a Prisma client that is permanently bound to one business.
 *
 * For every tenant-scoped model (see tenant-models.ts) it injects
 * `where.businessId` on reads/updates/deletes and stamps `data.businessId` on
 * creates. A caller holding a client for business A therefore cannot read or
 * mutate business B's rows even if it passes an explicit id.
 *
 * Non-tenant models (User, Role, Category, Business, ...) pass through untouched.
 */
@Injectable()
export class TenantPrismaService {
  constructor(private readonly prisma: PrismaService) {}

  forBusiness(businessId: string) {
    return this.prisma.$extends({
      name: 'tenant-scope',
      query: {
        $allModels: {
          $allOperations({ model, operation, args, query }) {
            if (!model || !TENANT_SCOPED_MODELS.has(model)) {
              return query(args);
            }
            if (FORBIDDEN_OPS.has(operation)) {
              throw new Error(
                `tenant-scope: ${operation} is not allowed on ${model}; use findFirst so the businessId filter can be applied`,
              );
            }

            const a = (args ?? {}) as AnyArgs;

            if (WHERE_SCOPED_OPS.has(operation)) {
              a.where = { ...(a.where ?? {}), businessId };
            }

            if (operation === 'create') {
              a.data = { ...((a.data as Record<string, unknown>) ?? {}), businessId };
            }

            if (operation === 'createMany') {
              const data = (a.data as Record<string, unknown>[] | Record<string, unknown>) ?? [];
              a.data = Array.isArray(data)
                ? data.map((row) => ({ ...row, businessId }))
                : { ...data, businessId };
            }

            if (operation === 'upsert') {
              a.where = { ...(a.where ?? {}), businessId };
              const u = a as unknown as { create?: Record<string, unknown> };
              u.create = { ...(u.create ?? {}), businessId };
            }

            return query(a);
          },
        },
      },
    });
  }
}

export type TenantPrismaClient = ReturnType<TenantPrismaService['forBusiness']>;
