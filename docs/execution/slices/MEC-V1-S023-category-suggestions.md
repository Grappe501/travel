# MEC-V1-S023 — AI Category Suggestions

```txt
Active project: Mileage & Expense Copilot

Build Slice: MEC-V1-S023 — AI Category Suggestions

Mission:
ENG-CAT minimum — suggest expense category on receipt review (MRID-000018 / AI-MRID-000018).

Context:
- Prior: MEC-V1-S022 (STEP-054) duplicate detection complete
- BUILD-ID: BUILD-015 (V1.1 AI categorization)
- MRIDs: MRID-000018, AI-MRID-000018
- Volumes: 5 Ch. 6, 16 ENG-CAT, API-AI-001

Allowed paths:
apps/web/src/lib/ai/category-intelligence.ts
apps/web/src/lib/ai/category-classify.ts
apps/web/src/server/services/category-suggestion.service.ts
apps/web/src/app/api/receipts/[id]/suggest-category/**
apps/web/src/components/receipts/ReceiptReviewPanel.tsx
apps/web/src/server/services/ocr.service.ts
packages/shared/src/schemas/ai.ts

Rules:
- Never auto-save category without user approval
- Layers: merchant KB → keywords → user history → OCR hint → LLM fallback
- Persist `ai_suggestions` rows type `category`
- Show alternatives when confidence < 0.85
- Resolve suggestion accepted/dismissed on approve based on chosen slug

Forbidden:
- Cross-user merchant learning
- Auto-approve receipt based on category alone
- Full ENG-MEM / preference tables in this slice

Deliverables:
1. category-intelligence.ts scoring + tests
2. category-suggestion.service.ts — suggest, record, resolve
3. GET/POST /api/receipts/[id]/suggest-category
4. Receipt review UI — suggestion banner + alternative chips
5. Post-OCR category suggestion hook

Validation:
pnpm lint && pnpm typecheck && pnpm build && pnpm test

Exit criteria:
- [x] Known merchants (Shell, Marriott, etc.) suggest correct category
- [x] User history boosts repeat merchant categorization
- [x] Review UI shows explanation and alternatives when low confidence
- [x] AISuggestion row created type `category`
- [x] Approve resolves suggestion accepted vs dismissed

Commit:
feat(ai): MEC-V1-S023 category suggestion on receipt review

Step: STEP-055
BUILD-IDs: BUILD-015
MRID-IDs: MRID-000018
DRS-IDs: AI-MRID-000018
```
