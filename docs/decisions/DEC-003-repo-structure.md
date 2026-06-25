# DEC-003 — Repository Structure (V1)

| Field | Value |
|-------|-------|
| **DEC-ID** | DEC-003 |
| **Date** | 2026-06-24 |
| **Status** | **LOCKED** |

---

## Decision

Monorepo at `H:/Travel-Expense/`:

- **`apps/web/`** — Next.js application (`src/` inside)
- **`packages/shared/`** — Zod schemas, calculations, constants
- **`prisma/`** — Schema + migrations at **repo root**
- **`docs/`** — Blueprint, execution, decisions, MRMS, DRS, MEI
- **`tests/`** — Unit, integration, E2E at repo root
- **`scripts/`** — Dev and setup scripts

---

## Rationale

- Matches [PROJECT-STRUCTURE.md](../PROJECT-STRUCTURE.md) monorepo intent
- User execution `src/` layout lives inside `apps/web/src/`
- Prisma at root shares schema across future packages
- H: drive only — no C: drive artifacts

---

## Package manager

**pnpm** workspaces (root `package.json` + `pnpm-workspace.yaml`).

---

## Forbidden paths in slices

- No `C:/` references
- No secrets in `apps/web/public/`
- No receipt files in git
