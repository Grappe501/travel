# MEC-V1-S038 — GPS trip tracking (LOC + TRIP)

**BUILD:** WAVE-003 ext · **STEP:** STEP-070 · **Target:** V1.11.0  
**Domains:** LOC, TRIP, MILE, MOB (offline)  
**MRIDs:** extends TRIP-000004/000005 · new LOC bootstrap MRIDs TBD

---

## Prompt (for build agent)

Implement **STEP-070** per [STEP-070-gps-trip-tracking.md](../build-steps/STEP-070-gps-trip-tracking.md).

### Must ship

1. `trip_gps_points` table + trip GPS columns migration
2. Opt-in GPS tracking on start trip + active trip tracker (foreground)
3. Batch GPS point API + FR-500 mileage merge on end trip
4. Trip detail route summary (polyline/timeline minimum)
5. Offline GPS queue integration
6. Settings privacy copy + default preference
7. Tests, docs, health 1.11.0

### Do not ship in this slice

- Background GPS when app closed
- Auto trip detection without user start
- Paid map tile APIs (prefer SVG polyline)

### Depends on

- STEP-038 trip engine, STEP-053 offline sync, STEP-069 PWA install

### Verify

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm test:integration && pnpm build
```

Manual: Android PWA foreground drive; iOS Add to Home Screen; offline mid-trip sync.

---

## Artifacts

| TYPE | ID | Description |
|------|-----|-------------|
| STEP | STEP-070 | Build step doc |
| FR | FR-300, FR-301, FR-302, FR-500 | Functional coverage |
| SCR | SCR-019, SCR-020, SCR-021 | Start, end, detail |
| API | API-TRIP-GPS-001..003 | Points batch, list, tracking |
| DB | TBL trip_gps_points | New |
| SM | SM-TRIP | Extended completion transition |

---

## Kanban

☑ Complete
