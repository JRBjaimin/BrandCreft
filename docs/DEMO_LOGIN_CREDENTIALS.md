# Demo Login Credentials — Admin Console

Applies to `apps/admin` only (http://localhost:3001). This is a **mock login** —
there is no real backend authentication yet (see
`docs/03_END_TO_END_IMPLEMENTATION_ROADMAP.md`, Phase 3). Credentials are
matched in-browser against `apps/admin/lib/mock/seed.ts` by
`apps/admin/lib/demo-accounts.ts`.

The customer storefront (`apps/customer`) has no login at all — it's public,
reached directly by URL (e.g. `/smr-jewellers`), per the product design.

## Super Admin

Sees every business, can create/enable/disable tenants, and manage
platform-wide config (`/admin/*`).

| Login (email or username) | Password |
|---|---|
| `admin` | `admin` |
| `superadmin` | `superadmin` |

Both sign in as the same account: **Platform Admin** (`admin@brandcraft.io`).

## Business logins

Each business's login id **is its own name**, lowercased with spaces/punctuation
removed — password is identical to the id. Only **active** businesses can log
in; a disabled business has no working login.

| Business | Category | Login id / password |
|---|---|---|
| SMR Jewellers | Jewellery | `smrjewellers` |
| The Crumb Story | Bakery & Cake Shop | `thecrumbstory` |
| ~~Thread & Grain~~ | Apparel | *(disabled — no login)* |

Signing in as a business logs you in as that business's owner (e.g.
`smrjewellers` signs in as **Meera Shah**) and lands on `/dashboard`, scoped
to only that business's products, campaigns, and creatives.

## How to get from Super Admin into a specific business

Two ways, both call the same underlying "switch into this business" action:

1. **Home screen cards** (`/admin`) — click any business card.
2. **Businesses table** (`/admin/businesses`) — click "Open" on any row.

## Adding a new demo business

Create one from `/admin/businesses` → *Create business*. Its login is
generated the same way automatically — no code change needed — using its
name, lowercased with spaces/punctuation stripped, as both id and password.
