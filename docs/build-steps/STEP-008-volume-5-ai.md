# STEP-008 — Volume 5 AI & Intelligence Architecture Rewrite

| Field | Value |
|-------|-------|
| **Step ID** | STEP-008 |
| **Phase** | Blueprint |
| **Date** | 2026-06-24 |
| **Commit** | *(pending)* |
| **Status** | complete |

## Objective

Rewrite Volume 5 as **AI & Intelligence Architecture Master Blueprint** — 25 chapters treating AI as a first-class subsystem with specialized engines, prompt library, learning, personal memory, and quality gates.

## Changes

- `docs/blueprint/05-ai-design.md` — full rewrite
- Cross-link updates in Volumes 1, 3, 4, blueprint README

## Decisions

| Decision | Rationale |
|----------|-----------|
| 6 specialized engines + orchestrator | Independently versioned/replaceable |
| Prompt library in repo YAML, not inline code | Ch. 18 reproducibility |
| `merchant_knowledge` + `user_ai_preferences` | Merchant intel + learning |
| Personal Travel Memory (Ch. 25) | Competitive moat from user history |
| V1 NL search hybrid; LLM intent V1.1 | Ship value without NL latency cost |
| Quality gates as release blockers | Ch. 24 |

## Verification

- [x] 25 chapters complete
- [x] Canonical OCR + classification prompts documented
- [x] Human-in-the-loop flow (Ch. 23)
- [x] Aligned with Volume 4 AI tables
- [x] Telemetry and versioning spec (Ch. 20–21)

## Next step

Volume 6 technical alignment or Phase B migrations including AI tables
