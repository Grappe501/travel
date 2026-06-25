# Domain Health Dashboard

**MRMS-2 Part VII** · Update weekly.

*Last updated: 2026-06-24 (STEP-031)*

---

## Overall

| Metric | Value |
|--------|------:|
| Domains registered | 58 |
| Domains with records | 12 |
| Average health (bootstrap) | — |
| Domains blocked | 0 |

---

## V1 Critical Domains

| Domain | Doc % | Test % | Coverage % | Security % | Perf % | Overall |
|--------|------:|-------:|-----------:|-----------:|-------:|--------:|
| **TRIP** | 100† | 0 | 0 | — | — | — |
| **REC** | 100† | 0 | 0 | — | — | — |
| **OCR** | 100† | 0 | 0 | — | — | — |
| **AUTH** | 100† | 0 | 0 | — | — | — |
| **SUB** | 100† | 0 | 0 | — | — | — |
| **RPT** | 100† | 0 | 0 | — | — | — |
| **MOB** | 100† | 0 | 0 | — | — | — |
| **AI** | 100† | 0 | 0 | — | — | — |
| **ADMIN** | 100† | 0 | 0 | — | — | — |

†Blueprint + MRID records complete; implementation tests pending.

---

## Example Target (post-V1)

```
TRIP
  Documentation   98%
  Testing         96%
  Coverage        97%
  Security        100%
  Performance     94%
  Overall         97%
```

---

## Health Dimensions

| Dimension | Source |
|-----------|--------|
| Documentation | % MRIDs with full records + blueprint links |
| Testing | % MRIDs with passing mapped tests |
| Coverage | Acceptance criteria with test coverage |
| Security | SEC-* tests + RLS audit |
| Performance | PERF-* baselines (OPS) |
| Accessibility | ACC-* for SCREEN artifacts |
| Technical debt | Open TD linked to domain |
| **Overall** | Weighted: Test 30%, Doc 20%, Security 20%, Coverage 15%, Perf 10%, ACC 5% |

---

## Actions

| Domain | Gap | Action |
|--------|-----|--------|
| All V1 | Tests 0% | Assign during BUILD slices |
| REC | SCR-031 mapping | Reconcile screen catalog |
| ORG, TEAM | No record | V1.1 registration |

Feeds [MRID-DASHBOARD](../requirements/MRID-DASHBOARD.md) and MEI §20.
