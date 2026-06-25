# STEP-053 — MEC-V1-S021 Offline Sync

| Field | Value |
|-------|-------|
| **Step ID** | STEP-053 |
| **Phase** | B (V1.1) |
| **Slice** | MEC-V1-S021 |
| **BUILD-ID** | BUILD-006 |
| **WAVE** | WAVE-003 ext |
| **Date** | 2026-06-25 |
| **Commit** | — |
| **Status** | complete |

## Objective

Offline trip start/end and receipt capture with IndexedDB queue and reconnect sync (MRID-000016, MRID-000017).

## Changes

- `lib/offline/**` — IndexedDB (`idb`), queue, sync engine, connectivity helpers
- `components/offline/**` — provider, banner, active trip banner, sync settings panel
- Trip/receipt forms — offline paths when `navigator.onLine` is false
- `/trips/[offline-id]/end` — client shell for local active trips
- Settings — sync status + manual sync
- Dependency: `idb`
- Unit tests: `offline.test.ts`

## Verification

```bash
pnpm lint            # pass
pnpm typecheck       # pass
pnpm build           # pass
pnpm test            # pass
```

## Next step

**STEP-054** — BUILD-012 AI duplicate detection (TBD)
