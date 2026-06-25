# Mileage & Expense Copilot

> **Every mile. Every receipt. Every deduction.**

AI-assisted travel expense and mileage documentation for self-employed professionals, field workers, and small business owners.

---

## Status

**Implementation in progress** — MEC-V1-S001 complete

**Control stack:** [MEI](docs/MASTER-EXECUTION-INDEX.md) · [V1 Execution Package](docs/execution/VERSION_1_EXECUTION_PACKAGE.md)

**Next:** [MEC-V1-S002 — Database](docs/execution/slices/MEC-V1-S002-database.md) (STEP-034)

---

## Local development

Prerequisites: Node.js 22+, pnpm 9+, repo on `H:/Travel-Expense/`

```powershell
cd H:\Travel-Expense
pnpm install
copy .env.example .env.local   # edit placeholders as needed for later slices
pnpm dev                       # http://localhost:3000
```

Validation:

```powershell
pnpm lint
pnpm typecheck
pnpm build
```

Health check: [http://localhost:3000/health](http://localhost:3000/health) → `{ "status": "ok" }`

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
| [Master Execution Index (MEI)](docs/MASTER-EXECUTION-INDEX.md) | **Construction schedule** — open this while building |
| [MRMS — Requirements System](docs/requirements/MRMS.md) | **Requirements backbone** — every MRID |
| [V1 Execution Package](docs/execution/VERSION_1_EXECUTION_PACKAGE.md) | **Start coding here** — 10 slices + prompts |
| [Go/No-Go Checklist](docs/execution/GO-NO-GO-CHECKLIST.md) | Sign-off before S001 |
| [Volume 24 — Product Constitution](docs/blueprint/24-product-constitution.md) | **Permanent identity** — design DNA |
| [Blueprint Index](docs/blueprint/README.md) | All planning volumes (0–24) |
| [Volume 21 — Construction Manual](docs/blueprint/21-construction-manual.md) | **First build** — waves, AI protocol |
| [Volume 23 — Product Factory](docs/blueprint/23-product-factory.md) | **Factory OS** — every feature lifecycle |
| [Volume 22 — Platform Architecture](docs/blueprint/22-platform-architecture.md) | Platform constitution — 10-year evolution |
| [Project Structure](docs/PROJECT-STRUCTURE.md) | H: drive filesystem layout |
| [Technical Architecture & Production Infrastructure](docs/blueprint/06-technical-architecture.md) | Stack, deploy, Cursor build rules |

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

## Repository Layout

```
H:/Travel-Expense/
├── apps/web/               ← Next.js 15 (deploy target)
├── packages/shared/        ← Shared types and constants
├── prisma/                 ← Schema (Slice 002)
├── docs/                   ← Blueprint + execution packet
├── tests/                  ← unit / integration / e2e
└── scripts/                ← H: drive setup
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
