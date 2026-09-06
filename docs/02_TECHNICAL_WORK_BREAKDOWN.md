# Technical Work Breakdown — Frontend, Backend, AI, Data & Integrations

## 1. System Layers

| Layer | Main Responsibility |
|---|---|
| Customer Web/PWA | Public storefront, catalogue, product discovery |
| Business Admin Web | Business/product/creative/settings management |
| Super Admin Web | Tenant/platform operations |
| Backend API | Business logic, authorization, integrations |
| Workers | AI, WhatsApp, Instagram, rates, notifications |
| Database | Persistent application data |
| Object Storage | Product and creative media |
| AI Layer | Creative generation and campaign interpretation |
| Integration Layer | WhatsApp, Meta/Instagram, rate provider |
| Observability | Logs, metrics, tracing, alerts |

## 2. Frontend — Customer Web/PWA

### Authentication
- Optional customer account
- Login/register if required
- Session handling
- Logout

### Business Storefront
- Business logo
- Business name
- Branding
- Contact information
- Location
- Categories
- Offers
- Product catalogue

### Product
- Product images
- Product name
- Description
- Price where allowed
- Attributes
- Availability
- Share
- Like/favourite
- WhatsApp enquiry
- QR-linked product page

### Jewellery-specific UI
Only show when business configuration enables it:
- Gold rates
- Silver rates
- Platinum rates
- Supported purity categories
- Last updated
- Source
- Rate history

### Generic category UI
Examples:
- Restaurant → menu
- Bakery → cakes/flavours/sizes
- Clothing → size/color
- Electronics → brand/specifications

The frontend should render configurable modules rather than hard-coded industry logic.

## 3. Frontend — Business Admin

### Dashboard
- Business summary
- Product count
- Creative status
- Pending approvals
- Published posts
- Enquiries
- Rate status
- Integration status

### Business Profile
- Business name
- Description
- Category
- Address
- Contact
- GST/business identifiers where applicable
- Logo
- Cover image
- Brand colors
- Brand tone
- Social links

### Product Management
- Create/edit/delete
- Categories
- Images
- Product attributes
- Price
- Offers
- Availability
- Tags
- AI-safe product facts

### Creative Management
- Generated creatives
- Preview
- Regenerate
- Version history
- Approval status
- Publish history
- Failure details

### Campaign Management
- Festival selection
- Campaign message
- Start/end dates
- Theme
- CTA
- Product selection
- Campaign status

### Social Integration
- Connect Instagram
- Connection status
- Disconnect
- Token status
- Publishing history

### WhatsApp
- Business number status
- Connection status
- Message/event history where appropriate
- AI request history

### Rate Module
Visible only for applicable categories.

## 4. Frontend — Super Admin

### Business Management
- Create business
- Edit business
- Disable business
- Business category
- Subscription/status
- Owner management
- Feature configuration

### User Management
- Create users
- Assign roles
- Disable users
- Reset/revoke sessions

### Platform Configuration
- Categories
- Feature flags
- Festival calendar
- AI provider settings
- Rate provider settings
- Messaging settings
- System limits

### Operations
- Webhook logs
- Queue health
- AI failures
- Instagram failures
- Rate synchronization
- Audit logs
- API usage
- System health

## 5. Backend — Core Modules

Recommended NestJS modules:

```text
auth
users
roles
permissions
businesses
business-users
categories
feature-flags
branding
products
product-categories
product-media
pricing
customers
favourites
enquiries
whatsapp
webhooks
media
ai
campaigns
festivals
social
instagram
rates
notifications
audit
analytics
health
admin
```

## 6. Backend — Authentication & Authorization

Implement:
- Password hashing
- Login
- Logout
- Refresh token rotation
- Session revocation
- Role-based access
- Permission-based access
- Tenant authorization
- Account disabling

Critical rule:

```text
Frontend permission check
        +
Backend permission enforcement
        +
Tenant isolation
```

Frontend checks improve UX; backend checks provide security.

## 7. Backend — Multi-Tenancy

Every business-owned query must be scoped by `business_id`.

Bad:

```sql
SELECT * FROM products WHERE id = :id;
```

Preferred logical behavior:

```sql
SELECT *
FROM products
WHERE id = :id
AND business_id = :current_business_id;
```

Never accept arbitrary `business_id` from an untrusted client as proof of authorization.

## 8. Database

Recommended:
- PostgreSQL
- Prisma ORM

