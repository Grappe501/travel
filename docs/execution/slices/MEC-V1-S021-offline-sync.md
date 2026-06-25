# MEC-V1-S021 — Offline Sync (BUILD-006)

```txt
Active project: Mileage & Expense Copilot

Build Slice: MEC-V1-S021 — Offline Sync

Mission:
BUILD-006 — offline trip start/end and receipt capture with IndexedDB queue and reconnect sync (MRID-000016, MRID-000017).

Context:
- Prior: MEC-V1-S020 (STEP-052) GA complete
- BUILD-ID: BUILD-006
- MRIDs: MOB-MRID-000016, MOB-MRID-000017 (MRID-000016, MRID-000017)
- Volumes: 18 Ch. 8–10, Volume 6 Ch. 16–17, FR-1400, FR-1500

Allowed paths:
apps/web/src/lib/offline/**
apps/web/src/components/offline/**
apps/web/src/components/trips/TripManager.tsx
apps/web/src/components/receipts/ReceiptManager.tsx
apps/web/src/components/layout/DashboardShell.tsx
apps/web/src/app/layout.tsx
apps/web/src/app/trips/**
apps/web/src/app/settings/page.tsx

Rules:
- IndexedDB queue; auto-sync on `online` event
- FIFO: trip_start before trip_end; idempotency keys on upload/sync
- Offline banner + settings sync panel (Volume 18 MOB-OFF-UI)
- No silent overwrite of server financial data (conflicts → sync_failed + user retry)
- Reports/billing remain online-only

Forbidden:
- Full PWA service worker (defer post-V1.1)
- Offline OCR or report export
- Scope creep into BUILD-012 AI duplicate

Deliverables:
1. lib/offline — IndexedDB, queue, sync engine
2. OfflineProvider + OfflineBanner + SyncStatusPanel
3. Trip start/end offline paths + receipt upload queue
4. Settings sync status + manual Sync now
5. Unit tests for queue ordering/helpers

Validation:
pnpm lint && pnpm typecheck && pnpm build && pnpm test

Exit criteria:
- [x] User can start/end trip while offline; data queues locally
- [x] User can capture receipt offline; blob stored in IndexedDB
- [x] Reconnect triggers sync to existing API routes
- [x] Offline banner and sync pending count visible
- [x] Settings shows last synced + manual sync

Commit:
feat(offline): MEC-V1-S021 offline sync queue for trips and receipts

Step: STEP-053
BUILD-IDs: BUILD-006
MRID-IDs: MRID-000016, MRID-000017
DRS-IDs: MOB-MRID-000016, MOB-MRID-000017
```
