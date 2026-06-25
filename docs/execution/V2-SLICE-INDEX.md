# MEC-V2 Build Slice Index

Maps V2 execution slices → STEP → release → ROAD-ID.

**Packet:** [VERSION_2_EXECUTION_PACKET.md](VERSION_2_EXECUTION_PACKET.md)  
**Scope lock:** [DEC-004](../decisions/DEC-004-v2-scope-lock.md)  
**Go/No-Go:** [GO-NO-GO-V2-CHECKLIST.md](GO-NO-GO-V2-CHECKLIST.md)

---

## Phase A — Bridge (ROAD-VER-1.5)

| Slice | Name | STEP | Version | WAVE | ROAD-IDs | Kanban |
|-------|------|------|---------|------|----------|--------|
| MEC-V2-S001 | Help center | STEP-074 | 1.14.0 | WAVE-V2-001 | ROAD-CAT-UX | ☑ Complete |
| MEC-V2-S002 | Expense categories | STEP-075 | 1.15.0 | WAVE-V2-001 | ROAD-CAT-UX | ☐ Planned |
| MEC-V2-S003 | Team invites & accountant | STEP-076 | 1.16.0 | WAVE-V2-002 | ROAD-CAT-COLLAB | ☐ Planned |
| MEC-V2-S004 | Analytics, flags, feedback | STEP-077 | 1.17.0 | WAVE-V2-002 | ROAD-CAT-REL | ☐ Planned |
| MEC-V2-S005 | Event bus + integrations scaffold | STEP-078 | 1.18.0 | WAVE-V2-003 | ROAD-CAT-PLAT | ☐ Planned |

**Gate:** GO-NO-GO sections A + C before Phase B.

---

## Phase B — V2.0 Intelligent capture (ROAD-VER-2.0)

| Slice | Name | STEP | Version | WAVE | ROAD-IDs | Kanban |
|-------|------|------|---------|------|----------|--------|
| MEC-V2-S006 | Trip intelligence (ENG-TRIP) | STEP-079 | 2.0.0-α | WAVE-V2-004 | ROAD-AI-L3 | ☐ Planned |
| MEC-V2-S007 | Calendar integration | STEP-080 | 2.0.0-α | WAVE-V2-004 | ROAD-INT | ☐ Planned |
| MEC-V2-S008 | Reminder intelligence L3 | STEP-081 | 2.0.0-β | WAVE-V2-005 | ROAD-AI-L3 | ☐ Planned |
| MEC-V2-S009 | Auto trip detection | STEP-082 | 2.0.0-β | WAVE-V2-005 | MOB-FF-AUTO-TRIP | ☐ Planned |
| MEC-V2-S010 | Capacitor + background GPS | STEP-083 | 2.1.0 | WAVE-V2-006 | ROAD-CAT-PERF | ☐ Planned |
| MEC-V2-S011 | On-device OCR + AI eval | STEP-084 | 2.1.0 | WAVE-V2-006 | ROAD-AI-L2 | ☐ Planned |

**Gate:** GO-NO-GO sections B + D before S009.

---

## Phase C — V2 GA

| Slice | Name | STEP | Version | WAVE | ROAD-IDs | Kanban |
|-------|------|------|---------|------|----------|--------|
| MEC-V2-S012 | QuickBooks / Xero export | STEP-085 | 2.2.0 | WAVE-V2-007 | ROAD-INT | ☐ Planned |
| MEC-V2-S013 | Client profitability | STEP-086 | 2.2.0 | WAVE-V2-007 | ROAD-CAT-AI | ☐ Planned |
| MEC-V2-S014 | Manager approvals | STEP-087 | 2.2.0 | WAVE-V2-008 | ROAD-COLLAB | ☐ Planned |

**Gate:** GO-NO-GO section E for 2.2.0 GA.

---

## Phase D — Platform

| Slice | Name | STEP | Version | WAVE | ROAD-IDs | Kanban |
|-------|------|------|---------|------|----------|--------|
| MEC-V2-S015 | Partner API + webhooks | STEP-088 | 2.3.0 | WAVE-V2-009 | ROAD-API | ☐ Planned |
| MEC-V2-S016 | Local-first sync spike | STEP-089 | 2.3.0 | WAVE-V2-009 | ROAD-CAT-PLAT | ☐ Planned |

---

## Screen coverage (new / updated)

| SCR-ID | Screen | Slice | Route |
|--------|--------|-------|-------|
| SCR-051 | Help Center | S001 | `/help`, `/help/[slug]` |
| SCR-059 | Expense Categories | S002 | `/settings/categories` |
| — | Team settings | S003 | `/settings/team` |
| — | Integrations | S007 | `/settings/integrations` |
| — | Client profitability | S013 | `/clients/[id]/profitability` |
| — | Approvals queue | S014 | `/approvals` |
| — | API keys | S015 | `/settings/api` |

---

## AI engine coverage

| ENG-ID | Slice | Status |
|--------|-------|--------|
| ENG-TRIP | S006 | Planned |
| ENG-REM | S008 | Planned |
| ENG-RPT | S006 (partial) / S013 | Planned |
| ENG-MEM | S006 | Planned |
| ENG-OCR | S011 (eval) | Extend V1 |
| ENG-CAT | S002 | Extend V1 |
| ENG-DUP | — | V1 complete |

---

## Prompts

[slices/v2/](slices/v2/)

**Next implementation:** MEC-V2-S001 after GO-NO-GO section A ☑.
