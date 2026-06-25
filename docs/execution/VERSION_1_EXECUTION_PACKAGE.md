# Version 1 Execution Package

**Build Packet v1.0** · **STEP-032**

> **No more conceptual design.** This document is the compressed first-build instruction set. After [Go/No-Go](GO-NO-GO-CHECKLIST.md) sign-off, start **MEC-V1-S001**.

| Control document | Role |
|------------------|------|
| [MEI](../MASTER-EXECUTION-INDEX.md) | Schedule & BUILD registry |
| [MRMS](../requirements/MRMS.md) | Requirements (MRIDs) |
| [DRS](../requirements/MRMS-2-DRS.md) | Domain namespace |
| **This packet** | **V1 scope, stack, slices, prompts** |

---

## 1. Product Lock

| Field | Value |
|-------|-------|
| **Product name** | Mileage & Expense Copilot |
| **Core promise** | Every mile. Every receipt. Every report. |
| **V1 goal** | User can log trips, attach receipts, calculate mileage reimbursement, and generate clean reports |
| **Repo root** | `H:/Travel-Expense/` |
| **GitHub** | [github.com/Grappe501/travel](https://github.com/Grappe501/travel) |

**V1 is not:** accounting software, tax software, payroll, or GPS auto-tracking.

---

## 2. Final Tech Stack (LOCKED)

**Decision record:** [DEC-001-tech-stack.md](../decisions/DEC-001-tech-stack.md)

| Layer | Choice | Notes |
|-------|--------|-------|
| App | **Next.js 15** + React + **TypeScript** | App Router, PWA-ready |
| Styling | **Tailwind CSS** | Volume 10 tokens in Slice 004 |
| Database | **Neon Postgres** | Serverless Postgres |
| ORM | **Prisma** | Schema in `prisma/schema.prisma` |
| Auth | **Supabase Auth** | JWT + `@supabase/ssr`; Clerk deferred |
| Payments | **Stripe** | Checkout + Customer Portal + webhooks |
| AI / OCR | **OpenAI Vision** | Server-side only; never silent finalize |
| Storage | **Supabase Storage** | Private `receipts` bucket |
| Email | **Resend** | Transactional |
| Hosting | **Netlify** | Existing `netlify.toml`; SSR via Next adapter |
| Validation | **Zod** | Shared with Prisma types |
| Testing | **Vitest** + **Playwright** | Unit + E2E critical paths |
| Monitoring | **Sentry** | Errors + performance |

*Amends blueprint Volume 6 (Supabase-native migrations) for V1 implementation velocity. RLS policies enforced in Prisma middleware + service layer + DB roles where needed.*

---

## 3. Version 1 Included Features

### Core (in scope)

- User accounts · Business profile · Vehicle profile · Mileage rate settings
- Start trip · End trip · Edit trip · Trip history
- Receipt upload · AI receipt scan · Manual OCR correction
- Expense categories · Attach receipt to trip · Mileage calculation
- PDF report · CSV export · Excel export
- Free usage limits · Pro subscription · Small Business subscription

### Pricing (LOCKED)

| Tier | Price | Limits |
|------|-------|--------|
| **Free** | $0 | 5 trips/mo · 10 receipts/mo |
| **Pro** | $4.99/mo | Unlimited personal |
| **Small Business** | $19.99/mo | Up to 5 employees |

---

## 4. Version 1 Excluded (SCOPE LOCK)

**Do not build during V1.** No mid-build additions without scope change process ([DEC-002](../decisions/DEC-002-v1-scope-lock.md)).

- GPS auto-tracking · Automatic bank sync · QuickBooks/Xero
- Native mobile app · SMS · Enterprise SSO · Public API
- Full accounting · Tax filing · Payroll · Advanced fleet management
- Offline sync (BUILD-006) — **V1.1** per roadmap
- AdminOS full (BUILD-013) — **minimum lookup only if time**
- AI duplicate detection (BUILD-012) — **V1.1**

---

## 5. Repository Structure

**Decision:** [DEC-003-repo-structure.md](../decisions/DEC-003-repo-structure.md)

```
H:/Travel-Expense/
├── apps/
│   └── web/                          # Next.js app
│       ├── public/
│       └── src/
│           ├── app/                  # App Router
│           │   ├── dashboard/
│           │   ├── trips/
│           │   ├── receipts/
│           │   ├── expenses/
│           │   ├── reports/
│           │   ├── vehicles/
│           │   ├── businesses/
│           │   ├── billing/
│           │   ├── settings/
│           │   ├── admin/
│           │   ├── api/
│           │   ├── login/
│           │   ├── signup/
│           │   └── health/
│           ├── components/
│           │   ├── ui/
│           │   ├── layout/
│           │   ├── dashboard/
│           │   ├── trips/
│           │   ├── receipts/
│           │   ├── reports/
│           │   └── billing/
│           ├── lib/
│           │   ├── auth/
│           │   ├── db/
│           │   ├── billing/
│           │   ├── storage/
│           │   ├── ai/
│           │   ├── reports/
│           │   ├── validation/
│           │   ├── permissions/
│           │   ├── analytics/
│           │   └── audit/
│           ├── server/
│           │   └── services/
│           └── types/
│       ├── package.json
│       ├── next.config.ts
│       └── tsconfig.json
├── packages/
│   └── shared/                       # Zod schemas, calculations, constants
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── docs/
│   ├── blueprint/                    # Volumes 0–24 (library)
│   ├── execution/                    # This packet + slice prompts
│   ├── decisions/                    # DEC-* locked choices
│   ├── requirements/                 # MRMS
│   ├── domains/                      # DRS
│   └── mei/                          # MEI catalogs
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── scripts/
├── .env.example                      # Placeholders only
├── netlify.toml
└── package.json                      # Workspace root (pnpm)
```

### Naming rules

| Item | Rule |
|------|------|
| Routes | kebab-case folders (`/trips/start`) |
| Components | PascalCase files (`TripCard.tsx`) |
| Services | `*.service.ts` in `server/services/` |
| API routes | `apps/web/src/app/api/{resource}/route.ts` |
| Prisma models | PascalCase singular (`Trip`, `Receipt`) |
| DB tables | snake_case via `@@map` |
| Env vars | SCREAMING_SNAKE in `.env.example` |

---

## 6. Environment Variables

See [env.example](env.example). **Never commit secrets.**

```txt
DATABASE_URL=
DIRECT_URL=

NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_NAME="Mileage & Expense Copilot"

AUTH_SECRET=

SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

OPENAI_API_KEY=

STORAGE_BUCKET=
SUPABASE_STORAGE_URL=

RESEND_API_KEY=
SENTRY_DSN=
```

---

## 7. First 10 Build Slices

| Slice | Name | BUILD | MRIDs | Prompt |
|-------|------|-------|-------|--------|
| **MEC-V1-S001** | Project scaffold | BUILD-001 | — | [S001](slices/MEC-V1-S001-scaffold.md) |
| **MEC-V1-S002** | Database foundation | BUILD-001 | — | [S002](slices/MEC-V1-S002-database.md) |
| **MEC-V1-S003** | Authentication | BUILD-002 | AUTH-000001 | [S003](slices/MEC-V1-S003-auth.md) |
| **MEC-V1-S004** | Design system v1 | BUILD-003 | — | [S004](slices/MEC-V1-S004-design-system.md) |
| **MEC-V1-S005** | Business & vehicle | BUILD-004 | 000002–000003 | [S005](slices/MEC-V1-S005-business-vehicle.md) |
| **MEC-V1-S006** | Trip engine | BUILD-005 | TRIP-000004–006 | [S006](slices/MEC-V1-S006-trip-engine.md) |
| **MEC-V1-S007** | Receipt upload | BUILD-007 | REC-000007 | [S007](slices/MEC-V1-S007-receipt-upload.md) |
| **MEC-V1-S008** | AI OCR review | BUILD-008 | OCR-000008–009 | [S008](slices/MEC-V1-S008-ocr-review.md) |
| **MEC-V1-S009** | Reports | BUILD-010 | RPT-000012–013 | [S009](slices/MEC-V1-S009-reports.md) |
| **MEC-V1-S010** | Billing & limits | BUILD-011 | SUB-000014–015 | [S010](slices/MEC-V1-S010-billing.md) |

**Order is mandatory.** No feature slices before S001–S004 complete.

Full index: [SLICE-INDEX.md](SLICE-INDEX.md)

---

## 8. Cursor / Burt Standard Prompt Template

Every slice prompt in [slices/](slices/) follows:

```
Active project: Mileage & Expense Copilot
Build Slice: MEC-V1-S0NN — <name>
Mission / Context / Allowed / Forbidden / Deliverables / Validation / Exit / Commit
```

Template: [CURSOR-SLICE-TEMPLATE.md](CURSOR-SLICE-TEMPLATE.md)

---

## 9. Validation Commands (global)

```bash
pnpm lint
pnpm typecheck
pnpm build
```

When database touched:

```bash
pnpm prisma validate
pnpm prisma generate
```

When tests exist:

```bash
pnpm test
pnpm test:e2e
```

---

## 10. Go / No-Go

**[GO-NO-GO-CHECKLIST.md](GO-NO-GO-CHECKLIST.md)** — all items must be ☑ before MEC-V1-S001.

---

## 11. Immediate Next Step

```
STEP-033 → MEC-V1-S001 → Project Scaffold
```

Copy prompt from [slices/MEC-V1-S001-scaffold.md](slices/MEC-V1-S001-scaffold.md) into Cursor. One slice per session.

---

*V1 Execution Package v1.0 — Blueprint complete · Implementation begins now*
