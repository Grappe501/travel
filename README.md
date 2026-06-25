# Mileage & Expense Copilot

> **Every mile. Every receipt. Every deduction.**

AI-assisted travel expense and mileage documentation for self-employed professionals, field workers, and small business owners.

---

## Status

**Phase: Master Blueprint (pre-code)**

No application code has been written yet. This repository currently contains the complete Version 1 design constitution and master build plan. Implementation begins only after blueprint sign-off.

---

## Build Traceability

Every step is versioned on GitHub with a commit, ledger entry, and detail doc.

| Document | Purpose |
|----------|---------|
| [BUILD-LOG.md](BUILD-LOG.md) | Chronological step index (STEP-001, …) |
| [CHANGELOG.md](CHANGELOG.md) | Release history |
| [Traceability protocol](docs/BUILD-TRACEABILITY.md) | How we document each step |

**Repository:** [github.com/Grappe501/travel](https://github.com/Grappe501/travel)

## Quick Links

| Document | Purpose |
|----------|---------|
| [Blueprint Index](docs/blueprint/README.md) | All 10 design volumes |
| [Volume 0 — Product Doctrine](docs/blueprint/00-product-doctrine.md) | Design constitution — read first |
| [Project Structure](docs/PROJECT-STRUCTURE.md) | H: drive filesystem layout |
| [Technical Architecture](docs/blueprint/06-technical-architecture.md) | Stack, Netlify, Supabase, H: drive config |

---

## Working Name

**Mileage & Expense Copilot** (codename: `mileage-copilot`)

Alternative positioning: *Travel Expense OS*

---

## Version 1 Promise

A user can:

- Record a trip in under one minute
- Capture a receipt in under ten seconds
- Generate a reimbursement report in under thirty seconds
- Find any receipt in under five seconds
- Learn the app without a tutorial

---

## Repository Layout (Planned)

```
H:/Travel-Expense/          ← Git repo root (this folder)
├── apps/web/               ← Next.js PWA (Netlify deploy target)
├── packages/shared/        ← Shared types, validators, constants
├── supabase/               ← Migrations, Edge Functions, seed data
├── docs/blueprint/         ← Master build plan (current phase)
├── scripts/                ← H: drive setup, local dev helpers
└── .github/workflows/      ← CI → Netlify deploy
```

See [PROJECT-STRUCTURE.md](docs/PROJECT-STRUCTURE.md) for the full filesystem specification.

---

## Development Environment

**All project artifacts live on `H:/`** — source, dependencies, caches, temp files, and build output. The C: drive is not used for this project.

```powershell
# One-time setup (run from repo root)
.\scripts\setup-h-drive.ps1
```

---

## Deployment Pipeline (Planned)

```
Local (H:/) → GitHub (push) → Netlify (production preview + prod)
                           ↘ Supabase (database, auth, storage, edge functions)
                           ↘ Stripe (subscriptions)
```

---

## Pricing (Version 1)

| Tier | Price | Limits |
|------|-------|--------|
| Free | $0 | 5 trips/mo, 10 receipts/mo, 1 vehicle, 1 business, PDF reports |
| Pro | $4.99/mo | Unlimited trips, receipts, vehicles, businesses, AI OCR, CSV/Excel |
| Small Business | $19.99/mo | Up to 5 employees, approvals, shared dashboard |
| Enterprise | Custom | SSO, API, accounting integrations |

---

## License

Proprietary — all rights reserved (pending incorporation).
