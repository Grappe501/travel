# STEP-001 — Master Blueprint v1.0

| Field | Value |
|-------|-------|
| **Step ID** | STEP-001 |
| **Phase** | Blueprint |
| **Date** | 2026-06-24 |
| **Commit** | *(updated after first push to GitHub)* |
| **Status** | complete |

## Objective

Establish the complete Version 1 design constitution before writing application code. Define H: drive filesystem, deployment pipeline (GitHub → Netlify), and all ten blueprint volumes.

## Changes

### Documentation
- `docs/blueprint/00-product-doctrine.md` through `09-testing-quality.md`
- `docs/blueprint/README.md` — index and V1 feature checklist
- `docs/PROJECT-STRUCTURE.md` — H: drive layout

### Configuration
- `README.md` — project overview
- `.gitignore` — excludes caches, secrets, build output on H:
- `netlify.toml` — deploy skeleton (base: `apps/web`)
- `.env.example` — environment template
- `.vscode/settings.json` — workspace pinned to H:

### Scripts
- `scripts/setup-h-drive.ps1` — creates `.cache/`, `.tmp/`, sets user env vars
- `scripts/verify-h-paths.ps1` — confirms paths resolve to H:

### Placeholders (no app code)
- `apps/web/.gitkeep`
- `packages/shared/.gitkeep`
- `supabase/migrations/.gitkeep`

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Local storage | 100% on `H:\Travel-Expense` | C: drive nearly full |
| Backend | Supabase | Auth, Postgres, Storage, Edge Functions, RLS |
| Frontend | Next.js 15 PWA | Mobile-first, Netlify-compatible |
| Deploy | GitHub → Netlify | User requirement |
| Code gate | Blueprint before Phase A | Avoid rework |

## Verification

- [x] All 10 blueprint volumes written
- [x] `setup-h-drive.ps1` creates directories on H:
- [x] Path verification passes when H: env vars active
- [ ] GitHub push *(STEP-002)*

## Next step

[STEP-002 — Git traceability & GitHub init](STEP-002-git-traceability.md)
