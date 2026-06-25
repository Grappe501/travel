# MEC-V1-S009 — Reports

```txt
Active project: Mileage & Expense Copilot

Build Slice: MEC-V1-S009 — Reports

Mission:
Report builder with mileage, expense, and combined reports; PDF, CSV, and Excel export.

Context:
- Prior: MEC-V1-S008 complete
- MRIDs: RPT-MRID-000012, RPT-MRID-000013
- Requires trips + expenses data

Allowed paths:
apps/web/src/app/reports/**
apps/web/src/lib/reports/**
apps/web/src/server/services/report.service.ts
apps/web/src/app/api/reports/**

Filters: date range, business, vehicle (client/project fields nullable for V1.1)

Forbidden:
- Tax filing formats
- QuickBooks export
- Unbounded date range without pagination guard

Deliverables:
1. /reports builder UI
2. Mileage + expense + combined report types
3. PDF generation (server)
4. CSV + Excel export
5. Report record in DB

Validation:
pnpm lint && pnpm typecheck && pnpm build

Exit criteria:
- [ ] User generates report for date range
- [ ] PDF downloads and looks professional
- [ ] CSV and Excel export work
- [ ] Report saved in Report table

Commit:
feat(reports): MEC-V1-S009 mileage expense export PDF CSV Excel

Step: STEP-041
BUILD-IDs: BUILD-010
MRID-IDs: MRID-000012, MRID-000013
```
