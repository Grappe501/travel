# MEC-V1-S008 — AI OCR Review

```txt
Active project: Mileage & Expense Copilot

Build Slice: MEC-V1-S008 — AI OCR Review

Mission:
OpenAI Vision extracts receipt fields; user reviews and approves before financial data is finalized.

Context:
- Prior: MEC-V1-S007 complete
- MRIDs: OCR-MRID-000008, OCR-MRID-000009
- PRM-OCR-001 · DNA: AI never silently finalizes

Allowed paths:
apps/web/src/lib/ai/**
apps/web/src/app/receipts/[id]/review/**
apps/web/src/server/services/ocr.service.ts
apps/web/src/app/api/receipts/[id]/ocr/**
apps/web/src/app/api/receipts/[id]/approve/**

Extract: merchant, date, subtotal, tax, total, category suggestion
Write: OCRResult + confidence scores

Forbidden:
- Auto-approve without user action
- Skipping review screen for cloud uploads
- Client-side OpenAI key exposure

Deliverables:
1. Server-side Vision call on upload complete (or manual trigger)
2. Review screen with editable fields
3. Approve creates/links Expense
4. Category suggestion (non-binding)

Validation:
pnpm lint && pnpm typecheck && pnpm build

Exit criteria:
- [ ] OCR runs server-side
- [ ] User edits before approve
- [ ] Approved receipt → expense row
- [ ] Failed OCR → needs_review or failed status

Commit:
feat(ocr): MEC-V1-S008 OpenAI vision review and approve

Step: STEP-040
BUILD-IDs: BUILD-008
MRID-IDs: MRID-000008, MRID-000009
DRS-IDs: OCR-MRID-000008, OCR-AI-001
```
