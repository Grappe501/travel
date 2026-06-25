# Mileage & Expense Copilot

# Master Build Blueprint

# Volume 20 — Product Evolution, Version Roadmap & Strategic Growth Architecture

**Version 1.0**

---

## Who This Document Is For

Volume 20 is the **last major planning volume** before implementation begins. Volumes 0–19 define *what* you're building and *how* it operates. Volume 20 defines **how it evolves** — the strategic roadmap that prevents feature creep while ensuring every new capability fits the original vision.

| Role | Use this volume to… |
|------|---------------------|
| **Product** | Gate features, prioritize versions, run roadmap reviews |
| **Engineering** | Know what waits vs. what ships in V1 |
| **Leadership** | Three-year vision, competitive strategy, exit criteria |
| **Everyone** | Feature admission criteria before any new work |

**Related:** [Volume 1 — Strategy](01-product-vision.md) · [Volume 16 — AI maturity](16-ai-operating-system.md) · [Master Build Index](../MASTER-BUILD-INDEX.md)

**After Volume 20:** Sign off blueprint → execute via [Master Build Index](../MASTER-BUILD-INDEX.md).

---

## Roadmap Catalog

Permanent **ROAD-IDs** for versions, themes, and innovation categories.

Tracker: [`docs/roadmap/ROAD-INDEX.md`](../roadmap/ROAD-INDEX.md)

---

# Part I — Vision

## Chapter 1 — Purpose

This volume answers:

| Question | Where answered |
|----------|----------------|
| What belongs in Version 1? | Ch. 5, Master Build Index |
| What intentionally waits? | Ch. 6–9 |
| What is the three-year vision? | Ch. 9, Ch. 2 |
| Which features create competitive advantage? | Ch. 24 |
| How do we grow without losing simplicity? | Ch. 3–4, Ch. 35 |

> This roadmap **protects** the product from bloat and **ensures** continuous innovation.

---

## Chapter 2 — Product Vision

The vision is not to build another mileage tracker.

> **Become the operating system for business travel, field work, and expense documentation.**

Success means users stop thinking about tracking because the application **quietly helps them stay organized**.

| Horizon | State |
|---------|-------|
| V1 | Prove capture + reports + trust |
| V2 | Intelligent automation + teams |
| V3 | Field operations platform |

Align Volume 1 North Star and Volume 0 Product Doctrine.

---

# Part II — Product Principles

## Chapter 3 — Growth Principles

Every new feature must satisfy **at least one**:

| Goal | Example |
|------|---------|
| Save time | One-tap trip start |
| Reduce mistakes | Duplicate receipt detection |
| Increase confidence | AI explainability |
| Improve reporting | IRS mileage log |
| Simplify workflows | Fuel stop MOB-WF-FUEL |
| Increase collaboration | Accountant read-only (V1.5) |
| Expand automation responsibly | Monthly report auto-gen (V2) |

**If a feature satisfies none → do not add.**

---

## Chapter 4 — Feature Admission Criteria

**ROAD-ADMIT-001** — before entering roadmap, every proposal answers:

| Criterion | Required answer |
|-----------|-----------------|
| Who benefits? | Persona + segment |
| How often used? | Daily / weekly / monthly / rare |
| Simplify or complicate? | Net UX impact |
| Fit product vision? | Ch. 2 alignment |
| Operational cost? | Support, AI, infra (Volume 19) |
| Success metric? | EVT-ID or business KPI |

Rejected proposals logged in `docs/roadmap/declined.md` with reason — preserves context.

---

# Part III — Version Strategy

## Chapter 5 — Version 1.0

**ROAD-VER-1.0** — prove the product.

| Capability | Blueprint refs |
|------------|----------------|
| Manual trip tracking | FR-300, SM-TRIP, MOB-WF-START |
| Receipt capture | SCR-031, SM-RCP |
| OCR | ENG-OCR, PRM-OCR-001 |
| Mileage calculations | FR-302, mileage_rates |
| Expense tracking | FR-400, SM-EXP |
| Reports | FR-800, SM-RPT |
| Cloud sync | SM-SYNC, Volume 18 offline |
| Billing | Stripe, SM-SUB, Free/Pro tiers |
| AI suggestions | ENG-CAT, ENG-DUP, ENG-REM |
| Small business support | 1 business, 1 vehicle free; Pro expands |

