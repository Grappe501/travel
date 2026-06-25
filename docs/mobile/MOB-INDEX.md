# Mobile & Field Experience Registry — MOB-INDEX

Canonical spec: [Volume 18 — Mobile Field Experience](../blueprint/18-mobile-field-experience.md)

## Screen classes

| MOB-SC-ID | Range | Layout |
|-----------|-------|--------|
| MOB-SC-XS | < 360px | 1 col |
| MOB-SC-SM | 360–414px | 1 col |
| MOB-SC-MD | 415–767px | 1–2 col |
| MOB-SC-TB-S | 768–1023px | 2 col |
| MOB-SC-TB-L | ≥ 1024px | 2–3 col |

## Navigation

| MOB-ID | Item | Route |
|--------|------|-------|
| MOB-NAV-001 | Bottom nav shell | — |
| MOB-NAV-FAB | Start Trip FAB | `StartTripSheet` |

## Field workflows

| MOB-ID | Workflow | Time target |
|--------|----------|-------------|
| MOB-WF-START | Start trip | < 10s |
| MOB-WF-END | End trip | < 15s |
| MOB-WF-FUEL | Fuel stop | < 20s |
| MOB-WF-HOTEL | Hotel multi-receipt | — |
| MOB-WF-CAPTURE | Receipt camera | < 500ms launch |
| MOB-WF-IMG | Image processing pipeline | — |

## Offline states

| MOB-ID | State |
|--------|-------|
| MOB-OFF-TRIP-START | Offline start trip |
| MOB-OFF-TRIP-END | Offline end trip |
| MOB-OFF-RECEIPT | Offline receipt capture |
| MOB-OFF-EDIT | Offline edits |
| MOB-OFF-REPORT | Queued report |
| MOB-OFF-PROFILE | Profile patch queue |
| MOB-OFF-UI | Indicator components |

## Interruptions

| MOB-ID | Scenario |
|--------|----------|
| MOB-INT-CALL | Phone call interrupt |
| MOB-INT-BG | Background / foreground |

## Performance

| MOB-ID | Metric |
|--------|--------|
| MOB-PERF-START | Startup targets (Ch. 17) |

## Future feature flags

| MOB-FF-ID | Feature | V1 |
|-----------|---------|-----|
| MOB-FF-CAM-ADV | Edge detect, auto-capture | — |
| MOB-FF-WIDGET | Home screen widgets | — |
| MOB-FF-AUTO-TRIP | Auto trip detection | — |
| MOB-FF-VOICE | Voice logging | — |
| MOB-FF-WATCH | Smartwatch | — |

## Mobile analytics (Volume 14)

| EVT-ID | Event |
|--------|-------|
| EVT-MOB-001 | `camera_launch_ms` |
| EVT-MOB-002 | `receipt_capture_complete` |
| EVT-MOB-003 | `offline_session_start` |
| EVT-MOB-004 | `resume_after_interrupt` |
| EVT-MOB-005 | `start_trip_duration_ms` |
| EVT-MOB-006 | `sync_queue_depth` |

PR convention: `MOB-IDs: MOB-WF-START, MOB-OFF-RECEIPT`
