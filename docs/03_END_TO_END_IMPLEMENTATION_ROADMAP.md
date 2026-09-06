# End-to-End Implementation Roadmap

## Project Strategy

Build the platform in controlled phases. Do not start by building every screen.

The highest-risk integration chain should be proven early:

```text
WhatsApp
 ↓
Webhook
 ↓
Business Identification
 ↓
Image
 ↓
AI
 ↓
Creative
 ↓
WhatsApp Preview
 ↓
Approve / Reject
 ↓
Instagram
 ↓
Published
```

## Phase Summary

| Phase | Name | Primary Areas | Status |
|---:|---|---|---|
| 0 | Discovery & Technical Validation | All | NOT_STARTED |
| 1 | Architecture & Repository Foundation | BE/FE/Infra | IN_PROGRESS |
| 2 | Database & Multi-Tenant Foundation | BE/DB | NOT_STARTED |
| 3 | Authentication & RBAC | BE/Admin/Customer | NOT_STARTED |
| 4 | Business & Category Management | Admin/BE/DB | NOT_STARTED |
| 5 | Product Catalogue & Media | FE/BE/DB/Storage | NOT_STARTED |
| 6 | Customer Storefront/PWA | Customer FE/BE | NOT_STARTED |
| 7 | WhatsApp Integration POC | BE/Integration | NOT_STARTED |
| 8 | AI Creative Engine | AI/BE/Workers | NOT_STARTED |
| 9 | Campaign & Festival Engine | FE/BE/AI | NOT_STARTED |
| 10 | WhatsApp Creative Delivery & Approval | BE/FE/Integration | NOT_STARTED |
| 11 | Instagram OAuth & Publishing | BE/Integration | NOT_STARTED |
| 12 | Rates Engine | BE/DB/FE | NOT_STARTED |
| 13 | Notifications & Analytics | FE/BE/DB | NOT_STARTED |
| 14 | Super Admin Operations | Admin/BE | NOT_STARTED |
| 15 | Security Hardening | All | NOT_STARTED |
| 16 | Privacy & Compliance | All | NOT_STARTED |
| 17 | Complete Testing & QA | All | NOT_STARTED |
| 18 | Production Infrastructure | Infra/BE | NOT_STARTED |
| 19 | Pilot Launch | All | NOT_STARTED |
| 20 | Production Launch & Continuous Improvement | All | NOT_STARTED |

**Total: 21 phases (Phase 0 → Phase 20).**

---

# Status Legend

- `NOT_STARTED`
- `IN_PROGRESS`
- `BLOCKED`
- `TESTING`
- `FAILED`
- `COMPLETED`
- `DEFERRED`

Update the Status column as implementation progresses.

---

# PHASE 0 — Discovery & Technical Validation

## Objective
Remove major assumptions before significant development.

| Work Item | Area | Deliverable | Status |
|---|---|---|---|
| Finalize PRD | Product | PRD | NOT_STARTED |
| Finalize user roles | Product/BE | RBAC matrix | NOT_STARTED |
| Confirm business categories | Product | Category model | NOT_STARTED |
| Confirm PWA-first strategy | Architecture | ADR | NOT_STARTED |
| Verify WhatsApp integration path | BE | Integration decision | NOT_STARTED |
| Verify Instagram publishing eligibility | BE | Meta integration decision | NOT_STARTED |
| Validate AI provider | AI | Provider POC | NOT_STARTED |
| Validate image quality | AI | Sample outputs | NOT_STARTED |
| Validate rate source | BE | Provider decision | NOT_STARTED |
| Review data/legal assumptions | Legal | Risk register | NOT_STARTED |

### Exit Criteria
No unresolved critical integration assumption.

---

# PHASE 1 — Architecture & Repository Foundation

## Backend
- NestJS
- TypeScript
- Prisma
- PostgreSQL connection
- Redis
- BullMQ
- Config management
- Logging
- Error handling
- Health endpoint

