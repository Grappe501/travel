# STEP-040 — MEC-V1-S008 AI OCR Review

| Field | Value |
|-------|-------|
| **Step ID** | STEP-040 |
| **Phase** | A |
| **Slice** | MEC-V1-S008 |
| **Date** | 2026-06-24 |
| **Commit** | `TBD` |
| **Status** | complete |

## Objective

OpenAI Vision extracts receipt fields server-side; user reviews and edits on a dedicated screen before approving and creating an expense row.

## Changes

- `packages/shared/src/schemas/receipt.ts` — OCR extracted fields + approve schemas, category slugs
- `apps/web/src/lib/ai/config.ts` — server-only OpenAI config
- `apps/web/src/lib/ai/receipt-vision.ts` — Vision API call + JSON parse (PRM-OCR-001)
- `apps/web/src/lib/receipts/categories.ts` — expense category labels
- `apps/web/src/server/services/ocr.service.ts` — run OCR, get review payload, approve + expense create
- API: `POST/GET /api/receipts/[id]/ocr`, `POST /api/receipts/[id]/approve`
- UI: `/receipts/[id]/review`, `ReceiptReviewPanel` — auto-OCR on load, editable fields, approve button
- Upload flow redirects to review; detail/list link to review until confirmed

## Verification

```bash
pnpm lint       # pass
pnpm typecheck  # pass
pnpm build      # pass
```

Requires `OPENAI_API_KEY`, Supabase Storage (signed URL for Vision), and at least one business for approve.

## Traceability

- **BUILD-008** · **MRID-000008** · **MRID-000009** · **OCR-MRID-000008**

## Next step

**STEP-041** — [MEC-V1-S009 Reports](../execution/slices/MEC-V1-S009-reports.md)
