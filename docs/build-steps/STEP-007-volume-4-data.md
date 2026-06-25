# STEP-007 — Volume 4 Data Architecture Rewrite

| Field | Value |
|-------|-------|
| **Step ID** | STEP-007 |
| **Phase** | Blueprint |
| **Date** | 2026-06-24 |
| **Commit** | *(pending)* |
| **Status** | complete |

## Objective

Rewrite Volume 4 as **Data Architecture & Database Master Blueprint** — 26 chapters including business event ledger, search index, odometer history, clients/projects, and data governance standards.

## Changes

- `docs/blueprint/04-database-architecture.md` — full rewrite
- `docs/blueprint/README.md` — updated Volume 4 title
- `docs/blueprint/03-functional-requirements.md` — next-link update

## Decisions

| Decision | Rationale |
|----------|-----------|
| `business_events` ledger (Ch. 26) | Activity feeds, analytics, AI — separate from audit_logs |
| `search_documents` denormalized index | FR-1000 performance at scale |
| `clients` + `projects` tables | Formalize FR-700 / search; denormalize names on trips |
| `vehicle_odometer_history` | Preserve odometer timeline independent of trips |
| `record_status` + `deleted_at` | Three-state soft delete (Ch. 21) |
| Password in auth.users only | Supabase best practice; profiles extend |

## Verification

- [x] 26 chapters complete
- [x] All Volume 3 FRs mapped to tables
- [x] RLS, triggers, migration order documented
- [x] Event catalog for V1
- [x] Retention and backup policies defined

## Next step

Volume 5 AI alignment or Phase B first migration scaffold