## Frontend
- Next.js customer app
- Next.js admin app
- Shared TypeScript types
- Shared validation
- API client
- UI foundation

## Infrastructure
- Docker
- Local development
- Environment variables
- GitHub repository
- CI pipeline

| Deliverable | Status |
|---|---|
| Monorepo | COMPLETED |
| Backend skeleton | COMPLETED |
| Admin skeleton | COMPLETED |
| Customer PWA skeleton | COMPLETED |
| CI | TESTING |
| Local Docker environment | IN_PROGRESS |

Notes (2026-09-06): npm-workspaces monorepo with turbo. `apps/backend` (NestJS +
Prisma + BullMQ producers + pino + `/api/health`), `apps/admin` and
`apps/customer` (Next.js 14 App Router; customer has PWA manifest + placeholder
service worker). Shared `packages/{types,validation,api-client}`. All workspaces
pass `build`, `typecheck`, `lint`; backend Jest is green. CI workflow written
(`.github/workflows/ci.yml`) but not yet run on GitHub. `docker-compose.yml`
(Postgres/Redis/MinIO) authored but not yet started — Docker daemon was not
running in the scaffolding environment, so the live "apps communicate with dev
backend" check is still pending.

### Exit Criteria
All applications build and communicate with development backend.

---

# PHASE 2 — Database & Multi-Tenant Foundation

## Database
Implement:
- users
- roles
- permissions
- businesses
- business_users
- business_settings
- categories
- feature_flags

## Multi-Tenancy
- business_id strategy
- tenant-aware repositories
- tenant authorization
- constraints
- indexes
- optional PostgreSQL RLS

### Critical Test
User from Business A must never retrieve Business B data.

### Exit Criteria
Tenant isolation is proven by automated tests.

---

# PHASE 3 — Authentication & RBAC

## Backend
- Login
- Logout
- Refresh
- Session management
- Password hashing
- Role/permission enforcement
- Token rotation
- Session revocation

## Admin
- Admin login
- User management
- Role assignment

## Customer
- Public access
- Optional customer account

### Exit Criteria
Unauthorized users cannot access protected resources.

---

# PHASE 4 — Business & Category Management

## Super Admin
- Create business
- Business owner
- Business type/category
- Contact
- Address
- Branding
- Feature configuration
- Enable/disable business

## Category System

```text
Category
 ├── Features
 ├── Fields
 ├── UI modules
 ├── AI rules
 └── Rate visibility
```

Example:
Jewellery enables rate module.

Restaurant does not.

### Exit Criteria
Two different business categories can be configured without code changes to the core workflow.

---

# PHASE 5 — Product Catalogue & Media

## Backend
- Product CRUD
- Categories
- Attributes
- Pricing
- Availability
- Tags
- Product status
- Media metadata

## Frontend
- Product list
- Search
- Filters
- Add/edit
- Product detail
- Image upload

## Storage
- Object storage
- Validation
- Thumbnail generation
- Image metadata
- Access control

### Exit Criteria
Business can manage a complete catalogue.

---

# PHASE 6 — Customer Storefront/PWA

## Frontend
- Business landing page
- Branding
- Product catalogue
- Product details
- Search
- Filters
- Like/favourite
- Share
- WhatsApp enquiry
- QR product pages
- Responsive design
- PWA configuration

## Backend
- Public business APIs
- Public product APIs
- Secure public identifiers
- Enquiry tracking

### Exit Criteria
A customer can open a business link/QR and contact the correct business.

---

# PHASE 7 — WhatsApp Integration POC

## Goal
Prove the highest-risk workflow before full UI development.

```text
WhatsApp
 ↓
Webhook
 ↓
Backend
 ↓
Identify Business
 ↓
Receive Image
 ↓
Store Image
```

## Backend
- Webhook verification
- Signature validation
- Event storage
- Idempotency
- Media retrieval
- Business identification
- Message parsing

