# Timeline & Resource Estimation — End-to-End

This document adds effort, duration, and staffing estimates on top of the 21 phases defined in `03_END_TO_END_IMPLEMENTATION_ROADMAP.md`. It reflects the following decisions made during review:

- Scope = catalogue + WhatsApp lead-generation (no cart/checkout/payment).
- Initial verticals = Jewellery (primary) + Home-Bakery/Cake Shop (secondary).
- Approval = WhatsApp reply only, secured with an authorized-sender allowlist per business.
- Approval TTL = 24 hours.
- Compliance jurisdiction = India only (DPDP Act 2023, GST) for this phase.

## 1. Estimation Assumptions

1. 1 week = 5 working days. 1 person-week (pw) = 1 person working full-time for 1 week.
2. Effort estimates assume the team already knows NestJS/Next.js/Prisma — add 10–15% ramp-up if not.
3. Durations exclude effort spent on **external approvals** (Meta Business verification, WhatsApp Business Platform onboarding, Instagram Graph API app review). These are outside engineering control and are called out separately as calendar risk, not team effort.
4. Two staffing scenarios are estimated:
   - **Lean team** (3–4 people, multi-hatting) → mostly sequential phases.
   - **Standard team** (7–9 people, dedicated roles) → parallel tracks per the dependency map in Doc 03.
5. Cost is intentionally left out of the tables (no confirmed blended rates were provided). Person-weeks/person-months are given so cost can be computed once rates are known.

## 2. Recommended Core Team (Standard Scenario)

| Role | Count | Allocation | Primary Phases |
|---|---|---|---|
| Tech Lead / Architect | 1 | Full-time | All |
| Backend Engineer (NestJS/Prisma) | 2 | Full-time | 1–5, 7–16, 18 |
| Frontend Engineer (Next.js) | 2 | Full-time | 1, 3–6, 9, 12–14 |
| AI Engineer (prompt/provider integration) | 1 | Full-time from Phase 7 | 7–9 |
| QA / Test Engineer | 1 | Full-time from Phase 2 | 2, 3, 7, 10, 11, 15, 17 |
| DevOps / Infra Engineer | 1 | Part-time → full-time at Phase 18 | 1, 5, 7, 15, 18 |
| Product Manager | 1 | Part-time throughout | 0, 4, 7, 9, 11, 12, 16, 19, 20 |
| UI/UX Designer | 1 | Part-time, front-loaded | 0, 4, 5, 6 |
| Legal/Compliance Advisor | 1 | Part-time, engaged as needed | 0, 12, 16 |

Lean team = 1 Tech Lead (also does BE), 1 additional BE/FE generalist, 1 AI+QA generalist, PM/Design/Legal contracted or founder-led part-time.

## 3. Phase-Wise Effort & Duration

Effort columns are in **person-weeks (pw)**. Calendar duration assumes the Standard team (parallelizable); Lean-team calendar duration is longer and shown in Section 5.

| Phase | Name | BE | FE | AI | DevOps | QA | Design | PM/Legal | Total pw | Calendar (Standard) |
|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 0 | Discovery & Technical Validation | 1 | 0 | 1 | 0 | 0 | 0.5 | 3 | 5.5 | 2 wks |
| 1 | Architecture & Repository Foundation | 3 | 2 | 0 | 2 | 0 | 0 | 0.5 | 7.5 | 2 wks |
| 2 | Database & Multi-Tenant Foundation | 4 | 0 | 0 | 0.5 | 1 | 0 | 0 | 5.5 | 2 wks |
| 3 | Authentication & RBAC | 3 | 2 | 0 | 0 | 1 | 0 | 0 | 6 | 2 wks |
| 4 | Business & Category Management | 3 | 3 | 0 | 0 | 0 | 1 | 0 | 7 | 2 wks |
| 5 | Product Catalogue & Media | 3 | 4 | 0 | 1 | 1 | 0 | 0 | 9 | 3 wks |
| 6 | Customer Storefront/PWA | 2 | 5 | 0 | 0 | 1 | 2 | 0 | 10 | 3 wks |
| 7 | WhatsApp Integration POC | 5 | 0 | 0 | 0 | 2 | 0 | 1 | 8 | 3 wks* |
| 8 | AI Creative Engine | 3 | 0 | 5 | 0 | 1 | 0 | 0 | 9 | 4 wks |
| 9 | Campaign & Festival Engine | 3 | 2 | 1 | 0 | 0 | 0 | 0 | 6 | 2 wks |
| 10 | WhatsApp Creative Delivery & Approval | 3 | 1 | 0 | 0 | 2 | 0 | 0 | 6 | 2 wks |
| 11 | Instagram OAuth & Publishing | 4 | 0 | 0 | 0 | 1 | 0 | 1 | 6 | 3 wks* |
| 12 | Rates Engine | 3 | 2 | 0 | 0 | 0 | 0 | 1.5 | 6.5 | 2 wks |
| 13 | Notifications & Analytics | 2 | 2 | 0 | 0 | 0 | 0 | 0 | 4 | 2 wks |
| 14 | Super Admin Operations | 2 | 3 | 0 | 0 | 0 | 0 | 0 | 5 | 2 wks |
| 15 | Security Hardening | 3 | 0 | 0 | 1 | 4 | 0 | 0 | 8 | 3 wks |
| 16 | Privacy & Compliance | 1 | 0 | 0 | 0 | 0 | 0 | 4 | 5 | 2 wks |
| 17 | Complete Testing & QA | 1 | 1 | 0 | 0 | 6 | 0 | 0 | 8 | 3 wks |
| 18 | Production Infrastructure | 1 | 0 | 0 | 4 | 0 | 0 | 0 | 5 | 2 wks |
| 19 | Pilot Launch | 1 | 0 | 0 | 0 | 1 | 0 | 3 | 5 | 3 wks |
| 20 | Production Launch & Continuous Improvement | 1 | 1 | 0 | 1 | 0 | 0 | 1 | 4 | 2 wks |
| | **Total** | **48** | **28** | **7** | **9.5** | **20** | **3.5** | **15** | **131.5 pw** | **51 wks (sequential sum)** |

