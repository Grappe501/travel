# STEP-064 — Delete UX v2 (MEC-V1-S032)

**Version:** 1.8.1 · **Screen:** SCR-057 · **API:** `POST /api/restore`, `DELETE /api/reports/[id]`

## Scope

- **ConfirmDeleteDialog** — replaces `window.confirm` across the app
- **RemoveEntryButton v2** — modal confirm + 5-second undo toast
- **Restore API** — `POST /api/restore` soft-undelete from latest delete audit snapshot
- **Report delete** — remove reports from list and detail views
- **Consistent delete UX** — trips, expenses, receipts, reports, clients, projects, businesses, vehicles

## Restore behavior

| Entity | Undo restores |
|--------|----------------|
| Expense | Record + trip link |
| Trip | Status + unlinked expense/receipt links |
| Receipt | Record + linked expenses |
| Report | Full report row from audit snapshot |
| Client / project | Record + prior trip/project links |
| Business / vehicle | Soft-deleted record |

Receipt files are kept on delete so undo can restore the image.

## Verification

- [x] No `window.confirm` on delete flows in app components
- [x] Undo toast appears for 5 seconds after remove
- [x] `restoreEntitySchema` unit tests
- [x] Report list + detail show Remove with redirect
