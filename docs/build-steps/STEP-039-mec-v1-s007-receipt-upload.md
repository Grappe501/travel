# STEP-039 — MEC-V1-S007 Receipt Upload

| Field | Value |
|-------|-------|
| **Step ID** | STEP-039 |
| **Phase** | A |
| **Slice** | MEC-V1-S007 |
| **Date** | 2026-06-24 |
| **Commit** | `2fedd86` |
| **Status** | complete |

## Objective

Upload receipt images/PDFs to private Supabase Storage, persist `Receipt` + `FileAsset` rows, show list/detail with status workflow, and audit on upload.

## Changes

- `apps/web/src/lib/storage/config.ts` — bucket name, storage paths
- `apps/web/src/lib/storage/server.ts` — Supabase admin client (service role)
- `apps/web/src/lib/receipts/constants.ts` — mime types, max 10 MB, display status mapping
- `apps/web/src/server/services/receipt.service.ts` — list, upload, signed URL, audit + FileAsset
- API: `/api/receipts`, `/api/receipts/upload`, `/api/receipts/[id]`, `/api/receipts/[id]/file`
- UI: `ReceiptManager` — upload form (file + camera capture), list, detail card
- Pages: `/receipts`, `/receipts/upload`, `/receipts/[id]`

## Verification

```bash
pnpm lint       # pass
pnpm typecheck  # pass
pnpm build      # pass
```

Requires `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and private `STORAGE_BUCKET` (default `receipts`) for runtime upload/preview.

## Traceability

- **BUILD-007** · **MRID-000007** · **REC-MRID-000007**

## Next step

**STEP-041** — [MEC-V1-S009 Reports](../execution/slices/MEC-V1-S009-reports.md)
