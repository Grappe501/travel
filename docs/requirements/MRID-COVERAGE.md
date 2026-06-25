# MRID Coverage Report

**MRMS Part XXI** · Run weekly before release gates.

*Report date: 2026-06-24 · Scope: Bootstrap MRIDs 000001–000020*

---

## Gap Scan

| Question | Gaps found | Action |
|----------|------------|--------|
| Requirements without tests? | 20 (tests not yet written) | Assign during BUILD slices |
| Requirements without documentation? | 0 | Bootstrap linked to Vol 3 FRs |
| Requirements without analytics? | 2 (000002, 000003) | Add EVT when features ship |
| Requirements without APIs? | 2 (000015 partial, 000016–000017) | Complete in WAVE-003–004 |
| Requirements without screens? | 3 (000015, 000016, 000018–000019 partial) | Acceptable for backend-only |
| Orphan SCRs (no MRID)? | 57 of 60 | Decompose FR → MRIDs in batches |
| Orphan APIs (no MRID)? | ~70 | Map during implementation |

---

## Bootstrap MRID Health

| MRID | Tests | Docs | Analytics | API | Screen | Health |
|------|-------|------|-----------|-----|--------|--------|
| 000001 | planned | ☑ | ☑ | ☑ | ☑ | Ready |
| 000004 | planned | ☑ | ☑ | ☑ | ☑ | Ready |
| 000007 | planned | ☑ | ☑ | ☑ | ☑ | Ready |
| 000015 | planned | ☑ | — | partial | — | Ready |
| 000020 | planned | ☑ | — | ☑ | ☑ | Ready |

---

## Pre-Release Checklist (V1)

- [ ] All V1-critical MRIDs status ≥ Accepted
- [ ] Zero Critical-priority gaps in gap scan
- [ ] E2E covers all Critical MRIDs
- [ ] SEC tests for AUTH, BILL, ADM MRIDs
- [ ] Release notes list new/changed/retired MRIDs

---

## Next Coverage Actions

1. **Batch 1:** Decompose FR-300–399 (Trips) → TRIP domain MRIDs 000336+
2. **Batch 2:** Decompose FR-400–599 (Receipts/OCR) → REC + OCR domains
3. **Batch 3:** Volume 8 security controls → SEC domain
4. Link every SCR-INDEX row to ≥1 MRID
