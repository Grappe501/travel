# MRID Hierarchy — Epic → Feature → Requirement

**MRMS Part VI**

## Structure

```
EPIC-{DOMAIN}-NNN
  └── FTR-{DOMAIN}-NNN
        └── MRID-NNNNNN ({DOMAIN}-MRID-NNNNNN)
              └── Acceptance criteria (in MRID record)
```

---

## V1 Bootstrap Epics

| Epic ID | Name | Features | MRIDs |
|---------|------|----------|-------|
| EPIC-AUTH-001 | Identity & Access | FTR-AUTH-001 Login | 000001 |
| EPIC-BUS-001 | Business Setup | FTR-BUS-001 Profile | 000002 |
| EPIC-VEH-001 | Vehicle Management | FTR-VEH-001 CRUD | 000003 |
| EPIC-TRIP-001 | Trip Management | FTR-TRIP-001 Start, FTR-TRIP-002 End, FTR-TRIP-003 History | 000004–000006 |
| EPIC-REC-001 | Receipt Management | FTR-REC-001 Capture, FTR-REC-002 Attach | 000007, 000010 |
| EPIC-OCR-001 | OCR Pipeline | FTR-OCR-001 Extract, FTR-OCR-002 Review | 000008–000009 |
| EPIC-EXP-001 | Expense Management | FTR-EXP-001 Manual | 000011 |
| EPIC-RPT-001 | Reporting | FTR-RPT-001 Generate, FTR-RPT-002 Export | 000012–000013 |
| EPIC-BILL-001 | Subscription | FTR-BILL-001 Stripe, FTR-BILL-002 Limits | 000014–000015 |
| EPIC-MOB-001 | Offline Field | FTR-MOB-001 Trip sync, FTR-MOB-002 Receipt queue | 000016–000017 |
| EPIC-AI-001 | AI Assistance | FTR-AI-001 Category, FTR-AI-002 Duplicate | 000018–000019 |
| EPIC-ADM-001 | Admin Support | FTR-ADM-001 Lookup | 000020 |

---

## Expansion

As Volume 3 FRs decompose:

1. Group FRs into Epics (by domain chapter)
2. Split FRs into Features (user-visible capabilities)
3. Split Features into atomic MRIDs (one testable unit each)
4. Each acceptance criterion in FR becomes checkbox in MRID record

Target: ~4,405 MRIDs across 23 domains for V1.
