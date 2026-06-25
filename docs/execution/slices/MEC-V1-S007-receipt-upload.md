# MEC-V1-S007 — Receipt Upload

```txt
Active project: Mileage & Expense Copilot

Build Slice: MEC-V1-S007 — Receipt Upload

Mission:
Upload receipt images to private storage, create receipt records, show receipt detail with status workflow.

Context:
- Prior: MEC-V1-S006 complete
- MRID: REC-MRID-000007
- Storage: Supabase Storage private bucket (DEC-001)
- Requires STORAGE configured

Allowed paths:
apps/web/src/app/receipts/**
apps/web/src/lib/storage/**
apps/web/src/server/services/receipt.service.ts
apps/web/src/app/api/receipts/**

Statuses: uploaded → processing → needs_review → approved → failed

Forbidden:
- OpenAI calls (S008)
- Public bucket URLs
- OCR auto-approve

Deliverables:
1. Upload UI (file + camera where supported)
2. Storage upload + FileAsset row
3. Receipt metadata in Prisma
4. Receipt detail page with status badge
5. Audit log on upload

Validation:
pnpm lint && pnpm typecheck && pnpm build

Exit criteria:
- [ ] User uploads receipt
- [ ] File stored privately
- [ ] Metadata saved
- [ ] Status = uploaded (or processing)

Commit:
feat(receipts): MEC-V1-S007 receipt upload and storage

Step: STEP-039
BUILD-IDs: BUILD-007
MRID-IDs: MRID-000007
DRS-IDs: REC-MRID-000007, REC-SCREEN-001
```
