# Multi-Tenant AI Commerce & Marketing Platform — Project Overview

## 1. Executive Summary
A multi-tenant SaaS platform for businesses such as jewellery stores, restaurants, bakeries, cake shops, medical stores, stationery shops, and influencers.

The platform combines:
- Business/store management
- Product catalogue
- Customer-facing public storefront/PWA
- WhatsApp-based product submission and communication
- AI-generated Instagram creatives
- Festival/campaign-aware creative generation
- Explicit WhatsApp approval before Instagram publishing
- Instagram/Meta integration
- Category-specific features through configurable business templates
- Market-rate display where a verified/licensed data source permits it
- Analytics, notifications, audit logs, and administration

The architecture must be multi-tenant from day one. Every business's data must remain isolated.

## 2. Core Product Concept

```text
SUPER ADMIN
    ↓
Create Business / Shop
    ↓
Business Owner/Admin
    ↓
Configure Branding + Category + Products + Settings
    ↓
Customer Public Storefront / PWA
    ↓
WhatsApp + AI Marketing Workflow
    ↓
AI Creative
    ↓
WhatsApp Preview
    ↓
APPROVE
    ↓
Instagram Publish
```

## 3. Business Categories

The platform is not jewellery-only.

Examples:
- Jewellery
- Restaurant
- Bakery
- Cake Shop
- Medical Store
- Stationery
- Clothing
- Electronics
- Salon
- Influencer/Creator
- Future categories

Each category has a configurable feature set.

Example:
- Jewellery → gold/silver/platinum/diamond information, jewellery attributes
- Restaurant → menu, cuisine, meal categories, offers
- Bakery → cakes, flavours, sizes, occasions
- Stationery → product categories, brands, offers

Do not hard-code jewellery features into the core platform.

## 4. User Roles

| Role | Responsibility |
|---|---|
| SUPER_ADMIN | Full platform control |
| PLATFORM_ADMIN | Business/platform operations |
| BUSINESS_OWNER | Own business |
| BUSINESS_ADMIN | Business management |
| STAFF | Limited operational access |
| SOCIAL_MEDIA_MANAGER | Creative approval/social publishing |
| CUSTOMER | Public/customer experience |

Use granular permissions in addition to roles.

## 5. Core Workflow — AI Instagram

### Input
A shopkeeper sends a product image to the registered WhatsApp Business number.

Optional message:
- "Create Instagram post"
- "Janmashtami post"
- "Diwali offer"
- "Festival post"
- "Create post for this product"

### Context automatically supplied by backend
- Business identity
- Business category
- Business name
- Logo
- Brand colors
- Brand style
- Product details
- Product category
- Festival/campaign
- Approved marketing rules
- Required output format

The shopkeeper should not need to repeat information already stored in the business profile.

### AI flow

```text
WhatsApp
  ↓
Webhook
  ↓
Identify Business
  ↓
Validate Message + Media
  ↓
Store Original Image
  ↓
Match/identify Product
  ↓
Load Business Context
  ↓
Load Campaign/Festival Context
  ↓
Create Structured AI Prompt
  ↓
Gemini (initial provider)
  ↓
Generate Creative
  ↓
Validate Output
  ↓
Store Version
  ↓
Send Preview to WhatsApp
  ↓
PENDING_APPROVAL
```

## 6. Festival/Campaign Intelligence

The platform must understand explicit campaign intent.

Example:

```text
Image + "Janmashtami post"
```

Backend identifies:
- Business = SMR Jewellers
- Category = Jewellery
- Campaign = Janmashtami
- Product = selected/matched product
- Brand style = SMR's stored configuration

AI receives structured context rather than a vague prompt.

The system should also support a centrally managed festival/campaign calendar.

Examples:
- Janmashtami
- Diwali
- Navratri
- Raksha Bandhan
- Dussehra
- Christmas
- New Year
- Valentine's Day
- Eid
- Holi
- Akshaya Tritiya
- Category-specific campaigns

Important: AI must not invent product facts, prices, specifications, certifications, or offers.

## 7. Approval Rule

This is a critical business rule.

```text
Generated
   ↓
PENDING_APPROVAL
   ↓
 ┌───────────────┐
 │               │
REJECT         APPROVE
 │               │
STOP          PUBLISH JOB
                 ↓
             Instagram
```

Rules:
- Reject = never publish
- No response = never publish
- Expired approval = never publish
- Only valid approval can create a publishing job
- Approval must be authenticated/authorized
- Approval action must be auditable
- Replay of an old approval must not publish again

## 8. Multi-Tenant Model

Example:

```text
Business A
 ├── Users
 ├── Branding
 ├── Products
 ├── WhatsApp
 ├── Instagram
 ├── AI Creatives
 ├── Campaigns
 └── Category Features

Business B
 ├── Users
 ├── Branding
 ├── Products
 ├── WhatsApp
 ├── Instagram
 ├── AI Creatives
 ├── Campaigns
 └── Category Features
```

Every business-owned record should carry `business_id`.

Tenant isolation must be enforced in:
1. API authorization
2. Service/repository queries
3. Database constraints
4. Optional PostgreSQL Row-Level Security

Never rely on frontend filtering.

## 9. Customer Experience

Customer accesses the business storefront/PWA.

Typical flow:

```text
QR / Link
  ↓
Business Store
  ↓
Product Catalogue
  ↓
Product Details
  ↓
Like / Favourite / Share
  ↓
WhatsApp Enquiry
```

The customer should see only the selected business's catalogue and branding.

