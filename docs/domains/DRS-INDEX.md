# Domain Registry — DRS-INDEX

**MRMS-2 Part III** · Permanent domain codes. **Never rename. Never recycle.**

Status key: ☑ Registered · ☐ Reserved for future

---

## 1 — Core Platform

| Code | Name | MRMS alias | Status | Record |
|------|------|------------|--------|--------|
| **CORE** | Platform Core | — | ☑ | — |
| **AUTH** | Authentication | AUTH | ☑ | [records/AUTH.md](records/AUTH.md) |
| **USER** | Users & Profiles | USER | ☑ | — |
| **ORG** | Organizations | — | ☐ | V1.1+ |
| **BUS** | Businesses | BUS | ☑ | [records/BUS.md](records/BUS.md) |
| **TEAM** | Teams | — | ☐ | V1.1+ |
| **ROLE** | Permissions & Roles | — | ☑ | — |

---

## 2 — Travel

| Code | Name | MRMS alias | Status | Record |
|------|------|------------|--------|--------|
| **TRIP** | Trip Engine | TRIP | ☑ | [records/TRIP.md](records/TRIP.md) |
| **VEH** | Vehicles | VEH | ☑ | [records/VEH.md](records/VEH.md) |
| **ROUTE** | Routes | — | ☐ | V1.1+ |
| **LOC** | Location & GPS | — | ☑ | — |
| **MILE** | Mileage calculation | — | ☑ | — |
| **MOB** | Mobile & Offline | MOB | ☑ | [records/MOB.md](records/MOB.md) |

---

## 3 — Receipts

| Code | Name | MRMS alias | Status | Record |
|------|------|------------|--------|--------|
| **REC** | Receipts | REC | ☑ | [records/REC.md](records/REC.md) |
| **OCR** | OCR pipeline | OCR | ☑ | [records/OCR.md](records/OCR.md) |
| **MERCH** | Merchant recognition | — | ☑ | — |
| **CAT** | Expense categories | — | ☑ | — |
| **EXP** | Expenses | EXP | ☑ | [records/EXP.md](records/EXP.md) |

---

## 4 — Reporting

| Code | Name | MRMS alias | Status | Record |
|------|------|------------|--------|--------|
| **RPT** | Reports | RPT | ☑ | [records/RPT.md](records/RPT.md) |
| **PDF** | PDF generation | — | ☑ | — |
| **EXPORT** | CSV / Excel export | — | ☑ | — |
| **PRINT** | Print layouts | — | ☐ | V1.1+ |

---

## 5 — AI

| Code | Name | MRMS alias | Status | Record |
|------|------|------------|--------|--------|
| **AI** | AI core | AI | ☑ | [records/AI.md](records/AI.md) |
| **PROMPT** | Prompt registry | — | ☑ | — |
| **MEM** | Personal memory | — | ☑ | — |
| **SEARCH** | AI search | SRCH | ☑ | — |
| **DUP** | Duplicate detection | — | ☑ | — |
| **PRED** | Prediction | — | ☐ | V1.1+ |

---

## 6 — Platform Infrastructure

| Code | Name | MRMS alias | Status | Record |
|------|------|------------|--------|--------|
| **API** | API layer meta | API | ☑ | — |
| **DB** | Database meta | — | ☑ | — |
| **FILE** | Object storage | — | ☑ | — |
| **CACHE** | Caching | — | ☐ | V1.1+ |
| **QUEUE** | Job queues | — | ☑ | — |
| **SYNC** | Offline sync | — | ☑ | — |

---

## 7 — Billing

| Code | Name | MRMS alias | Status | Record |
|------|------|------------|--------|--------|
| **SUB** | Subscriptions | BILL | ☑ | [records/SUB.md](records/SUB.md) |
| **PAY** | Payments | — | ☑ | — |
| **INV** | Invoices | — | ☐ | V1.1+ |
| **TAX** | Tax configuration | — | ☑ | — |

---

## 8 — Admin

| Code | Name | MRMS alias | Status | Record |
|------|------|------------|--------|--------|
| **ADMIN** | AdminOS | ADM | ☑ | [records/ADMIN.md](records/ADMIN.md) |
| **OPS** | Operations | OPS | ☑ | — |
| **SUP** | Support | — | ☑ | — |
| **MON** | Monitoring | — | ☑ | — |

---

## 9 — Analytics

| Code | Name | MRMS alias | Status | Record |
|------|------|------------|--------|--------|
| **AN** | Analytics core | AN | ☑ | [records/AN.md](records/AN.md) |
| **BI** | Business intelligence | — | ☑ | — |
| **FUNNEL** | Funnels | — | ☑ | — |
| **EVENT** | Event tracking meta | — | ☑ | — |

---

## 10 — Communication

| Code | Name | MRMS alias | Status | Record |
|------|------|------------|--------|--------|
| **NOTIFY** | Notifications | NOTIF | ☑ | — |
| **EMAIL** | Email | — | ☑ | — |
| **PUSH** | Push | — | ☑ | — |
| **SMS** | SMS | — | ☐ | V2.0 |

---

## 11 — UX

| Code | Name | MRMS alias | Status | Record |
|------|------|------------|--------|--------|
| **UX** | Experience | UX | ☑ | — |
| **UI** | User interface | — | ☑ | — |
| **COMP** | Components | — | ☑ | — |
| **NAV** | Navigation | — | ☑ | — |

*Note: Screens use `{DOMAIN}-SCREEN-NNN` under the workflow domain (e.g. `TRIP-SCREEN-002`), not the UX domain code.*

---

## 12 — Testing

| Code | Name | Purpose | Status |
|------|------|---------|--------|
| **UNIT** | Unit tests | Domain-prefixed UT-* | ☑ |
| **INT** | Integration tests | Domain-prefixed IT-* | ☑ |
| **E2E** | End-to-end | Domain-prefixed E2E-* | ☑ |
| **ACC** | Accessibility | Domain-prefixed ACC-* | ☑ |
| **PERF** | Performance | Domain-prefixed PERF-* | ☑ |
| **SEC** | Security testing | Domain-prefixed SEC-* | ☑ |

*Test domain codes are **type namespaces** for `TRIP-TEST-018` style IDs. Primary test ownership follows the feature domain.*

---

## 13 — Documentation

| Code | Name | Status |
|------|------|--------|
| **DOC** | General documentation | ☑ |
| **ARCH** | Architecture docs | ☑ |
| **GUIDE** | User guides | ☑ |
| **KB** | Knowledge base | ☐ |

---

## Statistics

| Metric | Value |
|--------|------:|
| Registered domains | 58 |
| Active V1 domains | 48 |
| Reserved (future) | 10 |
| Domain records (exemplars) | 12 |

---

## MRMS → DRS alias map

| MRMS v1 code | DRS canonical | Notes |
|--------------|---------------|-------|
| BILL | SUB | Subscriptions domain |
| ADM | ADMIN | AdminOS |
| NOTIF | NOTIFY | Notifications |
| SRCH | SEARCH | AI search |

New artifacts use **DRS canonical** codes.
