# MEC-V1-S022 — AI Duplicate Receipt Detection

```txt
Active project: Mileage & Expense Copilot

Build Slice: MEC-V1-S022 — AI Duplicate Receipt Detection

Mission:
BUILD-012 — warn users about likely duplicate receipts before save (MRID-000019 / AI-MRID-000019).

Context:
- Prior: MEC-V1-S021 (STEP-053) offline sync complete
- BUILD-ID: BUILD-012
- MRIDs: MRID-000019, AI-MRID-000019
- Volumes: 5 Ch. 7, 16 ENG-DUP, API-AI-002

Allowed paths:
apps/web/src/lib/ai/duplicate-detection.ts
apps/web/src/server/services/duplicate-detection.service.ts
apps/web/src/app/api/receipts/[id]/check-duplicate/**
apps/web/src/components/receipts/ReceiptReviewPanel.tsx
apps/web/src/server/services/receipt.service.ts
apps/web/src/server/services/ocr.service.ts
packages/shared/src/schemas/receipt.ts

Rules:
- Never auto-delete or block without user acknowledgment
- Score ≥ 0.85 flags duplicate (hash = 1.0, merchant+total+date = 0.9)
- Persist `ai_suggestions` rows type `duplicate_receipt`
- Hash check on upload; fuzzy check pre-approve
- User must explicitly "Save anyway" (`acknowledgeDuplicate: true`)

Forbidden:
- Auto-merge or auto-delete duplicates
- LLM-based duplicate detection in V1.1 slice (deterministic only)
- Category suggestion scope (MRID-000018 separate)

Deliverables:
1. duplicate-detection.ts scoring helpers + tests
2. duplicate-detection.service.ts — find, suggest, assert on approve
3. GET/POST /api/receipts/[id]/check-duplicate
4. Receipt review UI warning with View / Save anyway
5. Upload hook records hash duplicates

Validation:
pnpm lint && pnpm typecheck && pnpm build && pnpm test

Exit criteria:
- [x] Exact file hash match flags duplicate on upload
- [x] Fuzzy merchant+total+date match shown on review
- [x] Approve blocked until user acknowledges duplicate
- [x] AISuggestion row created for pending duplicate
- [x] API returns 409 DUPLICATE_RECEIPT_DETECTED when blocked

Commit:
feat(ai): MEC-V1-S022 duplicate receipt detection

Step: STEP-054
BUILD-IDs: BUILD-012
MRID-IDs: MRID-000019
DRS-IDs: AI-MRID-000019
```
