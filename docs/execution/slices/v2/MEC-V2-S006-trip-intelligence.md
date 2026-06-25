# MEC-V2-S006 — Trip intelligence (ENG-TRIP)

**STEP:** STEP-079 · **Target:** 2.0.0-alpha · **ROAD:** ROAD-AI-L3, ROAD-VER-2.0

---

## Prompt (for build agent)

```txt
Active project: Mileage & Expense Copilot

Build Slice: MEC-V2-S006 — Trip intelligence engine

Mission:
Implement ENG-TRIP: after trip end, suggest missing receipts, fuel stops, and trip packaging for reports — user accepts each suggestion.

Context:
- VERSION_2_EXECUTION_PACKET.md §6.3 AI orchestrator
- V1 ai_suggestions table, feedback-outcome.ts
- BusinessEvent trip.ended from S005
- N6: suggestions only, never auto-attach

Allowed files:
- apps/web/src/lib/ai/orchestrator/**
- apps/web/src/lib/ai/engines/trip.ts
- apps/web/src/server/services/trip-intelligence.service.ts
- apps/web/src/components/trips/TripSuggestionsPanel.tsx
- apps/web/src/app/trips/[id]/page.tsx
- packages/shared/src/schemas/ai-suggestion.ts
- docs/build-steps/STEP-079-trip-intelligence.md

Deliverables:
1. Orchestrator routes trip.ended → ENG-TRIP
2. Rules: miles > 50 → fuel receipt prompt; same-day unattached receipts; link client if calendar later
3. UI panel on trip detail + end-trip confirmation
4. ai_suggestions rows with engine=trip, confidence, explanation
5. Accept/dismiss → ai_interaction_log + feedback-outcome
6. Feature flag trip_intelligence (default on for beta)
7. Unit tests for rules; APP_RELEASE 2.0.0-alpha

Exit criteria:
- [ ] Ending trip with 80+ miles shows fuel suggestion
- [ ] Accept attaches receipt or creates reminder notification
- [ ] Dismiss does not mutate data
- [ ] GO-NO-GO D1 measurable
```

---

## Kanban

☐ Planned