Core tables:

```text
users
roles
permissions
user_roles
refresh_tokens
sessions

businesses
business_users
business_addresses
business_contacts
business_settings
business_branding

business_categories
category_features
feature_flags

product_categories
products
product_images
product_prices

customers
customer_favourites
enquiries

whatsapp_accounts
whatsapp_numbers
whatsapp_messages
whatsapp_media
webhook_events

ai_providers
ai_models
ai_generations
ai_generation_versions
ai_usage

festivals
campaigns
campaign_products

social_accounts
social_account_tokens
social_creatives
creative_approvals
social_posts
social_post_attempts

rate_providers
market_rates
market_rate_history
rate_sync_jobs

notifications
audit_logs
api_usage
system_settings
```

## 9. Object Storage

Store:
- Original product images
- AI-generated images
- Logos
- Campaign assets
- Public thumbnails

Do not store large binary images directly in PostgreSQL.

Store:
- Object key
- MIME type
- Size
- checksum
- dimensions
- business_id
- product_id if applicable
- creation metadata

Original product image should be immutable.

## 10. WhatsApp Integration

Architecture:

```text
WhatsApp Business Platform
          ↓
Webhook
          ↓
Webhook Controller
          ↓
Signature/verification
          ↓
Idempotency
          ↓
Business identification
          ↓
Event processing
          ↓
Queue
```

Backend responsibilities:
- Verify webhook
- Identify business
- Validate sender/message
- Retrieve media
- Store event
- Prevent duplicate processing
- Create AI job
- Send generated creative
- Process approval action

Do not perform heavy AI processing directly inside the webhook request.

## 11. AI Layer

Use an abstraction:

```text
AIProvider
 ├── generateCreative()
 ├── analyzeProduct()
 ├── interpretCampaign()
 └── validateOutput()
```

Initial implementation:
- Gemini provider

Future:
- Other providers can be added without rewriting business logic.

### AI Input Context

```json
{
  "business": {},
  "category": {},
  "branding": {},
  "product": {},
  "campaign": {},
  "festival": {},
  "output_requirements": {}
}
```

### AI Safety Rules
- Preserve actual product identity
- Do not invent specifications
- Do not invent price
- Do not invent discount
- Do not create false claims
- Do not add unsupported certifications
- Avoid unnecessary changes to jewellery design
- Keep brand identity consistent
- Use campaign context explicitly

## 12. AI Prompt Construction

Do not send only:

```text
Create an Instagram image.
```

Build a structured prompt from database context:

```text
BUSINESS
+
CATEGORY
+
BRAND
+
PRODUCT
+
CAMPAIGN
+
FESTIVAL
+
VISUAL RULES
+
OUTPUT FORMAT
```

Example:

```text
Business: SMR Jewellers
Category: Jewellery
Campaign: Janmashtami
Product: [verified product data]
Brand style: [stored brand rules]

Goal:
Create an Instagram-ready promotional creative.

Rules:
- Preserve product identity.
- Do not invent product facts.
- Do not change jewellery design unnecessarily.
- Use a premium Janmashtami-inspired visual direction.
- Follow stored brand colors where compatible.
- Output Instagram-compatible dimensions.
```

## 13. AI Output Validation

Before delivery:
- File type validation
- Dimension validation
- File-size validation
- Malware/content scanning where applicable
- Product identity checks where feasible
- Text/claim validation
- Brand rule validation
- Generation metadata storage

Potential future quality score:
- Product preservation
- Brand consistency
- Campaign relevance
- Visual quality
- Text correctness

## 14. Festival/Campaign Engine

Database-driven.

```text
Festival
 ├── Name
 ├── Start Date
 ├── End Date
 ├── Description
 ├── Visual Guidelines
 ├── Suggested CTA
 ├── Allowed Categories
 └── Status
```

Campaign:

```text
Campaign
 ├── Business
 ├── Festival
 ├── Product(s)
 ├── Message
 ├── Creative Rules
 ├── Start
 ├── End
 └── Status
```

## 15. Instagram Integration

Use official Meta/Instagram APIs.

Flow:

```text
Connect Instagram
       ↓
OAuth
       ↓
Backend receives credentials/token
       ↓
Encrypt/store token
       ↓
Validate connection
```

Publishing:

