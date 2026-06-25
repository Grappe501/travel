# Cursor Execution Template

**MEI Section 13** · Every AI build session uses this format.

---

## Mission

[One sentence — what ships when this session ends]

## Context

- **MEI:** [link to layer / phase]
- **BUILD-ID:** BUILD-NNN
- **MRID-IDs:** MRID-00000N
- **Blueprint:** Vol / Ch references
- **Dependencies complete:** BUILD-00N, WAVE-00N

## Allowed files

```
apps/web/src/...
packages/shared/src/...
```

## Forbidden files

- Unrelated domains · `.env` · credentials · migrations without review

## Deliverables

1. Implementation
2. Tests
3. Update SCR/API/MRID INDEX rows
4. `docs/build-steps/STEP-NNN-*.md`

## Validation commands

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

## Success criteria

- [ ] Compiles · tests pass · deployable `main`
- [ ] MRIDs traceable
- [ ] Constitution check (Vol 24 Ch. 35) if user-facing

## Git commit

```
feat(scope): description

Step: STEP-NNN
BUILD-IDs: BUILD-NNN
MRID-IDs: MRID-00000N
SCR-IDs: …
API-IDs: …
```

## Progress update

Update MEI Section 3 · BUILD-INDEX kanban · BUILD-LOG

Also see: [AI-HANDOFF-TEMPLATE.md](../construction/AI-HANDOFF-TEMPLATE.md)
