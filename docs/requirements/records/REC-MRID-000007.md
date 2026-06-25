# REC-MRID-000007 — Receipt Camera Capture

| Field | Value |
|-------|-------|
| **Global ID** | MRID-000007 |
| **Domain ID** | REC-MRID-000007 |
| **Category** | REC |
| **Priority** | Critical |
| **Status** | Approved |
| **Version** | 1.0 |
| **Owner** | Engineering |
| **Epic** | EPIC-REC-001 Receipt Management |
| **Feature** | FTR-REC-001 Capture Receipt |

---

## Description

User can photograph a receipt using device camera and upload to storage for processing.

## Business Reason

Receipt capture is the primary expense documentation workflow for field users.

## User Story

As a business traveler  
I want to photograph a receipt  
So that I can document expenses without manual data entry.

---

## Acceptance Criteria

- [ ] Upload succeeds (2xx response)
- [ ] Image stored in Supabase Storage (`receipts` bucket)
- [ ] Thumbnail generated
- [ ] Metadata row created in `receipts` table
- [ ] Audit log entry written
- [ ] OCR job queued (OCR-MRID-000008)
- [ ] Works on mobile PWA (MOB-MRID-000017 offline variant)

---

## Dependencies

| Relation | MRIDs |
|----------|-------|
| **Requires** | AUTH-MRID-000001 |
| **Blocks** | OCR-MRID-000008, REC-MRID-000010 |
| **Related** | TRIP-MRID-000004, MOB-MRID-000017 |

---

## Traceability

| Artifact | ID |
|----------|-----|
| Blueprint | Vol 3 — FR-500 |
| Screen | SCR-031 |
| API | API-RCP-* (upload) |
| State machine | SM-RCP |
| Table | REC (`receipts`, `storage_path`) |
| Analytics | EVT-MOB-002 |
| AI | PRM-OCR-001 (queued) |

---

## Tests

| Type | ID | Description | Status |
|------|-----|-------------|--------|
| IT | IT-REC-001 | Upload + storage + DB row | ☐ |
| E2E | E2E-REC-001 | Camera capture flow SCR-031 | ☐ |
| ACC | ACC-REC-001 | Camera permission + alt text | ☐ |
| SEC | SEC-REC-001 | User cannot upload to another user's path | ☐ |

---

## Accessibility

- Camera permission explained before request
- Upload progress announced
- Fallback to file picker for devices without camera

---

## Documentation

| Volume | Chapter |
|--------|---------|
| 3 | FR-500 |
| 11 | SCR-031 |
| 18 | MOB camera workflow |

---

## Approvals

| Role | Approved |
|------|----------|
| Product | ☑ (from FR-500) |
| Engineering | ☑ |
| UX | ☑ |
| QA | ☑ |

---

## Change History

| Date | Author | Change | Reason |
|------|--------|--------|--------|
| 2026-06-24 | STEP-030 | Created from FR-500 | MRMS bootstrap |
