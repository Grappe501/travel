# MEC-V2-S002 — Expense categories (SCR-059, FR-610)

**STEP:** STEP-075 · **Target:** 1.15.0

---

## Prompt

```txt
Build Slice: MEC-V2-S002 — Expense categories

Mission:
Custom expense categories per business; replace hardcoded slug-only UX.

Deliverables:
1. Prisma expense_categories table + migration
2. /settings/categories CRUD UI
3. Update getExpenseCategoryOptions() to merge system + custom
4. ENG-CAT prompts include custom labels
5. APP_RELEASE 1.15.0

Exit criteria:
- [ ] User can add/edit/archive custom category
- [ ] Existing expenses unchanged
- [ ] Receipt review dropdown shows custom categories
```

## Kanban

☐ Planned