**Out of V1:** auto trip detection, teams, public API, native apps, enterprise SSO.

**Exit criteria:** Volume 9 launch gates + Volume 19 production readiness + Volume 33 readiness signals.

---

## Chapter 6 — Version 1.1

**ROAD-VER-1.1** — polish, no platform shifts.

| Focus | Examples |
|-------|----------|
| Performance | OPS-PERF baselines, MOB perf |
| Better OCR | PRM iterations, golden set |
| UI polish | Volume 10 component refinements |
| Accessibility | Volume 18 Ch. 22 |
| Additional exports | Excel enhancements |
| Customer-requested fixes | Top 5 support themes |

**Rule:** No new database entities without ADR. No VER-2 features.

---

## Chapter 7 — Version 1.5

**ROAD-VER-1.5** — team-adjacent, still SMB.

| Focus | Examples |
|-------|----------|
| Team workflows | Shared business read access |
| Client/project management | clients, projects depth |
| Enhanced dashboards | Volume 14 product dashboard |
| Report templates | Client-specific layouts |
| Improved analytics | Funnel refinements |
| Small Business plan | $19.99 tier (Volume 7) |
| Accountant access | Read-only export role |

Permissions: Volume 8 RBAC extension required.

---

## Chapter 8 — Version 2.0

**ROAD-VER-2.0** — major expansion.

| Capability | Notes |
|------------|-------|
| Automatic trip detection | MOB-FF-AUTO-TRIP, opt-in |
| Calendar integration | MOB-FF-CAL |
| Predictive reminders | ENG-REM Level 3 |
| Enterprise permissions | Volume 17 Ch. 29 |
| Advanced reporting | Custom date logic, bulk export |
| Workflow automation | Ch. 11 automations |

Requires: V1 retention proof (Ch. 33), ops maturity Level 3+ (Volume 19 Ch. 36).

---

## Chapter 9 — Version 3.0

**ROAD-VER-3.0** — broader field operations platform.

| Potential | Strategic fit |
|-----------|---------------|
| Job tracking | Adjacent to trips |
| Vehicle maintenance reminders | Fleet adjacency |
| Route history | GPS maturity |
| Team scheduling | Collaboration evolution |
| Approval workflows | Enterprise |
| Advanced budgeting | Finance teams |

**Gate:** Market pull + team capacity — not calendar ambition.

---

# Part IV — Strategic Themes

## Chapter 10 — AI Evolution

Align Volume 16 maturity levels:

| Level | ROAD-AI-L* | Capability |
|-------|------------|------------|
| 1 | ROAD-AI-L1 | OCR assistance (V1) |
| 2 | ROAD-AI-L2 | Learning preferences (V1.1) |
| 3 | ROAD-AI-L3 | Workflow recommendations (V1.5) |
| 4 | ROAD-AI-L4 | Predictive organization (V2) |
| 5 | ROAD-AI-L5 | Administrative copilot (V3) |

> AI reduces effort; **user control** on every financial decision (AI Constitution).

---

## Chapter 11 — Automation Evolution

**ROAD-AUTO-*** future automations:

| Automation | Version | Human gate |
|------------|---------|------------|
| Monthly reports | V1.5 | Review before send |
| Receipt reminders | V1 | End-trip checklist |
| Team summaries | V2 | Manager opt-in |
| Manager approvals | V2 | Explicit approve |
| Client billing packages | V2.5 | Export only |

Eliminate repetitive admin — never auto-commit financial records without confirmation.

---

## Chapter 12 — Collaboration Evolution

**ROAD-COLLAB-*** — permissions carefully:

| Capability | Version | Privacy |
|------------|---------|---------|
| Shared businesses | V1.5 | Role-scoped |
| Shared vehicles | V1.5 | Odometer audit |
| Team reporting | V2 | Aggregate + detail roles |
| Manager approvals | V2 | Workflow SM |
| Accountant access | V1.5 | Read + export |
| External reviewers | V2 | Time-limited link |

Volume 8 RLS must precede every collaboration feature.

---

# Part V — Platform Expansion

## Chapter 13 — Integration Roadmap