## Testing
- Duplicate webhook
- Invalid signature
- Unknown number
- Unsupported media
- Large media
- Network failure

### Exit Criteria
Real test WhatsApp message reliably reaches the correct tenant.

---

# PHASE 8 — AI Creative Engine

## Backend
- AI provider abstraction
- Gemini adapter
- Prompt builder
- Context loader
- Generation service
- Usage tracking
- Versioning
- Queue
- Retry

## AI Context

```text
Business
+
Brand
+
Category
+
Product
+
Campaign
+
Festival
+
Creative rules
```

## AI Output
- Instagram image
- Optional caption
- Optional hashtags
- Generation metadata

## Quality Controls
- Product preservation
- No unsupported claims
- Correct brand
- Correct campaign
- Correct format

### Exit Criteria
Real product images generate acceptable creatives consistently enough for pilot testing.

---

# PHASE 9 — Campaign & Festival Engine

## Backend
- Festival database
- Campaign CRUD
- Campaign-product mapping
- Campaign dates
- Campaign status
- Category restrictions
- Creative rules

## Admin
Super Admin manages festival master calendar.

## Business Admin
Business can select:
- Festival
- Product
- Campaign message
- CTA
- Brand direction

## WhatsApp Interpretation

Example:

```text
"Create Janmashtami post"
```

Backend resolves:

```text
Campaign = Janmashtami
Business = current tenant
Product = supplied/matched product
Brand = stored profile
```

### Exit Criteria
AI receives deterministic campaign context rather than guessing.

---

# PHASE 10 — WhatsApp Creative Delivery & Approval

## Flow

```text
AI complete
 ↓
Creative stored
 ↓
WhatsApp preview
 ↓
PENDING_APPROVAL
```

Approval actions:

```text
APPROVE → publish queue
REJECT → stop
NO ACTION → stop
EXPIRED → stop
```

## Security
- Signed/secure action
- Expiration
- Idempotency
- Authorization
- Audit record

### Exit Criteria
Only a valid approval can trigger publishing.

---

# PHASE 11 — Instagram OAuth & Publishing

## Connection
- Meta OAuth
- Account validation
- Token storage
- Token encryption
- Connection health

## Publishing

```text
Approved
 ↓
Queue
 ↓
Instagram Worker
 ↓
API
 ↓
Publish
 ↓
External Post ID
 ↓
PUBLISHED
```

## Failure Handling
- Retry
- Backoff
- Token failure
- API failure
- Media rejection
- Final FAILED status

### Exit Criteria
An approved creative can be published and tracked.

---

# PHASE 12 — Rates Engine

## Important
Do not implement "government live rate" as an assumption.

First verify:
- Provider
- License
- API/feed
- Freshness
- Redistribution rights
- Public display rights
- Units
- Purity definitions
- Calculation methodology

## Backend
- Rate provider adapter
- Sync worker
- Current rate
- Historical rate
- Stale detection
- Provider metadata

## Frontend
Only for enabled business categories:
- Gold
- Silver
- Platinum
- Other supported rates
- Purity/category
- Unit
- Timestamp
- Source

### MVP Strategy
Use a free development source only if its terms permit the intended application usage.

### Exit Criteria
Only verified and appropriately licensed data is presented as current/live.

---

# PHASE 13 — Notifications & Analytics

## Notifications
- AI complete
- Approval pending
- Publish success
- Publish failure
- Rate failure
- WhatsApp disconnected
- Instagram disconnected

## Analytics
- Products
- Views
- Likes/favourites
- Enquiries
- Creative generations
- Approvals
- Rejections
- Publications
- Failures

### Exit Criteria
Important asynchronous events are visible and actionable.

---

# PHASE 14 — Super Admin Operations

## Dashboard
- Total businesses
- Active businesses
- Users
- Product count
- AI usage
- WhatsApp status
- Instagram status
- Rate status
- Queue health

