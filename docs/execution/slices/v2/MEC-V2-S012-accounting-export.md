# MEC-V2-S012 — QuickBooks / Xero export

**STEP:** STEP-085 · **Target:** 2.2.0 · **ROAD:** ROAD-INT

---

## Prompt (for build agent)

```txt
Active project: Mileage & Expense Copilot

Build Slice: MEC-V2-S012 — QuickBooks / Xero export adapters

Mission:
One-way export of approved expenses and mileage to QuickBooks Online and Xero — no bi-directional sync in V2.

Context:
- packages/integrations from S005
- integration_connections table
- Accountant role from S003

Deliverables:
1. integration_connections migration
2. QuickBooks OAuth + export API or CSV fallback
3. Xero manual journal CSV export
4. /settings/integrations export UI
5. Export audit log in BusinessEvent
6. APP_RELEASE 2.2.0

Exit criteria:
- [ ] QB connect + export 10 test expenses
- [ ] Xero CSV import validated in sandbox docs
- [ ] GO-NO-GO E4 — 3 real user validations documented
```

---

## Kanban

☐ Planned
