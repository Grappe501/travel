# Analytics Event Registry — EVENT-REGISTRY

Canonical spec: [Volume 14 — Analytics](../blueprint/14-analytics.md)

Naming: `object_action` · snake_case · past tense for completions

PR convention: `EVT-IDs: EVT-004, EVT-011`

## Activation & lifecycle

| EVT-ID | Event | SCR | SM | PII safe |
|--------|-------|-----|-----|----------|
| EVT-001 | `account_created` | SCR-004 | — | ✓ |
| EVT-002 | `business_created` | SCR-010 | — | ✓ |
| EVT-003 | `vehicle_added` | SCR-011 | — | ✓ |
| EVT-004 | `trip_started` | SCR-019 | SM-TRIP | ✓ |
| EVT-005 | `trip_started_first` | SCR-019 | SM-TRIP | ✓ |
| EVT-006 | `trip_completed` | SCR-020 | SM-TRIP | ✓ |
| EVT-007 | `trip_completed_first` | SCR-020 | SM-TRIP | ✓ |
| EVT-008 | `receipt_uploaded` | SCR-023 | SM-RCP | ✓ |
| EVT-009 | `receipt_uploaded_first` | SCR-023 | SM-RCP | ✓ |
| EVT-010 | `receipt_review_approved` | SCR-024 | SM-RCP | ✓ |
| EVT-011 | `report_generated` | SCR-031 | SM-RPT | ✓ |
| EVT-012 | `report_generated_first` | SCR-031 | SM-RPT | ✓ |
| EVT-013 | `onboarding_completed` | SCR-014 | — | ✓ |

## Receipt & OCR pipeline

| EVT-ID | Event | SCR | SM |
|--------|-------|-----|-----|
| EVT-020 | `receipt_capture_started` | SCR-023 | SM-RCP |
| EVT-021 | `receipt_upload_failed` | SCR-023 | SM-RCP |
| EVT-022 | `receipt_ocr_started` | SCR-024 | SM-OCR |
| EVT-023 | `receipt_ocr_completed` | SCR-024 | SM-OCR |
| EVT-024 | `receipt_ocr_failed` | SCR-024 | SM-OCR |
| EVT-025 | `receipt_field_edited` | SCR-024 | — |
| EVT-026 | `ocr_field_edited` | SCR-024 | — |

## Reports

| EVT-ID | Event | SCR |
|--------|-------|-----|
| EVT-030 | `report_builder_opened` | SCR-031 |
| EVT-031 | `report_generated` | SCR-032 |
| EVT-032 | `report_downloaded` | SCR-032 |
| EVT-033 | `report_failed` | SCR-032 |
| EVT-034 | `report_shared` | SCR-032 |

## Billing

| EVT-ID | Event | SCR |
|--------|-------|-----|
| EVT-040 | `upgrade_prompt_viewed` | SCR-058 |
| EVT-041 | `upgrade_started` | SCR-044 |
| EVT-042 | `upgrade_completed` | SCR-044 |
| EVT-043 | `payment_failed` | SCR-044 |
| EVT-044 | `subscription_canceled` | SCR-044 |
| EVT-045 | `free_limit_reached_trips` | SCR-058 |
| EVT-046 | `free_limit_reached_receipts` | SCR-058 |

## Search & AI

| EVT-ID | Event | SCR |
|--------|-------|-----|
| EVT-050 | `search_query` | SCR-043 |
| EVT-051 | `search_result_clicked` | SCR-043 |
| EVT-052 | `ai_suggestion_shown` | SCR-040 |
| EVT-053 | `ai_suggestion_accepted` | SCR-040 |
| EVT-054 | `ai_suggestion_dismissed` | SCR-040 |

## Sync & reliability

| EVT-ID | Event | SCR |
|--------|-------|-----|
| EVT-060 | `sync_failed` | — |
| EVT-061 | `sync_conflict_shown` | — |
| EVT-062 | `offline_save` | — |

## Mobile & field (Volume 18)

| EVT-ID | Event | SCR |
|--------|-------|-----|
| EVT-MOB-001 | `camera_launch_ms` | SCR-031 |
| EVT-MOB-002 | `receipt_capture_complete` | SCR-031 |
| EVT-MOB-003 | `offline_session_start` | — |
| EVT-MOB-004 | `resume_after_interrupt` | — |
| EVT-MOB-005 | `start_trip_duration_ms` | SCR-022 |
| EVT-MOB-006 | `sync_queue_depth` | SCR-052 |

## Screen views

| EVT-ID | Event | Properties |
|--------|-------|------------|
| EVT-900 | `screen_viewed` | `scr_id` required |
| EVT-901 | `screen_exited` | `scr_id`, `duration_ms` |

## Required properties (all events)

`user_id` · `plan_type` · `device_type` · `platform` · `timestamp` · `app_version` · `session_id`

Optional: `business_id`, `scr_id`, `sm_id`, `request_id`, `error_code`

## Status

| Symbol | Meaning |
|--------|---------|
| ☐ | Not instrumented |
| ☑ | Live in production |

Implementation: `packages/shared/src/analytics/events.ts`