**ROAD-INT-*** — stable interfaces, not tight coupling.

| Integration | Version | Interface |
|-------------|---------|-----------|
| QuickBooks / Xero | V2 | Export + future API |
| Google / Outlook Calendar | V2 | OAuth read |
| Google Drive / Dropbox | V2 | Export destination |
| SAML / OIDC SSO | V2.5 | Enterprise |
| Fleet management | V3 | Partner API |
| Travel booking | V3+ | Evaluate demand |

Build via Volume 12 API patterns — adapter layer in `packages/integrations/`.

---

## Chapter 14 — API Ecosystem

**ROAD-API-*** — post-V1 public surface:

| Capability | Version |
|------------|---------|
| Partner API (scoped) | V2 |
| Webhooks | V2 |
| Developer portal | V2.5 |
| API keys + usage dashboards | V2.5 |
| Public API (full) | V3 |

Rate limits, billing, and Volume 8 auth required before any external access.

---

# Part VI — Mobile Evolution

## Chapter 15 — Mobile Roadmap

Volume 18 remains canonical; evolution by version:

| Enhancement | MOB-FF-ID | Version |
|-------------|-----------|---------|
| Voice commands | MOB-FF-VOICE | V2 |
| Smartwatch | MOB-FF-WATCH | V2.5 |
| Lock screen widgets | MOB-FF-WIDGET | V1.5 |
| Home screen widgets | MOB-FF-WIDGET | V1.5 |
| Camera improvements | MOB-FF-CAM-ADV | V1.1 |
| Foldable optimization | MOB-SC-FOLD | V2 |

> Mobile remains the **primary** experience — desktop complements, never replaces.

---

## Chapter 16 — Hardware Opportunities

Investigate only when UX gain is clear:

| Hardware | ROAD-HW-* | Version |
|----------|-----------|---------|
| Bluetooth OBD | MOB-FF-BT-OBD | V2+ |
| CarPlay / Android Auto | MOB-FF-CAR | V3+ |
| Dedicated receipt scanners | ROAD-HW-SCAN | Enterprise |
| Wireless printers | MOB-FF-PRINT | V2.5 |

Partner-first before native hardware SDK commitments.

---

# Part VII — Enterprise Strategy

## Chapter 17 — Business Growth

**ROAD-ENT-*** enterprise capabilities:

| Capability | Version |
|------------|---------|
| Department structures | V2.5 |
| Approval chains | V2 |
| Cost centers | V2.5 |
| Audit exports | V1.5 |
| Compliance reporting | V3 |
| Central administration | Volume 17 Ch. 28–29 |

Design `organizations` parent table in V1 schema hooks (Volume 4) — implement later.

---

## Chapter 18 — International Readiness

V1: USD, IRS mileage, English. Architecture must allow:

| Dimension | V1 hook |
|-----------|---------|
| Multiple currencies | `currency` column on expenses |
| Localization | i18n key structure in UI |
| Regional mileage rules | `mileage_rates` per region |
| Date formats | locale-aware formatting |
| Tax terminology | copy keys, not hardcoded |
| Multi-language | `messages` locale column |

No V1 implementation required — avoid US-only assumptions in schema.

---

# Part VIII — Product Intelligence

## Chapter 19 — Feedback Pipeline

**Single backlog** — all sources:

| Source | Entry path |
|--------|------------|
| Customer requests | Support → product tag |
| Support tickets | ADM-SUPPORT themes |
| Analytics | Volume 14 funnels |
| AI correction trends | ENG-PROD dashboard |
| Internal ideas | `docs/roadmap/proposals/` |

Each item: **priority · effort · business value · strategic alignment** (Ch. 4).

---

## Chapter 20 — Roadmap Governance

| Cadence | Scope | Owner |
|---------|-------|-------|
| Weekly tactical | Bugs, small wins | Eng + support |
| Monthly product | Roadmap reorder | Product |
| Quarterly strategic | Version themes | Founder + product |
| Annual vision | Ch. 31 review | Leadership |

> Avoid changing direction from **isolated** feedback — pattern required.

Feature flags (ADM-FLAGS) gate experiments (Ch. 22).

---

# Part IX — Innovation Framework

## Chapter 21 — Innovation Categories

