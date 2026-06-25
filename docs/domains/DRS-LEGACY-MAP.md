# DRS Legacy ID Mapping

**Transition layer** — Volume catalogs (SCR, API, EVT) ↔ DRS namespace.

Rule: **DRS is canonical for new work.** Legacy IDs remain in code until migrated.

---

## Trip Domain (bootstrap)

| DRS ID | Legacy ID | Name |
|--------|-----------|------|
| TRIP-MRID-000004 | MRID-000004 | Start trip |
| TRIP-MRID-000005 | MRID-000005 | End trip |
| TRIP-MRID-000006 | MRID-000006 | Trip history |
| TRIP-SCREEN-001 | SCR-017 | Trip list |
| TRIP-SCREEN-002 | SCR-019 | Start trip |
| TRIP-SCREEN-003 | SCR-020 | End trip |
| TRIP-API-001 | API-TRIP-001 | POST start trip |
| TRIP-API-002 | API-TRIP-002 | POST end trip |
| TRIP-DB-001 | TBL TRP | `trips` table |
| TRIP-FIELD-001 | — | `trips.started_at` → TRIP-MRID-000004 |
| TRIP-FIELD-002 | — | `trips.start_odometer` → TRIP-MRID-000004 |
| TRIP-EVENT-001 | EVT-010 | `trip_started` |
| TRIP-EVENT-002 | EVT-011 | `trip_ended` |
| TRIP-SM-001 | SM-TRIP | Trip state machine |
| TRIP-DOC-001 | Vol 3 FR-300 | Start trip spec |
| TRIP-DOC-002 | Vol 3 FR-302 | End trip spec |
| TRIP-TEST-001 | E2E-TRIP-001 | Start trip E2E |

---

## Receipt Domain (bootstrap)

| DRS ID | Legacy ID | Name |
|--------|-----------|------|
| REC-MRID-000007 | MRID-000007 | Receipt capture |
| REC-MRID-000010 | MRID-000010 | Attach to trip |
| REC-SCREEN-001 | SCR-031* | Capture UI |
| REC-API-001 | API-RCP-* | Upload |
| REC-DB-001 | TBL REC | `receipts` |
| REC-EVENT-001 | EVT-MOB-002 | `receipt_captured` |

*\*SCR-031 in catalog may be report builder — reconcile during Volume 11 DRS pass.*

---

## OCR Domain (bootstrap)

| DRS ID | Legacy ID | Name |
|--------|-----------|------|
| OCR-MRID-000008 | MRID-000008 | OCR extract |
| OCR-MRID-000009 | MRID-000009 | OCR review |
| OCR-AI-001 | PRM-OCR-001 | Receipt OCR prompt |
| OCR-ENG-001 | ENG-OCR | OCR engine |
| OCR-EVENT-001 | EVT-052 | `ocr_completed` |

---

## Auth Domain (bootstrap)

| DRS ID | Legacy ID | Name |
|--------|-----------|------|
| AUTH-MRID-000001 | MRID-000001 | Register / login |
| AUTH-SCREEN-001 | SCR-003 | Login |
| AUTH-API-001 | API-AUTH-002 | Login |
| AUTH-DB-001 | TBL USR | `profiles` |
| AUTH-EVENT-001 | EVT-001 | `user_signed_up` |

---

## Billing Domain (bootstrap)

| DRS ID | Legacy ID | Name |
|--------|-----------|------|
| SUB-MRID-000014 | MRID-000014 / BILL-MRID-000014 | Stripe subscribe |
| SUB-MRID-000015 | MRID-000015 / BILL-MRID-000015 | Tier limits |
| SUB-API-001 | API-SUB-* | Subscription APIs |
| SUB-DB-001 | TBL SUB | `subscriptions` |

---

## Admin Domain (bootstrap)

| DRS ID | Legacy ID | Name |
|--------|-----------|------|
| ADMIN-MRID-000020 | MRID-000020 / ADM-MRID-000020 | Customer lookup |
| ADMIN-SCREEN-001 | SCR-054 | Admin lookup |
| ADMIN-API-001 | API-ADM-001 | Admin search |

---

## Mapping Convention

When adding rows:

1. Assign next `{DOMAIN}-{TYPE}-NNN` in that domain
2. Add legacy row if catalog ID exists
3. Link MRID chain in [chains/](chains/)
4. Update domain record artifact count

**Batch migration:** One domain at a time during BUILD slices.
