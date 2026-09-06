# @brandcraft/admin

The BrandCraft admin console — **Super Admin** platform operations and
**Business Admin** management, in one Next.js 14 (App Router) app.

## Status: complete as a mock-data frontend

Runs entirely against an in-memory dataset (`lib/mock/`) persisted to
`localStorage`. **No backend calls.** Every create / edit / approve / toggle
works and survives a reload. Auth is a stub — any email + password signs you in;
the login screen picks Super Admin vs Business Admin.

To go live later, replace the action bodies in `lib/mock/store.tsx` and the
resolver in `lib/auth.tsx` with `@brandcraft/api-client` calls. The component
tree, types (`lib/types.ts`) and routes don't change.

## Run

```bash
npm run dev --workspace @brandcraft/admin     # http://localhost:3001
```

Sign in with the pre-filled `meera@smrjewellers.in` / any password, or flip to
Super Admin. "Reset demo data" (bottom of any list) restores the seed.

## Routes

**Business Admin** (`app/(app)/…`)

| Route | What |
|---|---|
| `/dashboard` | Stat tiles, recent activity, integration + rate status |
| `/products`, `/products/new`, `/products/[id]` | Catalogue CRUD, attributes, AI-safe facts |
| `/campaigns` | Festival campaigns — create/edit modal, product linking, CTA |
| `/creatives` | AI creative grid + detail drawer: versions, caption/hashtags, approve / reject / regenerate / retry-publish, history timeline |
| `/integrations` | Instagram + WhatsApp connect/disconnect, token status, publish history |
| `/rates` | Metal rates (jewellery only) — live/stale, change %, purity, methodology |
| `/profile` | Business profile, branding (colours, tone), contact & socials |

**Super Admin** (`app/(app)/admin/…`)

| Route | What |
|---|---|
| `/admin` | Platform overview — businesses, users, AI usage, system health, audit feed |
| `/admin/businesses` | All tenants; create, enable/disable, jump into a business console |
| `/admin/users` | Users across the platform; add, toggle active, edit roles |
| `/admin/platform` | Categories, feature-flag toggles, festival calendar, provider settings |
| `/admin/operations` | Webhook events, queue health, audit log, system status |

## Layout

```
app/
  layout.tsx            providers: Auth · Data(mock) · Toast
  login/                mock sign-in
  (app)/layout.tsx      authed shell — sidebar + topbar + console gate
  (app)/…               the routes above
components/              ui primitives, overlay (modal/drawer/confirm), shell,
                         status badges, product/campaign forms, toasts
lib/
  types.ts              domain types (mirror the future API)
  mock/seed.ts          seed dataset (2 live businesses + 1 disabled)
  mock/store.tsx        useData() — state + actions + localStorage
  auth.tsx              useAuth() — mock session + console switcher
  format.ts             inr(), relTime(), placeholder() SVG images, …
```

Design system lives in `app/globals.css` (CSS variables, light/dark aware).