**ROAD-CAT-*** — balanced portfolio:

| Category | ROAD-CAT-ID | V1 emphasis |
|----------|-------------|-------------|
| Reliability | ROAD-CAT-REL | High |
| Performance | ROAD-CAT-PERF | High |
| Usability | ROAD-CAT-UX | High |
| Intelligence | ROAD-CAT-AI | Medium |
| Automation | ROAD-CAT-AUTO | Low |
| Collaboration | ROAD-CAT-COLLAB | Deferred |
| Platform | ROAD-CAT-PLAT | Deferred |
| Enterprise | ROAD-CAT-ENT | Deferred |

Each release should touch **Reliability + Performance** even in feature releases.

---

## Chapter 22 — Experimental Features

**ROAD-EXP-001** process:

```
internal prototype → limited beta → opt-in (flag) →
analytics review → general availability OR sunset
```

| Stage | Duration | Exit |
|-------|----------|------|
| Prototype | 2 weeks max | Kill or beta |
| Beta | 4–8 weeks | Metrics threshold |
| Opt-in | 1 release | Adoption > 5% or kill |
| GA | — | Documented in CHANGELOG |

Experiments never ship without rollback and ADM-FLAGS owner.

---

# Part X — Competitive Strategy

## Chapter 23 — Competitive Review

**Twice yearly** evaluate:

* Market trends (mileage apps, expense tools)
* Customer expectations (mobile, AI, exports)
* New technologies (vision models, on-device OCR)
* Pricing changes (Volume 7)
* Differentiation gaps

Output: `docs/roadmap/competitive-review-YYYY-H.md` — respond **deliberately**.

---

## Chapter 24 — Competitive Advantages

Continuously strengthen — moat deepens over time:

| Advantage | Blueprint owner |
|-----------|-----------------|
| Ease of use | Volume 2, 18 Field Standard |
| AI quality | Volume 16, golden set |
| Reporting | Volume 3 FR-800 |
| Reliability | Volume 19 SLOs |
| Mobile experience | Volume 18 |
| Customer trust | Volume 8 |
| Operational excellence | Volume 17 + 19 |

Competitors can copy features; hard to copy **integrated excellence**.

---

# Part XI — Technical Evolution

## Chapter 25 — Architecture Reviews

**Quarterly** assess (document in `docs/architecture/reviews/`):

| Dimension | Question |
|-----------|----------|
| Scalability | Supabase tier adequate? |
| Performance | OPS-PERF regression? |
| Security | Volume 8 audit findings? |
| Technical debt | Volume 6 debt policy |
| Maintainability | Test coverage trend |

Modernize thoughtfully — no rewrite without ROI proof.

---

## Chapter 26 — Refactoring Strategy

Reserve **15–20%** of each release capacity for:

* Code cleanup
* Documentation updates
* Performance optimization
* Test improvements

Healthy software requires ongoing maintenance — not hero sprints.

---

# Part XII — Organizational Growth

## Chapter 27 — Team Growth

Plan roles as company scales:

| Function | V1 | V1.5+ | V2+ |
|----------|-----|-------|-----|
| Product | Founder | +PM | PM team |
| Engineering | Founder/solo | +1–2 | Squad |
| Design | Contract/part-time | +Design | In-house |
| Customer Success | Founder | +CS | Team |
| Operations | Founder + Volume 19 | +Ops | SRE |
| Security | Volume 8 + advisor | +Security | CISO part-time |
| AI Engineering | Eng + Volume 16 | +AI eng | AI team |
| Marketing | Volume 7 | +Marketing | Growth |
| Sales | Self-serve | Inside sales | Enterprise AE |

Document RACI in `docs/ops/raci.md` as hires occur.

---

## Chapter 28 — Knowledge Management

Maintain regardless of team size:

| Asset | Location |
|-------|----------|
| Architecture decisions | `docs/architecture/decisions/` |
| Product decisions | BUILD-LOG + roadmap |
| Runbooks | `docs/runbooks/` |
| Design standards | Volume 10 |
| AI registry | `docs/ai-catalog/` |
| API documentation | Volume 12 + API-INDEX |
| **Master execution** | [MASTER-BUILD-INDEX.md](../MASTER-BUILD-INDEX.md) |

