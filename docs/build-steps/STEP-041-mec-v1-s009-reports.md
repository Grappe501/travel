# STEP-041 — MEC-V1-S009 Reports

| Field | Value |
|-------|-------|
| **Step ID** | STEP-041 |
| **Phase** | A |
| **Slice** | MEC-V1-S009 |
| **Date** | 2026-06-25 |
| **Commit** | _(pending traceability)_ |
| **Status** | complete |

## Objective

Report builder with mileage, expense, and combined types; server-side PDF, CSV, and Excel export; persisted `Report` rows with optional Supabase Storage artifact and download API.

## Changes

- `packages/shared/src/schemas/report.ts` — generate/list schemas, 366-day date-range guard
- `apps/web/src/lib/reports/types.ts` — trip/expense row types, summary builder
- `apps/web/src/lib/reports/generators/pdf.ts` — pdfkit PDF export
- `apps/web/src/lib/reports/generators/csv.ts` — CSV export
- `apps/web/src/lib/reports/generators/xlsx.ts` — exceljs workbook export
- `apps/web/src/lib/storage/config.ts` — `buildReportStoragePath()`
- `apps/web/src/server/services/report.service.ts` — query data, generate files, upload, audit + business events
- API: `GET/POST /api/reports`, `GET /api/reports/[id]`, `GET /api/reports/[id]/download`
- UI: `ReportManager`, `/reports`, `/reports/[id]`
- Health: `/health` → `MEC-V1-S009` / `STEP-041`

## Verification

```bash
pnpm lint       # pass
pnpm typecheck  # pass
pnpm build      # pass
```

Requires `DATABASE_URL`, Supabase Storage (`STORAGE_BUCKET`, `SUPABASE_SERVICE_ROLE_KEY`) for persisted exports; download falls back to on-the-fly regeneration when storage is unavailable.

## Traceability

- **BUILD-010** · **MRID-000012** · **MRID-000013** · **RPT-MRID-000012** · **RPT-MRID-000013**

## Next step

**STEP-042** — [MEC-V1-S010 Billing & Limits](../execution/slices/MEC-V1-S010-billing.md)
