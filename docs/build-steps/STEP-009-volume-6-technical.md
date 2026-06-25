# STEP-009 — Volume 6 Technical Architecture Rewrite

| Field | Value |
|-------|-------|
| **Step ID** | STEP-009 |
| **Phase** | Blueprint |
| **Date** | 2026-06-24 |
| **Commit** | *(pending)* |
| **Status** | complete |

## Objective

Rewrite Volume 6 as **Technical Architecture & Production Infrastructure** — 33 chapters as the build spine for Cursor/engineers, aligned with Supabase + Netlify + H: drive decisions.

## Changes

- `docs/blueprint/06-technical-architecture.md` — full rewrite (33 chapters)
- `.env.example` — aligned with Ch. 22
- `docs/tech-debt/README.md` — TD record location (Ch. 33)
- `docs/blueprint/README.md` — updated Volume 6 title

## Decisions

| Decision | Rationale |
|----------|-----------|
| Supabase over Prisma/Neon | Locked in Volumes 4–5; SQL migrations source of truth |
| Edge Functions for OCR/Stripe/reports | Secrets off Netlify; Deno isolated |
| CRUD via Supabase client + RLS | No redundant REST layer V1 |
| Modular monorepo structure | User spec + PROJECT-STRUCTURE.md |
| Chapter 31 Cursor rules | Agent guardrails |
| TD-NNN debt records | Ch. 33 sustainable MVP |

## Verification

- [x] 33 chapters complete
- [x] Stack decision record documents alternatives
- [x] Build order matches Volume 3 dependency matrix
- [x] Production readiness checklist (Ch. 28)
- [x] H: drive + GitHub + Netlify documented

## Next step

STEP-010 Phase A scaffold OR Volume 7–9 blueprint review
