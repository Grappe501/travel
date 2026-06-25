# STEP-054 — MEC-V1-S022 AI Duplicate Detection

| Field | Value |
|-------|-------|
| **Step ID** | STEP-054 |
| **Phase** | B (V1.1) |
| **Slice** | MEC-V1-S022 |
| **BUILD-ID** | BUILD-012 |
| **WAVE** | WAVE-008 |
| **Date** | 2026-06-25 |
| **Commit** | — |
| **Status** | complete |

## Objective

Deterministic duplicate receipt detection on upload and pre-approve (MRID-000019).

## Changes

- `lib/ai/duplicate-detection.ts` — hash + fuzzy scoring (threshold 0.85)
- `duplicate-detection.service.ts` — lookup, AISuggestion records, approve guard
- `GET/POST /api/receipts/[id]/check-duplicate`
- Receipt review UI — duplicate warning, View / Save anyway
- Upload path runs hash duplicate check after storage
- `receiptApproveSchema.acknowledgeDuplicate` optional flag
- `DuplicateReceiptDetectedError` (409) with match payload

## Verification

```bash
pnpm lint            # pass
pnpm typecheck       # pass
pnpm build           # pass
pnpm test            # pass (includes duplicate-detection.test.ts)
```

## Next step

V1.1 backlog — category AI suggestions (MRID-000018) or client/project modules
