# MEC-V2-S011 — On-device OCR + AI eval pipeline

**STEP:** STEP-084 · **Target:** 2.1.0

---

## Prompt

```txt
Build Slice: MEC-V2-S011 — On-device OCR preview + AI eval pipeline

Mission:
Preview OCR text on device before upload; golden receipt set blocks deploy on regression.

Deliverables:
1. Client preview on capture (Transformers.js or defer to native in S010)
2. apps/web/src/lib/ai/eval/golden-set/ (50 fixtures)
3. pnpm ai:eval script + CI job
4. Server OCR remains authoritative on approve
5. APP_RELEASE 2.1.0

Exit criteria:
- [ ] Preview shows within 3s on sample receipt
- [ ] ai:eval fails when fixture expectations broken
- [ ] Document eval in docs/runbooks/ai-eval.md
```

## Kanban

☐ Planned