\* Phases 7 and 11 also carry an **external, non-effort waiting period** for Meta/WhatsApp verification and Instagram app review — see Section 6.

## 4. Calendar Timeline — Standard Team (Parallel Tracks)

Per the Doc 03 dependency map, Track C (integration spine) can run in parallel with Track B (core UI) once foundation phases are done. Track D (rates/notifications/admin ops) can be absorbed by spare BE/FE capacity during Track C.

```text
Track A — Foundation (sequential, blocking)
  Phase 0 → 1 → 2 → 3                                   [8 wks]

Track B — Core Business UI (after Track A)
  Phase 4 → 5 → 6                                        [8 wks]

Track C — Integration Spine (after Track A, parallel to B)
  Phase 7 → 8 → 9 → 10 → 11                              [14 wks]

Track D — Independent Capabilities (absorbed within B/C window)
  Phase 12, 13, 14                                       [6 wks, overlapped]

Track E — Hardening / Compliance / QA / Infra (after B + C + D converge)
  Phase 15 → 16 → 17 → 18                                [10 wks]

Track F — Launch
  Phase 19 → 20                                          [5 wks]
```

**Calendar total (Standard team):** 8 + 14 (longest of B/C) + 10 + 5 = **~37 weeks (≈ 8.5–9 months)**

**Calendar total (Lean team, mostly sequential):** sum of all phase durations = **~51 weeks (≈ 11.5–12 months)**

## 5. Summary Table

| Metric | Lean Team (3–4 people) | Standard Team (7–9 people) |
|---|---:|---:|
| Total engineering effort | ~131.5 person-weeks (~30 person-months) | ~131.5 person-weeks (~30 person-months) |
| Calendar duration | ~51 weeks (~12 months) | ~37 weeks (~9 months) |
| Parallel tracks used | No (mostly sequential) | Yes (Foundation → UI + Integration in parallel → Hardening → Launch) |
| External approval risk exposure | Higher (fewer people to work around blocked phases) | Lower (other tracks continue while waiting) |

## 6. External Dependency Buffer (Not Included Above)

These are **calendar-only risks** — waiting time, not engineering effort — that can sit on the critical path regardless of team size:

| Dependency | Typical Wait | Falls On |
|---|---|---|
| Meta Business verification | 1–4 weeks (can be rejected/resubmitted) | Phase 7 |
| WhatsApp Business Platform number onboarding | 1–3 weeks | Phase 7 |
| Instagram Graph API app review (if required for the intended publishing permissions) | 2–6 weeks, can require resubmission | Phase 11 |
| Rate-provider license/redistribution confirmation | 1–3 weeks (legal back-and-forth) | Phase 12 |

**Recommendation:** add a **4–6 week schedule buffer** on top of the Standard-team estimate (→ ~43–43 weeks / ~10 months total) to absorb these external, non-negotiable waiting periods. Do not treat Phase 7/11 exit criteria as achievable purely by engineering effort — they are gated by third parties.

## 7. Milestone Table (Relative Weeks, Standard Team)

Fill in the "Actual Start" column once a project start date is fixed; "Week" values are elapsed weeks from project day 0.

| Milestone | End of Phase | Elapsed Week (approx.) | Actual Start | Actual End |
|---|---|---:|---|---|
| Foundation ready (auth + multi-tenancy proven) | 3 | 8 | | |
| Core admin + catalogue + storefront live (internal) | 6 | 16 | | |
| WhatsApp → AI → Instagram spine proven end-to-end | 11 | 22 | | |
| Rates/notifications/admin-ops complete | 14 | 22 (parallel) | | |
| Security + compliance + full QA signed off | 17 | 32 | | |
| Production infrastructure ready | 18 | 34 | | |
| Pilot launched (Jewellery + Home-Bakery businesses) | 19 | 37 | | |
| Production launch | 20 | 39–43 (incl. buffer) | | |

## 8. Notes / Caveats

- These are planning-grade estimates, not a fixed-bid quote. Phase 0 discovery (provider POCs, Meta eligibility checks) should be used to re-baseline Phases 7, 8, 11, and 12 once real answers are in hand.
- AI Engineer effort in Phase 8 (5 pw) assumes Gemini image generation quality is workable out of the box; if product-identity preservation quality is poor on real jewellery/bakery photos, add 2–4 pw of prompt/pipeline iteration and re-test cycles.
- QA effort is weighted toward Phases 15 and 17 deliberately — tenant isolation and approval-replay protection are the two hardest-to-retrofit guarantees in this system, per the Non-Negotiable Engineering Principles in Doc 01.
- No cost figures are included. To convert to budget, multiply each role's person-weeks by an agreed weekly blended rate for that role.
