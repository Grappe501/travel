# STEP-073 — Version 2 execution packet (ROAD-VER-2.0)

| Field | Value |
|-------|-------|
| **Step ID** | STEP-073 |
| **Phase** | Planning → Execution handoff |
| **Date** | 2026-06-25 |
| **Status** | complete (packet) |
| **ROAD-ID** | ROAD-VER-2.0 |
| **Decision** | [DEC-004](../decisions/DEC-004-v2-scope-lock.md) |

## Objective

Produce the formal **Version 2 Execution Packet** — compressed build instruction set for the V1.5 bridge through V2.3 platform releases, aligned with Volume 20 and field-test learnings from V1.13.

## Deliverables

| Artifact | Path |
|----------|------|
| **V2 Execution Packet** | [VERSION_2_EXECUTION_PACKET.md](../execution/VERSION_2_EXECUTION_PACKET.md) |
| **V2 Slice Index** | [V2-SLICE-INDEX.md](../execution/V2-SLICE-INDEX.md) |
| **Scope lock** | [DEC-004-v2-scope-lock.md](../decisions/DEC-004-v2-scope-lock.md) |
| **Go/No-Go gate** | [GO-NO-GO-V2-CHECKLIST.md](../execution/GO-NO-GO-V2-CHECKLIST.md) |
| **Slice prompts** | [slices/v2/](../execution/slices/v2/) |
| **Baseline metrics template** | [v2-baseline-metrics.md](../roadmap/v2-baseline-metrics.md) |
| **Cursor template V2** | [CURSOR-SLICE-TEMPLATE-V2.md](../execution/CURSOR-SLICE-TEMPLATE-V2.md) |

## Program summary

### Bridge (V1.14–V1.18 · ROAD-VER-1.5)

Close V1 gaps before platform shifts: help center, expense categories, team invites, analytics, feature flags, event bus + integrations scaffold.

| Slice | STEP | Version |
|-------|------|---------|
| MEC-V2-S001 | STEP-074 | 1.14.0 |
| MEC-V2-S002 | STEP-075 | 1.15.0 |
| MEC-V2-S003 | STEP-076 | 1.16.0 |
| MEC-V2-S004 | STEP-077 | 1.17.0 |
| MEC-V2-S005 | STEP-078 | 1.18.0 |

### V2 core (2.0.0 – 2.1.0)

Trip intelligence, calendar, reminders L3, auto trip detection, Capacitor + background GPS, on-device OCR eval.

| Slice | STEP | Version |
|-------|------|---------|
| MEC-V2-S006 | STEP-079 | 2.0.0-α |
| MEC-V2-S007 | STEP-080 | 2.0.0-α |
| MEC-V2-S008 | STEP-081 | 2.0.0-β |
| MEC-V2-S009 | STEP-082 | 2.0.0-β |
| MEC-V2-S010 | STEP-083 | 2.1.0 |
| MEC-V2-S011 | STEP-084 | 2.1.0 |

### V2 GA + platform (2.2.0 – 2.3.0)

Accounting export, client profitability, approvals, partner API, local-first spike.

| Slice | STEP | Version |
|-------|------|---------|
| MEC-V2-S012 | STEP-085 | 2.2.0 |
| MEC-V2-S013 | STEP-086 | 2.2.0 |
| MEC-V2-S014 | STEP-087 | 2.2.0 |
| MEC-V2-S015 | STEP-088 | 2.3.0 |
| MEC-V2-S016 | STEP-089 | 2.3.0 |

## Architecture decisions (locked in packet)

1. **Extend DEC-001 stack** — Capacitor, PostHog, integrations package; no rewrite
2. **Event-first** — `BusinessEvent` on all domain writes before engines consume
3. **AI orchestrator** — specialized engines; eval gate on OCR
4. **Opt-in automation** — trip drafts require user confirm (N6)
5. **Integration adapters** — one-way export first; sync deferred

## Gates

- **Start S001:** [GO-NO-GO-V2-CHECKLIST.md](../execution/GO-NO-GO-V2-CHECKLIST.md) section A
- **Start S006:** Section B baselines + section C bridge exit
- **Ship 2.2.0 GA:** Section E

## Verification (this STEP)

- [x] VERSION_2_EXECUTION_PACKET.md complete
- [x] 16 MEC-V2 slices defined with STEP mapping
- [x] DEC-004 scope lock documented
- [x] GO-NO-GO-V2 checklist created
- [x] Representative slice prompts (S001, S003, S006, S009, S012)
- [x] ROAD-INDEX, SLICE-INDEX, BUILD-LOG updated
- [ ] Field test baselines captured (runtime — before STEP-074)
- [ ] GO-NO-GO section A signed (runtime)

## Next step

**STEP-074 → MEC-V2-S001 → Help center (V1.14.0)**

Prompt: [MEC-V2-S001-help-center.md](../execution/slices/v2/MEC-V2-S001-help-center.md)

Do not implement until GO-NO-GO section A is ☑.

## References

- [Volume 20 — Product Evolution](../blueprint/20-product-evolution-roadmap.md)
- [V1 Execution Package](../execution/VERSION_1_EXECUTION_PACKAGE.md) (complete)
- [Field test STEP-072](STEP-072-field-test-beta.md)
