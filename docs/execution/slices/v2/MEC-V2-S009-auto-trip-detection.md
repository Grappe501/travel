# MEC-V2-S009 — Auto trip detection

**STEP:** STEP-082 · **Target:** 2.0.0-beta · **MOB:** MOB-FF-AUTO-TRIP

---

## Prompt (for build agent)

```txt
Active project: Mileage & Expense Copilot

Build Slice: MEC-V2-S009 — Auto trip detection (opt-in drafts)

Mission:
Detect driving segments via Activity Recognition + GPS speed; create trip_drafts; user confirms before trip starts — never silent auto-start.

Context:
- STEP-070 GPS foundation, trip_gps_points
- PWA limits: detection while app backgrounded is best-effort until S010
- Feature flag auto_trip_detection default OFF
- DEC-004: opt-in only

Allowed files:
- prisma migration trip_drafts
- apps/web/src/lib/location/activity-detection.ts
- apps/web/src/lib/location/trip-draft.service.ts
- apps/web/src/components/trips/TripDraftPrompt.tsx
- apps/web/src/app/api/trip-drafts/**
- docs/build-steps/STEP-082-auto-trip-detection.md

Deliverables:
1. trip_drafts table (status: pending|confirmed|dismissed)
2. Client detection hook (speed + activity when app foreground)
3. Push/in-app prompt: "Did you drive for work?"
4. Confirm → creates normal trip with GPS opt-in offered
5. Dismiss → log for analytics
6. Privacy copy in settings
7. Tests for draft state machine

Exit criteria:
- [ ] Flag off → no detection
- [ ] Flag on → draft after simulated drive session
- [ ] Confirm creates trip; dismiss does not
- [ ] No financial records without user action (N6)
```

---

## Kanban

☐ Planned
