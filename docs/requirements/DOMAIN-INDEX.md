# Domain Index — MRID Categories & DRS Allocation

**MRMS Part III & XXV** · **DRS registry:** [DRS-INDEX.md](../domains/DRS-INDEX.md)

## Dual ID Format

| Form | Example | Use |
|------|---------|-----|
| Global (canonical) | `MRID-000004` | Code, DB, commits |
| Domain (DRS) | `TRIP-MRID-000004` | Search, reports, ownership |
| Full artifact | `TRIP-API-001` | APIs, screens, tests — see [DRS-TYPE-REGISTRY](../domains/DRS-TYPE-REGISTRY.md) |

The numeric suffix is **identical** across `MRID` and `{DOMAIN}-MRID`. Domain = primary category per [MRMS-2 DRS](MRMS-2-DRS.md).

---

## Category Registry

| Code | Domain | V1 est. | ID range (guidance) | Blueprint source |
|------|--------|--------:|---------------------|------------------|
| AUTH | Authentication | 75 | 000001–000075 | Vol 3 FR-001–099, Vol 8 |
| USER | Users & profiles | 60 | 000076–000135 | Vol 3, Vol 4 profiles |
| BUS | Businesses | 120 | 000136–000255 | Vol 3 FR-100–199 |
| VEH | Vehicles | 80 | 000256–000335 | Vol 3 FR-200–299 |
| TRIP | Trips | 250 | 000336–000585 | Vol 3 FR-300–399 |
| REC | Receipts | 300 | 000586–000885 | Vol 3 FR-400–499 |
| OCR | OCR | 150 | 000886–001035 | Vol 5, Vol 16 |
| EXP | Expenses | 220 | 001036–001255 | Vol 3 FR-600–699 |
| RPT | Reports | 250 | 001256–001505 | Vol 3 FR-700–799 |
| BILL | Billing | 140 | 001506–001645 | Vol 3 FR-012, Vol 7 | **DRS: SUB** |
| AI | Artificial intelligence | 250 | 001646–001895 | Vol 5, Vol 16 | |
| SRCH | Search | 80 | 001896–001975 | Vol 5, Vol 22 | **DRS: SEARCH** |
| ADM | Administration | 300 | 001976–002275 | Vol 17 | **DRS: ADMIN** |
| AN | Analytics | 250 | 002276–002525 | Vol 14 | |
| NOTIF | Notifications | 180 | 002526–002705 | Vol 15 | **DRS: NOTIFY** |
| SEC | Security | 250 | 002706–002955 | Vol 8 |
| OPS | Operations | 300 | 002956–003255 | Vol 19 |
| MOB | Mobile & offline | 250 | 003256–003505 | Vol 18 |
| API | API contracts | 150 | 003506–003655 | Vol 12 |
| UX | Experience | 120 | 003656–003775 | Vol 2, Vol 24 |
| PERF | Performance | 80 | 003776–003855 | Vol 9, Vol 19 |
| DOC | Documentation | 150 | 003856–004005 | All volumes |
| TEST | Testing meta | 400 | 004006–004405 | Vol 9 |

**Estimated V1 total:** ~4,405 MRIDs (aligns with 4,000–4,500 target)

---

## Bootstrap Block (V1 Critical Path)

MRID-000001–000020 are **pre-approved seeds** on the critical build path. They use early global numbers for historical continuity with MEI BUILD slices. Domain prefixes assigned by primary category:

| Global | Domain ID | Category |
|--------|-----------|----------|
| MRID-000001 | AUTH-MRID-000001 | AUTH |
| MRID-000002 | BUS-MRID-000002 | BUS |
| MRID-000003 | VEH-MRID-000003 | VEH |
| MRID-000004 | TRIP-MRID-000004 | TRIP |
| MRID-000005 | TRIP-MRID-000005 | TRIP |
| MRID-000006 | TRIP-MRID-000006 | TRIP |
| MRID-000007 | REC-MRID-000007 | REC |
| MRID-000008 | OCR-MRID-000008 | OCR |
| MRID-000009 | OCR-MRID-000009 | OCR |
| MRID-000010 | REC-MRID-000010 | REC |
| MRID-000011 | EXP-MRID-000011 | EXP |
| MRID-000012 | RPT-MRID-000012 | RPT |
| MRID-000013 | RPT-MRID-000013 | RPT |
| MRID-000014 | BILL-MRID-000014 | BILL |
| MRID-000015 | BILL-MRID-000015 | BILL |
| MRID-000016 | MOB-MRID-000016 | MOB |
| MRID-000017 | MOB-MRID-000017 | MOB |
| MRID-000018 | AI-MRID-000018 | AI |
| MRID-000019 | AI-MRID-000019 | AI |
| MRID-000020 | ADM-MRID-000020 | ADM |

**New MRIDs** after bootstrap should allocate from category guidance ranges above.

---

## Allocating a New MRID

1. Identify primary category (one only)
2. Find next available number in category range (or bootstrap if critical-path)
3. Create record from [MRID-TEMPLATE.md](MRID-TEMPLATE.md)
4. Add row to [MRID-REGISTRY.md](MRID-REGISTRY.md)
5. Link SCR / API / EVT / tests
6. Set status **Draft** → run approval workflow

**Never** reuse or renumber.