## Operations
- Businesses
- Users
- Categories
- Features
- Festivals
- Campaigns
- AI
- WhatsApp
- Instagram
- Rates
- Audit
- Logs
- System health

### Exit Criteria
Platform can be operated without direct database edits.

---

# PHASE 15 — Security Hardening

## Test
- IDOR
- Tenant escape
- Broken access control
- JWT attacks
- Token leakage
- Webhook replay
- Duplicate webhook
- SQL injection
- XSS
- CSRF where applicable
- SSRF
- File upload abuse
- Malicious image
- Rate-limit bypass
- Approval replay
- Instagram token misuse

## Engineering
- Rate limiting
- Security headers
- Encryption
- Secret manager
- Dependency scanning
- Secret scanning
- Audit logs

### Exit Criteria
No unresolved critical/high security findings.

---

# PHASE 16 — Privacy & Compliance

Implement:
- Privacy policy
- Terms
- Consent records where applicable
- Data retention policy
- Data deletion
- Account deletion
- Processor inventory
- Social disconnect
- AI disclosure where required
- User data export/deletion processes where required

### Exit Criteria
Legal/privacy review completed before production.

---

# PHASE 17 — Complete Testing & QA

## Test Matrix

| Test Type | Scope | Status |
|---|---|---|
| Unit | BE/FE | NOT_STARTED |
| Integration | APIs | NOT_STARTED |
| E2E | Full workflow | NOT_STARTED |
| Security | OWASP-oriented | NOT_STARTED |
| Performance | API/workers | NOT_STARTED |
| Load | Concurrent tenants | NOT_STARTED |
| Webhook reliability | WhatsApp | NOT_STARTED |
| AI failure | AI pipeline | NOT_STARTED |
| Instagram failure | Publishing | NOT_STARTED |
| Rate failure | Rate engine | NOT_STARTED |
| Responsive/PWA | Customer web | NOT_STARTED |
| Accessibility | Web | NOT_STARTED |

## Mandatory E2E Scenario

```text
Admin creates Business
 ↓
Business configures branding
 ↓
Product added
 ↓
WhatsApp connected
 ↓
Instagram connected
 ↓
Product image sent
 ↓
Webhook
 ↓
AI
 ↓
Creative
 ↓
WhatsApp preview
 ↓
Approve
 ↓
Instagram
 ↓
Published
 ↓
Audit
```

### Negative Tests

```text
Reject → no post
No response → no post
Expired approval → no post
Duplicate approval → one/no additional post
Invalid tenant → reject
Invalid webhook → reject
AI failure → recover/fail safely
Instagram failure → retry/fail safely
Rate provider failure → stale status
```

### Exit Criteria
Production acceptance test passes.

---

# PHASE 18 — Production Infrastructure

## Architecture

```text
Load Balancer
      ↓
API Containers
      ↓
Worker Containers
      ↓
PostgreSQL
Redis
Object Storage
```

Implement:
- Production domain
- SSL
- Secrets manager
- Database backups
- Object storage
- Monitoring
- Alerting
- Error tracking
- Log aggregation
- Queue monitoring
- Disaster recovery
- CI/CD
- Environment separation

### Exit Criteria
Production environment is reproducible and monitored.

---

# PHASE 19 — Pilot Launch

Start with a small number of real businesses.

Recommended pilot:
- 1 jewellery business
- 1 restaurant/bakery
- 1 additional non-jewellery category

Measure:
- AI creative acceptance rate
- Regeneration rate
- Approval rate
- Instagram publishing success
- WhatsApp delivery success
- Customer engagement
- Product enquiries
- Rate accuracy/freshness
- Operational support issues

### Exit Criteria
Pilot meets agreed acceptance KPIs.

---

# PHASE 20 — Production Launch & Continuous Improvement

## Launch Checklist

