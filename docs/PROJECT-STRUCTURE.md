# Project Filesystem — H: Drive Specification

**Version:** 1.0  
**Status:** Blueprint (pre-implementation)

This document defines where every artifact lives. **Nothing in this project uses the C: drive** for source, dependencies, caches, temp files, or build output.

---

## Design Goals

1. **Single root** — `H:/Travel-Expense/` is the Git repository and the only project root.
2. **Predictable paths** — Every developer (and CI) resolves the same relative paths.
3. **C: drive isolation** — Redirect OS temp, npm cache, and tool caches to H:.
4. **GitHub → Netlify** — Only committed source deploys; caches and secrets never commit.
5. **Monorepo-ready** — Structure supports web app, shared packages, and Supabase from day one.

---

## Top-Level Directory Tree

```
H:/Travel-Expense/
│
├── apps/
│   └── web/                          # Next.js 15 PWA — primary user-facing app
│       ├── public/                   # Static assets, PWA manifest, icons
│       ├── src/
│       │   ├── app/                  # App Router pages and layouts
│       │   ├── components/           # UI components
│       │   ├── hooks/                # React hooks
│       │   ├── lib/                  # Client utilities, Supabase client
│       │   └── styles/               # Global CSS, design tokens
│       ├── netlify/                  # Optional Netlify Functions (thin proxy layer)
│       ├── package.json
│       ├── next.config.ts
│       └── tsconfig.json
│
├── packages/
│   └── shared/                       # Shared TypeScript types, Zod schemas, constants
│       ├── src/
│       │   ├── types/                # Trip, Receipt, Vehicle, etc.
│       │   ├── schemas/              # Validation schemas
│       │   ├── constants/            # Categories, IRS rates reference
│       │   └── calculations/         # Mileage math, report aggregations
│       └── package.json
│
├── supabase/
│   ├── migrations/                   # SQL migrations (source of truth for schema)
│   ├── functions/                    # Edge Functions (OCR, webhooks, Stripe)
│   ├── seed/                         # Dev seed data
│   └── config.toml                   # Local Supabase config
│
├── docs/
│   ├── blueprint/                    # Master build plan (Volumes 0–9)
│   ├── api/                          # API reference (generated later)
│   └── runbooks/                     # Ops: deploy, rollback, incident response
│
├── scripts/
│   ├── setup-h-drive.ps1             # One-time H: drive environment setup
│   ├── dev.ps1                       # Start local dev stack
│   └── verify-h-paths.ps1            # Assert nothing writes to C:
│
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Lint, typecheck, test on PR
│       └── deploy-preview.yml        # Netlify deploy hooks (optional if using Netlify Git integration)
│
├── .cache/                           # LOCAL ONLY — gitignored
│   ├── npm/                          # npm cache redirect target
│   ├── next/                         # Next.js persistent cache
│   ├── turbo/                        # Turborepo cache (if adopted)
│   └── playwright/                   # Browser binaries for E2E
│
├── .tmp/                             # LOCAL ONLY — gitignored
│   ├── os/                           # TEMP/TMP redirect target
│   ├── uploads/                      # Dev receipt upload staging
│   └── exports/                      # Dev report generation staging
│
├── .vscode/
│   ├── settings.json                 # Workspace paths on H:
│   └── extensions.json               # Recommended extensions
│
├── .env.example                      # Template — copy to .env.local
├── .gitignore
├── netlify.toml                      # Netlify build config
├── package.json                      # Root workspace package.json
├── pnpm-workspace.yaml               # or npm workspaces — TBD at scaffold
├── tsconfig.base.json
└── README.md
```

---

## H: Drive — What Goes Where

| Artifact | Path | Git? | Notes |
|----------|------|------|-------|
| Source code | `apps/`, `packages/`, `supabase/` | Yes | Only committed artifacts |
| Blueprint docs | `docs/blueprint/` | Yes | Design constitution |
| Dependencies | `node_modules/` (per package) | No | `npm install` on H: |
| Next.js build | `apps/web/.next/` | No | Netlify rebuilds from source |
| npm cache | `.cache/npm/` | No | Set via `npm config set cache` |
| OS temp files | `.tmp/os/` | No | Set `TEMP` and `TMP` env vars |
| Local env secrets | `.env.local` | No | Never commit |
| Receipt images (dev) | `.tmp/uploads/` | No | Prod uses Supabase Storage |
| Supabase local DB | `supabase/.temp/` | No | Docker volumes on H: if possible |
| Playwright browsers | `.cache/playwright/` | No | `PLAYWRIGHT_BROWSERS_PATH` |
| User exports (dev) | `.tmp/exports/` | No | Prod generates on-demand |
| CI artifacts | N/A (GitHub Actions) | No | Runs in cloud, not local H: |

---

## Environment Variables (Local Dev)

Create `.env.local` at repo root (see `.env.example` when scaffolded):

```bash
# Force all tooling to H: drive
PROJECT_ROOT=H:/Travel-Expense
TEMP=H:/Travel-Expense/.tmp/os
TMP=H:/Travel-Expense/.tmp/os
npm_config_cache=H:/Travel-Expense/.cache/npm

# Supabase (from Supabase dashboard)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Server-only (never NEXT_PUBLIC_)
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
OPENAI_API_KEY=                    # OCR / receipt intelligence

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Mileage & Expense Copilot
```

Run `.\scripts\setup-h-drive.ps1` to set user-level or session env vars automatically.

---

## Netlify Deployment Mapping

| Local path | Netlify behavior |
|------------|------------------|
| `apps/web/` | `base` directory in `netlify.toml` |
| `apps/web/.next/` | Build output (Next.js adapter) |
| Env vars | Set in Netlify dashboard (not in repo) |
| `netlify.toml` | Committed — build command, headers, redirects |

**Git flow:**

```
H:/Travel-Expense  →  git push origin main  →  Netlify auto-deploy
                     →  PR branch            →  Netlify deploy preview
```

Supabase migrations deploy separately via Supabase CLI or MCP — not through Netlify.

---

## Naming Conventions

| Entity | Convention | Example |
|--------|------------|---------|
| Repo folder | kebab-case | `travel-expense` |
| Package name | `@mileage-copilot/web` | Scoped npm name |
| DB tables | snake_case plural | `trips`, `receipts` |
| API routes | kebab-case | `/api/trips/[id]/end` |
| React components | PascalCase | `TripTimelineCard` |
| Files | kebab-case or PascalCase for components | `start-trip-form.tsx` |
| Migration files | timestamp + slug | `20260624000001_create_trips.sql` |

---

## Disk Budget Estimates (Local Dev)

| Component | Approximate size |
|-----------|------------------|
| `node_modules/` | 400–800 MB |
| `.cache/` (all) | 200–500 MB |
| `.next/` build | 100–300 MB |
| Supabase local Docker | 1–2 GB (if used) |
| **Total typical** | **~2–4 GB on H:** |

Plenty of headroom compared to a nearly-full C: drive.

---

## Verification

After setup, run:

```powershell
.\scripts\verify-h-paths.ps1
```

This script confirms `TEMP`, `TMP`, and npm cache resolve under `H:/Travel-Expense/`.

---

## Related Documents

- [Volume 6 — Technical Architecture](blueprint/06-technical-architecture.md)
- [Volume 4 — Database Architecture](blueprint/04-database-architecture.md)
- [setup-h-drive.ps1](../scripts/setup-h-drive.ps1)
