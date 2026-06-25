# STEP-015 — Volume 12 API Constitution

| Field | Value |
|-------|-------|
| **Step ID** | STEP-015 |
| **Phase** | Blueprint |
| **Date** | 2026-06-24 |
| **Commit** | `36379c5` |
| **Status** | complete |

## Objective

Add **Volume 12 — API Architecture & Integration Specification** — the API Constitution with 70+ API-IDs, response envelope, error registry, and Supabase two-layer architecture.

## Changes

- `docs/blueprint/12-api-architecture.md` — 42 chapters
- `docs/api-catalog/API-INDEX.md` — implementation tracker
- `docs/api-catalog/ERROR-CODES.md` — stable error codes
- Blueprint README, Volumes 6, 11 cross-links

## Decisions

| Decision | Rationale |
|----------|-----------|
| Two-layer API (PostgREST + Edge Functions) | Matches locked Supabase stack |
| API-ID catalog (API-MODULE-NNN) | Parallel to SCR-IDs; cross-project language |
| Standard response envelope | Client adapter wraps PostgREST + functions |
| 42 chapters incl. API Constitution | User spec |
| Zod schemas as validation source | Volume 6 Ch. 24 alignment |

## Verification

- [x] 42 chapters complete
- [x] Auth through admin APIs documented
- [x] Error code registry (20+ codes)
- [x] Pagination, filtering, idempotency, rate limits
- [x] Dependency map + V1 inventory
- [x] API non-negotiables + Constitution (Ch. 42)

## Next step

Blueprint sign-off → **STEP-017 Phase A: Repo scaffold**