```text
APPROVE
  ↓
Create publish job
  ↓
Worker
  ↓
Validate token
  ↓
Prepare media
  ↓
Instagram API
  ↓
Store external post ID
  ↓
PUBLISHED
```

Never expose Instagram access tokens to frontend code.

## 16. Approval System

Use a server-side approval record.

Example states:

```text
GENERATING
GENERATED
PENDING_APPROVAL
APPROVED
REJECTED
PUBLISHING
PUBLISHED
FAILED
EXPIRED
```

Approval should include:
- creative_id
- business_id
- approver_user_id
- action
- timestamp
- request/event ID
- IP/device metadata where appropriate

## 17. Rate Engine

Provider abstraction:

```text
RateProvider
 ├── fetchRates()
 ├── normalize()
 └── validate()
```

Worker:

```text
Scheduler
   ↓
Rate Sync Job
   ↓
Provider API
   ↓
Validate
   ↓
Normalize
   ↓
Store current rate
   ↓
Store history
   ↓
Update freshness
```

UI should display:
- Rate
- Unit
- Purity/category
- Source
- Last updated
- Data status

If stale:
```text
STALE
```

Do not silently present stale data as live.

## 18. Background Jobs

BullMQ/Redis queues:

```text
AI_QUEUE
WHATSAPP_QUEUE
INSTAGRAM_QUEUE
RATE_QUEUE
NOTIFICATION_QUEUE
MEDIA_QUEUE
```

Benefits:
- Retry
- Failure isolation
- Rate limiting
- Scalability
- Monitoring

## 19. API Ownership

Frontend:

```text
Customer Web
Business Admin
Super Admin
       ↓
   Your Backend
```

Backend:

```text
Your Backend
 ├── WhatsApp
 ├── Instagram
 ├── Gemini
 ├── Rate Provider
 └── Object Storage
```

Never:

```text
Frontend → Gemini directly
Frontend → Instagram directly
Frontend → private rate API directly
```

Sensitive integrations belong in backend.

## 20. Testing Work

### Frontend
- Component tests
- Form validation
- Navigation
- Permission UI
- API integration
- Responsive UI
- Accessibility
- PWA behavior

### Backend
- Unit tests
- Service tests
- Controller tests
- Authorization tests
- Tenant isolation tests
- Integration tests

### Integration
- WhatsApp webhook
- Media retrieval
- AI generation
- WhatsApp response
- Approval
- Instagram publishing
- Rate synchronization

### Security
Test:
- IDOR
- Broken access control
- Tenant escape
- JWT attacks
- Token leakage
- Webhook replay
- Duplicate webhooks
- SQL injection
- XSS
- CSRF where applicable
- SSRF
- File upload abuse
- Malicious images
- Rate-limit bypass
- Approval replay
- Instagram token misuse

### E2E

```text
WhatsApp
 ↓
Webhook
 ↓
Business lookup
 ↓
Media
 ↓
AI
 ↓
Creative
 ↓
WhatsApp
 ↓
Approve
 ↓
Instagram
 ↓
Published
```

## 21. Status Tracking

Use:

| Status | Meaning |
|---|---|
| NOT_STARTED | Not started |
| IN_PROGRESS | Active development |
| BLOCKED | Dependency/problem |
| TESTING | Development complete, testing |
| FAILED | Test/acceptance failure |
| COMPLETED | Verified and accepted |
| DEFERRED | Intentionally postponed |

Every phase/task should also have:
- Owner
- Start date
- Target date
- Dependencies
- Notes
- Evidence/test reference

## 22. Critical Gaps to Resolve Before Production

1. Exact Meta/Instagram publishing eligibility
2. WhatsApp Business onboarding model
3. WhatsApp messaging/template policy
4. AI image provider commercial terms
5. AI generated-image quality on real products
6. Product preservation quality for jewellery
7. Rate provider license and redistribution rights
8. Exact rate methodology
9. Meaning of "live" and acceptable latency
10. Diamond pricing methodology
11. Privacy/data retention
12. Customer consent
13. Image copyright/trademark handling
14. Abuse prevention
15. Storage/CDN costs
16. AI usage limits
17. Vendor fallback strategy
18. Disaster recovery
19. Audit requirements
20. Business pricing/subscription model

## 23. Final Technical Principle

The frontend is the user interface.

The backend is the source of truth.

The workers perform asynchronous operations.

The database stores business state.

The AI generates creative output.

External providers perform messaging/social/data services.

No critical business rule should exist only in the frontend.