## 10. Rates Module

For jewellery businesses, the platform may display market/reference rates for:
- Gold
- Silver
- Platinum
- Other supported instruments

Important distinctions:
- A market/reference rate is not automatically the shop's selling price.
- Diamond does not have one universal government live retail price in the same way gold purity benchmarks may exist.
- Do not label data "live" unless freshness and source are known.
- Store source, timestamp, currency/unit, purity, and provider metadata.
- Do not claim "government approved" unless the source and authorization actually support that claim.

### Initial strategy
Use a free/low-cost development data source for MVP experimentation where its terms permit the intended use and redistribution.

Before production:
- Verify provider identity
- Verify API/feed
- Verify freshness
- Verify license
- Verify redistribution/display rights
- Verify rate calculation methodology
- Add source attribution
- Implement stale-data detection

## 11. Recommended Architecture

```text
                         ┌─────────────────────┐
                         │ Next.js Admin Web    │
                         └──────────┬──────────┘
                                    │
┌─────────────────────┐             │
│ Customer PWA/Web     │────────────┤
└─────────────────────┘             │
                                    ▼
                         ┌─────────────────────┐
                         │ NestJS Backend API  │
                         └──────────┬──────────┘
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
 PostgreSQL                       Redis                     Object Storage
 Database                         Queue                      S3/R2/GCS
       │                            │
       │                 ┌──────────┼──────────┐
       │                 ▼          ▼          ▼
       │              AI Worker  WA Worker  Instagram Worker
       │
       └──────────────────────┬───────────────────────────────
                              ▼
                  WhatsApp / Meta / AI / Rate Provider
```

## 12. Technology Direction

| Layer | Recommendation |
|---|---|
| Admin Web | Next.js + TypeScript |
| Customer Web/PWA | Next.js + TypeScript |
| Backend | Node.js + NestJS + TypeScript |
| ORM | Prisma |
| Database | PostgreSQL |
| Queue/Cache | Redis + BullMQ |
| Storage | S3 / Cloudflare R2 / GCS |
| AI | Provider abstraction, Gemini initially |
| WhatsApp | Official WhatsApp Business Platform |
| Social | Meta/Instagram APIs |
| Authentication | JWT + refresh-token rotation |
| Monitoring | Sentry + structured logs |
| CI/CD | GitHub Actions |
| Containers | Docker |
| Testing | Jest + Supertest + Playwright/E2E |

## 13. Why PWA/Web First

### Build first
- Super Admin Web
- Business Admin Web
- Customer-facing responsive Web/PWA

### Do not initially build
- Native customer mobile app
- Native shopkeeper mobile app

Reasons:
1. Faster MVP
2. Lower initial cost
3. No app-store installation friction
4. Easier catalogue sharing through links/QR
5. Admin work is better on desktop
6. Easier iteration
7. One responsive customer experience
8. Real usage can validate whether native apps are justified

Native React Native apps can be added later if usage demonstrates strong demand.

## 14. Core Database Domains

```text
Identity
Business/Tenant
Business Users
Branding
Category Configuration
Products
Product Images
Product Prices
Customer Profiles
Favourites/Likes
Enquiries
WhatsApp
AI Generations
AI Generation Versions
Campaigns/Festivals
Social Accounts
Creative Approvals
Social Posts
Market Rates
Notifications
Audit Logs
Feature Flags
System Settings
API Usage
```

## 15. Non-Negotiable Engineering Principles

1. Multi-tenant from day one.
2. Backend owns secrets.
3. Never trust frontend authorization.
4. Webhooks must be idempotent.
5. AI and publishing must use queues.
6. Original product images remain immutable.
7. AI outputs are versioned.
8. AI cannot invent product facts.
9. Reject and no-response never publish.
10. Only valid approval can publish.
11. External credentials must be encrypted.
12. Audit important actions.
13. Do not assume free APIs remain free.
14. Do not call market data live without known freshness.
15. Production integrations must comply with provider terms.

## 16. Definition of Done — Core Scenario

```text
1. Super Admin creates a business.
2. Business owner is created.
3. Business category and branding are configured.
4. WhatsApp Business is connected.
5. Instagram is connected.
6. Product is created.
7. Customer opens public product page.
8. Customer starts WhatsApp enquiry.
9. Shopkeeper sends product image.
10. Backend receives webhook.
11. Backend validates business and media.
12. Image is stored.
13. AI job is queued.
14. Business/campaign/product context is loaded.
15. AI generates creative.
16. Creative is stored and versioned.
17. Creative is sent to WhatsApp.
18. Status becomes PENDING_APPROVAL.
19. Reject produces no publication.
20. Approve creates a publishing job.
21. Instagram worker validates credentials.
22. Instagram post is published.
23. External post ID is stored.
24. Status becomes PUBLISHED.
25. Audit record is created.
26. Admin can inspect the complete workflow.
```

## 17. Major Risks

- Meta/WhatsApp API eligibility and messaging restrictions
- Instagram publishing limitations
- AI image quality inconsistency
- Product identity mismatch
- AI altering jewellery/product appearance
- Copyright/trademark issues in campaign assets
- Market-rate source licensing
- Stale or incorrect rates
- Tenant data leakage
- Webhook duplication/replay
- Approval replay
- Large image processing costs
- Free-tier limits
- Vendor lock-in

## 18. Strategic Recommendation

Build the platform as a configurable multi-tenant SaaS, not as a jewellery-only application.

The jewellery use case is the first vertical, but the architecture should allow new business categories without rewriting the core platform.