Knowledge survives turnover.

---

# Part XIII — Long-Term Success

## Chapter 29 — Success Metrics

Long-term indicators for strategic planning:

| Metric | Source | Review |
|--------|--------|--------|
| Customer retention | PostHog cohorts | Monthly |
| Revenue growth | Stripe MRR | Weekly |
| Product reliability | OPS-SLO-* | Monthly |
| AI accuracy | ENG-PROD correction rate | Weekly |
| Support efficiency | Tickets per 100 MAU | Monthly |
| Feature adoption | EVT funnels | Per release |
| Customer satisfaction | CSAT survey | Quarterly |

Feed Volume 17 administrative KPIs and Volume 14 executive dashboard.

---

## Chapter 30 — Sunset Policy

**ROAD-SUNSET-001** — retiring features is deliberate:

| Step | Action |
|------|--------|
| 1 | Announce 90 days ahead (MSG template) |
| 2 | Migration path documented |
| 3 | Feature flag off for new users |
| 4 | Data export / preservation |
| 5 | Remove code + update docs |
| 6 | CHANGELOG + BUILD-LOG entry |

Never sunset without customer communication and data path.

---

# Part XIV — Strategic Governance

## Chapter 31 — Annual Product Review

Each year evaluate:

* Vision alignment (Ch. 2)
* Market position (Ch. 23)
* Customer needs (feedback pipeline)
* Technology trends (AI, mobile)
* Operational maturity (Volume 19 Level)

Confirm roadmap reflects **mission**, not momentum.

---

## Chapter 32 — Decision Framework

Major decisions document in `docs/architecture/decisions/ADR-NNN.md`:

| Factor | Weight |
|--------|--------|
| Customer impact | High |
| Strategic alignment | High |
| Operational cost | Medium |
| Engineering complexity | Medium |
| Long-term maintenance | High |
| Revenue potential | Context-dependent |

Preserve **why** — not just what was decided.

---

# Part XV — Version 1 Exit

## Chapter 33 — Readiness to Expand

**Do not grow past V1** until demonstrating:

| Signal | Threshold (guidance) |
|--------|---------------------|
| Stable operations | OPS-SLO met 30 days |
| Healthy retention | D30 > 40% (adjust per segment) |
| Sustainable support | < 5% MAU opening tickets |
| Reliable infrastructure | Zero P1 in 30 days |
| Positive feedback | NPS > 30 |
| Predictable releases | 3 successful deploys |

Growth follows **evidence**, not excitement.

---

## Chapter 34 — Strategic Non-Negotiables

| # | Rule |
|---|------|
| 1 | Simplicity before complexity |
| 2 | Reliability before new features |
| 3 | Customer trust before rapid growth |
| 4 | Product focus before diversification |
| 5 | Automation before repetitive manual work |
| 6 | Data integrity before convenience |
| 7 | Sustainable architecture before shortcuts |
| 8 | Roadmap admission criteria before new features |
| 9 | Sunset policy before feature removal |
| 10 | Vision alignment before competitive reaction |

---

## Chapter 35 — The Product Evolution Standard

> **Every new version should make the product noticeably more valuable without making it noticeably more complicated.**

The ideal roadmap is not measured by feature count. It is measured by how much **easier** the product becomes while continuing to solve the core problem exceptionally well.

---

## Blueprint Complete

Volumes **0–21** define the product, operations, evolution, and construction. **Implementation begins** with sign-off → [Volume 21](21-construction-manual.md) WAVE-001 → [Master Build Index](../MASTER-BUILD-INDEX.md).

---

## Cross-Reference Index

| Volume | Evolution link |
|--------|----------------|
| Volume 1 | Vision, pillars |
| Volume 7 | Pricing, GTM by version |
| Volume 16 | AI maturity levels |
| Volume 17 | Enterprise admin hooks |
| Volume 18 | Mobile MOB-FF-* roadmap |
| Volume 19 | Ops maturity levels |

---

*Previous: [Volume 19 — Production SRE](19-production-sre.md) | Next: [Volume 21 — Construction Manual](21-construction-manual.md) | [Master Build Index](../MASTER-BUILD-INDEX.md) | [Blueprint Index](README.md)*