| Item | Status |
|---|---|
| Domain | NOT_STARTED |
| SSL | NOT_STARTED |
| Production DB | NOT_STARTED |
| Backups | NOT_STARTED |
| Storage | NOT_STARTED |
| WhatsApp | NOT_STARTED |
| Instagram | NOT_STARTED |
| AI | NOT_STARTED |
| Rate Provider | NOT_STARTED |
| Monitoring | NOT_STARTED |
| Error Tracking | NOT_STARTED |
| Privacy | NOT_STARTED |
| Terms | NOT_STARTED |
| Support | NOT_STARTED |
| Billing/Subscription | NOT_STARTED |

## Post-Launch
- Monitor AI quality
- Monitor API costs
- Monitor queue latency
- Monitor failures
- Review user feedback
- Add categories
- Add AI providers if necessary
- Add rate providers if necessary
- Optimize infrastructure
- Evaluate native mobile app only after usage evidence

---

# Cross-Phase Dependency Map

```text
Phase 0
  ↓
Phase 1
  ↓
Phase 2
  ↓
Phase 3
  ↓
Phase 4
  ↓
Phase 5
  ↓
Phase 6

Phase 7 ───────────────┐
                       ↓
Phase 8 → Phase 9 → Phase 10 → Phase 11

Phase 12 ───────────── independent business capability
Phase 13
Phase 14
Phase 15
Phase 16
Phase 17
Phase 18
Phase 19
Phase 20
```

Some tracks can run in parallel after their dependencies are satisfied.

---

# Recommended First Implementation Order

Do not spend weeks building UI before proving the integration.

## First Technical Milestone

```text
1. Create development business
2. Configure test WhatsApp
3. Receive webhook
4. Identify business
5. Receive product image
6. Store image
7. Send image to Gemini
8. Generate creative
9. Send creative to WhatsApp
10. Implement Approve/Reject
11. Connect test Instagram
12. Publish approved creative
13. Store result
14. Audit the workflow
```

Once this works with real test credentials, continue with the broader product.

---

# Project Status Dashboard

Update this table during development.

| Phase | Status | Owner | Start | Target | Notes |
|---:|---|---|---|---|---|
| 0 | NOT_STARTED | | | | Run in parallel with Phase 1 |
| 1 | IN_PROGRESS | | 2026-09-06 | | Monorepo scaffolded; build/typecheck/lint/test green; Docker + CI verification pending |
| 2 | NOT_STARTED | | | | |
| 3 | NOT_STARTED | | | | |
| 4 | NOT_STARTED | | | | |
| 5 | NOT_STARTED | | | | |
| 6 | NOT_STARTED | | | | |
| 7 | NOT_STARTED | | | | |
| 8 | NOT_STARTED | | | | |
| 9 | NOT_STARTED | | | | |
| 10 | NOT_STARTED | | | | |
| 11 | NOT_STARTED | | | | |
| 12 | NOT_STARTED | | | | |
| 13 | NOT_STARTED | | | | |
| 14 | NOT_STARTED | | | | |
| 15 | NOT_STARTED | | | | |
| 16 | NOT_STARTED | | | | |
| 17 | NOT_STARTED | | | | |
| 18 | NOT_STARTED | | | | |
| 19 | NOT_STARTED | | | | |
| 20 | NOT_STARTED | | | | |

---

# Final Architecture Decision

## Frontend
- Next.js Customer PWA/Web
- Next.js Super Admin/Business Admin Web
- Native mobile apps deferred

## Backend
- Node.js
- NestJS
- TypeScript
- Prisma

## Data
- PostgreSQL
- Redis
- Object storage

## Async
- BullMQ
- Dedicated workers

## AI
- Provider abstraction
- Gemini initially
- Free development tier where available and permitted
- Paid/fallback provider later if required

## Integrations
- Official WhatsApp Business Platform
- Official Meta/Instagram APIs
- Verified/licensed rate source

## Core Principle

Build once as a configurable multi-tenant platform, then sell it to multiple business categories without rebuilding the core system.
