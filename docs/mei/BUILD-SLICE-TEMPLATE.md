# Build Slice Template

**MEI Section 12–13** · Copy for each BUILD-ID.

---

## BUILD-NNN — [Name]

| Field | Value |
|-------|-------|
| **BUILD-ID** | BUILD-NNN |
| **WAVE-ID** | WAVE-00N |
| **MRID-IDs** | |
| **STEP-ID** | STEP-NNN |

### Mission

One sentence outcome.

### Context

Blueprint volumes · dependencies complete.

### Scope

- [ ] Item 1
- [ ] Item 2

### Allowed files



### Forbidden files

`netlify.toml` (unless slice scope) · production secrets · unrelated modules

### Deliverables

- Code · tests · INDEX updates · STEP doc

### Validation commands

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

### Success criteria

- [ ] BLD-DOD-001 (Volume 21)
- [ ] DNA-REVIEW-001 if UI (Volume 24)
- [ ] MRIDs satisfied

### Git commit

`Step: STEP-NNN` · `BUILD-IDs: BUILD-NNN` · `MRID-IDs: …`

### Progress update

- [ ] MEI Section 3 layer %
- [ ] BUILD-INDEX kanban column
- [ ] MRID-INDEX status column
