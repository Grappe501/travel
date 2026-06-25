# TRIP-MRID-000004 — Start Trip

| Field | Value |
|-------|-------|
| **Global ID** | MRID-000004 |
| **Domain ID** | TRIP-MRID-000004 |
| **Category** | TRIP |
| **Priority** | Critical |
| **Status** | Approved |
| **Version** | 1.0 |
| **Owner** | Engineering |
| **Epic** | EPIC-TRIP-001 Trip Management |
| **Feature** | FTR-TRIP-001 Start Trip |

---

## Description

User can begin recording a business trip with timestamp, selected business, and selected vehicle.

## Business Reason

Core workflow — without start trip, no mileage capture, receipts, or reports.

## User Story

As a business traveler  
I want to start a trip  
So that I can record mileage and expenses for that journey.

---

## Acceptance Criteria

- [ ] Trip record created with status `active`
- [ ] `started_at` timestamp saved (server authoritative when online)
- [ ] Vehicle selected and validated (ownership, active)
- [ ] Business selected and validated (ownership)
- [ ] Audit log entry written
- [ ] Analytics event `trip_started` (EVT-010) recorded
- [ ] Only one active trip per user (V1)
- [ ] Subscription trip quota checked (BILL-MRID-000015)

---

## Dependencies

| Relation | MRIDs |
|----------|-------|
| **Requires** | AUTH-MRID-000001, BUS-MRID-000002, VEH-MRID-000003 |
| **Blocks** | TRIP-MRID-000005, REC-MRID-000010, EXP-MRID-000011 |
| **Related** | TRIP-MRID-000006, MOB-MRID-000016 |

---

## Traceability

| Artifact | ID |
|----------|-----|
| Blueprint | Vol 3 — FR-300 |
| Screen | SCR-019 |
| API | API-TRIP-001 |
| State machine | SM-TRIP |
| Table | TRP (`trips`) |
| Fields | `started_at`, `start_odometer`, `vehicle_id`, `business_id`, `status` |
| Analytics | EVT-010 |
| AI | None |

---

## Tests

| Type | ID | Description | Status |
|------|-----|-------------|--------|
| UT | UT-TRIP-001 | Active trip validator | ☐ |
| IT | IT-TRIP-001 | POST start trip + RLS | ☐ |
| E2E | E2E-TRIP-001 | Full start flow SCR-019 | ☐ |
| ACC | ACC-TRIP-001 | Keyboard + screen reader on start form | ☐ |
| SEC | SEC-TRIP-001 | Cannot start trip for another user's vehicle | ☐ |

---

## Accessibility

- Start button reachable via keyboard
- Vehicle/business selectors announce labels (VoiceOver/TalkBack)
- Error states announced to screen readers

---

## Documentation

| Volume | Chapter |
|--------|---------|
| 3 | FR-300 |
| 11 | SCR-019 |
| 12 | API-TRIP-001 |
| 13 | SM-TRIP |

---

## Approvals

| Role | Approved |
|------|----------|
| Product | ☑ (from FR-300) |
| Engineering | ☑ |
| UX | ☑ |
| QA | ☑ |

---

## Change History

| Date | Author | Change | Reason |
|------|--------|--------|--------|
| 2026-06-24 | STEP-030 | Created from FR-300 | MRMS bootstrap |
