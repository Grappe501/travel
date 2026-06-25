# MEC-V2-S005 — Event bus + integrations scaffold

**STEP:** STEP-078 · **Target:** 1.18.0 · **ROAD:** ROAD-CAT-PLAT

---

## Prompt

```txt
Build Slice: MEC-V2-S005 — Event bus + integrations package scaffold

Mission:
Emit BusinessEvent on all domain writes; create packages/integrations with adapter interfaces.

Deliverables:
1. Audit trip/receipt/expense/report services — emit events (see packet §6.2)
2. packages/integrations with calendar + accounting noop adapters
3. ADR docs/architecture/decisions/ADR-001-event-bus.md
4. Workspace package.json wiring
5. APP_RELEASE 1.18.0

Exit criteria:
- [ ] trip.ended creates BusinessEvent row
- [ ] pnpm --filter integrations test passes (smoke)
- [ ] GO-NO-GO section C6 ready
```

## Kanban

☐ Planned
