# STEP-051 — MEC-V1-S019 AdminOS Minimum

| Field | Value |
|-------|-------|
| **Step ID** | STEP-051 |
| **Phase** | B |
| **Slice** | MEC-V1-S019 |
| **BUILD-ID** | BUILD-013 |
| **WAVE** | WAVE-009 |
| **Date** | 2026-06-25 |
| **Commit** | — |
| **Status** | complete |

## Objective

Read-only admin customer lookup by email, account summary, system health (MRID-000020).

## Changes

- `lib/auth/admin.ts` — allowlist + `app_metadata.role` admin/support check
- `server/services/admin.service.ts` — lookup, summary, audit log, admin health
- `GET /api/admin/users?email=` — admin-only lookup + `admin.view_user` audit entry
- `GET /api/admin/health` — DB ping + dependency flags (no secrets)
- `/admin` dashboard with email search; `/admin/users/[id]` summary; `/admin/health`
- `DashboardShell` + admin components; non-admin → 403 (pages + API)
- `.env.example` — `ADMIN_EMAIL_ALLOWLIST`; production checklist admin section
- Tests: `admin.test.ts`, API auth inventory + 403 for non-admin

## Verification

```bash
pnpm lint            # pass
pnpm typecheck       # pass
pnpm build           # pass
pnpm test            # pass
```

## Next step

**STEP-052** — [MEC-V1-S020 Launch GA](../execution/slices/MEC-V1-S020-launch-ga.md)
