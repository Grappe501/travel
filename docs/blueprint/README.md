# Mileage & Expense Copilot — Master Build Blueprint

**Version 1.0** | Pre-implementation design constitution

---

## How to Use This Blueprint

1. **Start with Volume 0** — Every feature decision is measured against the Product Doctrine.
2. **Volumes 1–3** define *what* we build and *how users experience it*.
3. **Volumes 4–6** define *data, AI, and technology*.
4. **Volumes 7–9** define *business, security, and quality*.

**No application code is written until this blueprint is reviewed and signed off.**

---

## Volumes

| Vol | Document | Summary |
|-----|----------|---------|
| **0** | [Product Doctrine & Design Constitution](00-product-doctrine.md) | Mission, values, scope boundaries — **read first** |
| **1** | [Product Vision & Strategy](01-product-vision.md) | Cross-functional strategy: vision, pillars, metrics, non-negotiables |
| **2** | [Experience Architecture (UX/UI)](02-user-experience.md) | Every screen, journey, state, design system, micro-specs |
| **3** | [Functional Requirements & Business Logic](03-functional-requirements.md) | FR contract: inputs, rules, acceptance criteria, dependency matrix |
| **4** | [Data Architecture & Database](04-database-architecture.md) | Entities, RLS, storage, events, governance, retention |
| **5** | [AI Design](05-ai-design.md) | OCR, categorization, copilot prompts, confidence |
| **6** | [Technical Architecture](06-technical-architecture.md) | Stack, H: drive, GitHub, Netlify, Supabase |
| **7** | [Business Operations](07-business-operations.md) | Pricing, billing, legal, support, launch |
| **8** | [Security](08-security.md) | Auth, encryption, privacy, compliance roadmap |
| **9** | [Testing & Quality](09-testing-quality.md) | Test strategy, release checklist, accessibility |

---

## Supporting Documents

| Document | Purpose |
|----------|---------|
| [PROJECT-STRUCTURE.md](../PROJECT-STRUCTURE.md) | H: drive filesystem layout |
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
