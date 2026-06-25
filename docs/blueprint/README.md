# Mileage & Expense Copilot — Master Build Blueprint

**Version 1.0** | Pre-implementation design constitution

---

## How to Use This Blueprint

1. **Start with Volume 0** — Every feature decision is measured against the Product Doctrine.
2. **Volumes 1–3** define *what* we build and *how users experience it*.
3. **Volumes 4–6** define *data, AI, and technology*.
4. **Volumes 7–9** define *business, security, and quality*.
5. **Volume 10** defines the *universal design system* — how every screen is built.
6. **Volume 11** is the *Screen Bible* — every SCR-ID specified before code.
7. **Volume 12** is the *API Constitution* — every API-ID documented before implementation.
8. **Volume 13** defines *state machines* — explicit workflow logic for every major action.
9. **Volume 14** defines *analytics & BI* — what we measure and why.
10. **Volume 15** is the *Communication Engine* — every MSG-ID, channel, and timing rule.
11. **Volume 16** is the *AI Operating System* — engines, PRM-IDs, and the AI Constitution.
12. **Volume 17** is *AdminOS* — the company operating system: roles, dashboards, runbooks, and internal workflows.
13. **Volume 18** is the *Mobile Field Experience* — offline-first PWA, camera, thumb-zone UX, and the Field Productivity Standard.

**No application code is written until this blueprint is reviewed and signed off.**

**Blueprint status:** Volumes 0–18 complete (v1.0). Ready for sign-off → Phase A.

---

## Volumes

| Vol | Document | Summary |
|-----|----------|---------|
| **0** | [Product Doctrine & Design Constitution](00-product-doctrine.md) | Mission, values, scope boundaries — **read first** |
| **1** | [Product Vision & Strategy](01-product-vision.md) | Cross-functional strategy: vision, pillars, metrics, non-negotiables |
| **2** | [Experience Architecture (UX/UI)](02-user-experience.md) | Every screen, journey, state — **Volume 10** owns components |
| **3** | [Functional Requirements & Business Logic](03-functional-requirements.md) | FR contract: inputs, rules, acceptance criteria, dependency matrix |
| **4** | [Data Architecture & Database](04-database-architecture.md) | Entities, RLS, storage, events, governance, retention |
| **5** | [AI & Intelligence Architecture](05-ai-design.md) | Engines, prompts, confidence, safety, personal memory |
| **6** | [Technical Architecture & Production Infrastructure](06-technical-architecture.md) | Stack, modules, deploy, CI, Cursor build rules |
| **7** | [Business Operations & Go-to-Market](07-business-operations.md) | Pricing, launch, support, legal, growth, metrics |
| **8** | [Security, Privacy & Trust Architecture](08-security.md) | Auth, RLS, encryption, compliance, trust dashboard |
| **9** | [Quality Assurance & Release Engineering](09-testing-quality.md) | Test pyramid, launch gates, certification, non-negotiables |
| **10** | [Universal Design System & Component Library](10-design-system.md) | Tokens, components, patterns — build the system, not 200 screens |
| **11** | [Complete Screen Bible & Experience Atlas](11-screen-bible.md) | 60 SCR-IDs — every screen specified before development |
| **12** | [API Architecture & Integration Specification](12-api-architecture.md) | 70+ API-IDs — response envelope, error registry, API Constitution |
| **13** | [Component State Machines & Workflow Logic](13-state-machines.md) | SM-IDs — trips, receipts, OCR, sync, billing, screen states |
| **14** | [Analytics, Metrics & Business Intelligence](14-analytics.md) | EVT-IDs, North Star, funnels, dashboards, privacy rules |
| **15** | [Communication & Engagement Engine](15-communication-engine.md) | MSG-IDs, channels, timing, lifecycle, non-negotiables |
| **16** | [AI Operating System & Prompt Registry](16-ai-operating-system.md) | ENG/PRM-IDs, golden set, maturity roadmap, AI Constitution |
| **17** | [Administration, Operations & Company OS (AdminOS)](17-admin-operating-system.md) | ADM-IDs, roles, dashboards, runbooks, incident response, launch checklist |
| **18** | [Mobile Experience, Offline & Field Productivity](18-mobile-field-experience.md) | MOB-IDs, offline queue, camera, field workflows, device matrix, Field Productivity Standard |

---

## Supporting Documents

