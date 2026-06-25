# AI Build Handoff Template

**BLD-AI-HANDOFF-001** · Volume 21 Ch. 20

Copy this block into every AI task, STEP doc, or Cursor prompt for implementation work.

---

## Handoff

| Field | Value |
|-------|-------|
| **Objective** | _(one sentence)_ |
| **STEP-ID** | STEP-NNN |
| **WAVE-ID** | WAVE-00N |
| **Inputs** | SCR-IDs: · API-IDs: · SM-IDs: · FR-IDs: |
| **Allowed files** | _(paths)_ |
| **Restricted files** | `netlify.toml`, migrations without review, `packages/shared/src/permissions/` without spec |
| **Dependencies** | _(prior STEP or WAVE must be complete)_ |
| **Exit criteria** | _(testable checklist)_ |
| **Validation** | `pnpm lint` · `pnpm typecheck` · `pnpm test` · `pnpm build` |
| **Rollback** | `git revert` / feature flag off |
| **INDEX updates** | SCR / API / SM rows to mark ☑ |

## AI rules (summary)

- Follow Volume 6 Ch. 31 + Volume 21 Ch. 19
- No invented requirements — cite blueprint ID
- No secrets in code
- Financial data: user confirmation required
- Commit: `Step: STEP-NNN` in message

## Exit criteria checklist

- [ ] Compiles and tests pass
- [ ] SCR/API spec matched
- [ ] Mobile spot-check (Volume 18) if UI
- [ ] EVT wired if user-facing action
- [ ] STEP doc updated
- [ ] INDEX status updated
- [ ] `main` deployable
