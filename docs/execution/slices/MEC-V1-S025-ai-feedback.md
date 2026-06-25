# MEC-V1-S025 — AI Feedback & History

```txt
Active project: Mileage & Expense Copilot

Build Slice: MEC-V1-S025 — AI Feedback (V1.2)

Mission:
API-AI-003 — log user feedback and AI pipeline outcomes to ai_interaction_log; SCR-041 history UI.

Context:
- Prior: MEC-V1-S024 (STEP-056) client/project modules complete
- BUILD-ID: BUILD-017
- APIs: API-AI-003, API-DSH-003 partial (history)
- Screen: SCR-041 /ai/history

Allowed paths:
prisma/schema.prisma
packages/shared/src/schemas/ai.ts
apps/web/src/server/services/ai-feedback.service.ts
apps/web/src/app/api/ai/**
apps/web/src/app/ai/history/**
apps/web/src/components/ai/**
apps/web/src/server/services/ocr.service.ts
apps/web/src/server/services/category-suggestion.service.ts
apps/web/src/server/services/duplicate-detection.service.ts

Rules:
- Append-only ai_interaction_log — no updates/deletes
- Feedback resolves linked AISuggestion when suggestionId provided
- Auto-log OCR, category, duplicate outcomes on existing flows
- Never log raw receipt images or PII beyond merchant name in metadata

Deliverables:
1. ai_interaction_log table + migration
2. POST /api/ai/feedback, GET /api/ai/history
3. Pipeline logging on OCR / category / duplicate resolve
4. /ai/history page (SCR-041)
5. Settings link to AI history

Validation:
pnpm lint && pnpm typecheck && pnpm build && pnpm test

Exit criteria:
- [x] POST feedback creates log row and updates suggestion
- [x] OCR/category/duplicate flows write interaction logs
- [x] /ai/history shows timeline with stats
- [x] SCR-041 shipped

Commit:
feat(ai): MEC-V1-S025 AI feedback and interaction history

Step: STEP-057
BUILD-IDs: BUILD-017
```
