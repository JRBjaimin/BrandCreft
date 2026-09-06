# BrandCraft

Multi-tenant platform: a business sends a product photo over **WhatsApp**, an
**AI** engine turns it into an on-brand campaign creative, the business
**approves** it from WhatsApp, and it is **published to Instagram** — all driven
by per-category configuration rather than per-customer code.

See [`docs/`](./docs) for the full product overview, technical breakdown,
end-to-end roadmap, and timeline.

## Status

**Phase 1 (foundation) + Phase 2 (multi-tenancy) in progress** — see
`docs/03_END_TO_END_IMPLEMENTATION_ROADMAP.md`. The monorepo builds, and the
tenant-isolation layer is in place (guard + tenant-bound Prisma client +
demonstrator endpoints, unit-tested). No product features yet.

### Multi-tenancy model

Every business-owned row is scoped by `business_id`. Two layers enforce it:

1. **`TenantGuard`** (`src/tenancy/tenant.guard.ts`) — on any route with a
   `:businessId`, rejects callers who are not a member (or super admin) with 403,
   and stashes the proven id for `@BusinessId()`.
2. **`TenantPrismaService.forBusiness(id)`** (`src/tenancy/tenant-prisma.service.ts`)
   — a Prisma client that injects `where.businessId` on reads/updates/deletes and
   stamps `data.businessId` on creates for every model in
   `src/tenancy/tenant-models.ts`. A client bound to business A cannot touch
   business B even if an explicit id is passed.

Authentication is a stand-in until Phase 3: an `x-dev-user-id` header
(`src/auth/dev-auth.middleware.ts`, non-production only) resolves the caller and
loads memberships from the DB. The `AuthPrincipal` shape stays; Phase 3 swaps the
mechanism for JWT.

Proof: `apps/backend/test/tenant-isolation.e2e-spec.ts` (needs Postgres —
`npm run test:e2e --workspace @brandcraft/backend`).

## Layout

```
apps/
  backend/    NestJS API + Prisma + BullMQ producers   (port 4000)
  admin/      Next.js Super Admin / Business Admin      (port 3001)
  customer/   Next.js customer storefront / PWA         (port 3000)
packages/
  types/       shared domain/contract types
  validation/  shared Zod schemas (request + form validation)
  api-client/  typed fetch wrapper used by both frontends
docs/          product + engineering documentation
```

## Prerequisites

- Node.js 20 (`.nvmrc`)
- Docker (for Postgres, Redis, MinIO)

## Getting started

```bash
# 1. Install (npm workspaces)
npm install

# 2. Environment
cp .env.example .env        # then edit secrets

# 3. Infrastructure (Postgres 5432, Redis 6379, MinIO 9000/9001)
npm run infra:up

# 4. Database
npm run db:generate
npm run db:migrate          # creates the Phase 1/2 schema
npm run db:seed --workspace @brandcraft/backend

# 5. Run everything
npm run dev                 # turbo runs backend + admin + customer
```

Then open:

- Customer: http://localhost:3000
- Admin: http://localhost:3001
- API health: http://localhost:4000/api/health

## Common scripts

| Command | What it does |
|---|---|
| `npm run dev` | Run all apps in watch mode (turbo) |
| `npm run build` | Build packages + apps |
| `npm run typecheck` | Type-check every workspace |
| `npm run lint` | Lint every workspace |
| `npm run test` | Run tests (backend Jest; frontends TBD) |
| `npm run infra:up` / `infra:down` | Start / stop local Docker services |
| `npm run db:migrate` | Prisma migrate (dev) |

## Integrations

WhatsApp, Instagram/Meta, the AI provider (Gemini), and the market-rate provider
are **not** wired up yet. Phase 0 of the roadmap must validate access and terms
for each before implementation (phases 7–12). Credentials belong in `.env` only.
# BrandCreft