| Document | Purpose |
|----------|---------|
| [PROJECT-STRUCTURE.md](../PROJECT-STRUCTURE.md) | H: drive filesystem layout |
| [SCR-INDEX.md](../screen-catalog/SCR-INDEX.md) | Screen implementation tracker (Volume 11) |
| [API-INDEX.md](../api-catalog/API-INDEX.md) | API implementation tracker (Volume 12) |
| [SM-INDEX.md](../state-machines/SM-INDEX.md) | State machine tracker (Volume 13) |
| [EVENT-REGISTRY.md](../analytics/EVENT-REGISTRY.md) | Analytics event registry (Volume 14) |
| [MSG-INDEX.md](../communications/MSG-INDEX.md) | Communication template registry (Volume 15) |
| [PROMPT-INDEX.md](../ai-catalog/PROMPT-INDEX.md) | AI prompt registry (Volume 16) |
| [ADM-INDEX.md](../admin-os/ADM-INDEX.md) | AdminOS module registry (Volume 17) |
| [MOB-INDEX.md](../mobile/MOB-INDEX.md) | Mobile & field workflow registry (Volume 18) |
| [DEVICE-MATRIX.md](../mobile/DEVICE-MATRIX.md) | Device compatibility matrix (Volume 18 Ch. 36) |
| [docs/runbooks/](../runbooks/) | Operational runbooks (Volume 17 Ch. 26) |
| [Root README](../../README.md) | Project overview and quick start |

---

## Version 1 Feature Checklist

Use this as the implementation gate. Each item maps to Volume 3 requirements.

### Accounts
- [ ] Registration
- [ ] Login / logout
- [ ] Forgot password
- [ ] Subscription management (Stripe)

### Core entities
- [ ] Businesses (CRUD, default selection)
- [ ] Vehicles (CRUD, default vehicle, odometer tracking)
- [ ] Expense categories (defaults + custom)

### Trips
- [ ] Start trip (one tap + required fields)
- [ ] Active trip indicator on dashboard
- [ ] Add expense during trip
- [ ] End trip + "Forgot Something?" checklist
- [ ] Edit / delete / duplicate trip
- [ ] Trip timeline cards

### Receipts
- [ ] Camera capture (mobile PWA)
- [ ] Gallery upload
- [ ] AI OCR extraction
- [ ] Manual correction UI
- [ ] Attach to trip
- [ ] Duplicate detection

### Reports
- [ ] Mileage log (IRS-style)
- [ ] Expense report
- [ ] Combined travel report
- [ ] Daily / weekly / monthly / quarterly / annual filters
- [ ] PDF, CSV, Excel export

### Dashboard
- [ ] Today's mileage
- [ ] Month totals (miles, expenses, deduction estimate)
- [ ] Incomplete trips / receipts pending review
- [ ] Recent activity feed

### Settings
- [ ] Mileage rate (IRS / company / custom)
- [ ] Currency, tax year
- [ ] Multiple vehicles and businesses
- [ ] Notification preferences
- [ ] Data export / account deletion

### AI (V1)
- [ ] Receipt OCR
- [ ] Auto-categorization (suggest, user confirms)
- [ ] Duplicate receipt flag
- [ ] Missing receipt reminders on end trip

---

## Implementation Phases (Post-Blueprint)

| Phase | Scope | Depends on |
|-------|-------|------------|
| **A** | Repo scaffold, H: setup, CI, Netlify skeleton | Blueprint sign-off |
| **B** | Supabase schema + auth + RLS | Phase A |
| **C** | Core trip flow (start → expense → end) | Phase B |
| **D** | Receipt OCR pipeline | Phase C |
| **E** | Reports + exports | Phase C, D |
| **F** | Stripe subscriptions + tier limits | Phase B |
| **G** | Polish: onboarding, empty states, PWA | Phase C–F |
| **H** | Beta launch | All above |

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-06-24 | All artifacts on H: drive | C: nearly full; H: has capacity |
| 2026-06-24 | GitHub → Netlify deploy | User requirement; excellent Next.js support |
| 2026-06-24 | Supabase for backend | Auth, Postgres, Storage, Edge Functions, RLS |
| 2026-06-24 | Next.js PWA for V1 | Mobile-first without App Store delay |
| 2026-06-24 | Blueprint before code | Avoid rework; constitution for all decisions |

*Add rows as decisions are made during blueprint review.*

---

## Sign-Off

| Role | Name | Date | Approved |
|------|------|------|----------|
| Product | | | ☐ |
| Engineering | | | ☐ |

Once signed off, proceed to **Phase A: Repo scaffold**.
