# Build Traceability Protocol

**Repository:** [github.com/Grappe501/travel](https://github.com/Grappe501/travel)  
**Local root:** `H:\Travel-Expense`

Every change to this project is recorded so anyone can reconstruct *what* was done, *when*, *why*, and *which commit* contains it.

---

## Three Layers of Record

| Layer | File / location | Purpose |
|-------|-----------------|---------|
| **Ledger** | [`BUILD-LOG.md`](../BUILD-LOG.md) | Chronological index of every build step with commit SHA |
| **Schedule** | [`MASTER-EXECUTION-INDEX.md`](MASTER-EXECUTION-INDEX.md) | Control tower — what to build, status, BUILD slices |
| **Requirements** | [`requirements/MRMS.md`](requirements/MRMS.md) | MRMS — every MRID, lifecycle |
| **Execution** | [`execution/VERSION_1_EXECUTION_PACKAGE.md`](execution/VERSION_1_EXECUTION_PACKAGE.md) | V1 build packet — slices & prompts |
| **Detail** | [`docs/build-steps/`](build-steps/) | One markdown file per step — context, decisions, verification |
| **Releases** | [`CHANGELOG.md`](../CHANGELOG.md) | User-facing version history ( semver ) |

**Rule:** No build step is complete until all three are updated (detail doc + ledger entry + commit).

---

## Step ID Format

```
STEP-NNN
```

- `NNN` = zero-padded sequence (`001`, `002`, …)
- Never reuse or renumber a step ID
- One step = one logical unit of work (one PR or one focused commit series)

---

## Step Document Template

Each file in `docs/build-steps/` follows this structure:

```markdown
# STEP-NNN — Short title

| Field | Value |
|-------|-------|
| **Step ID** | STEP-NNN |
| **Phase** | Blueprint / A / B / … |
| **Date** | YYYY-MM-DD |
| **Commit** | `<sha>` (filled after commit) |
| **Author** | Name or agent session |
| **Status** | complete / in-progress / blocked |

## Objective
What this step accomplishes.

## Changes
- Bullet list of files or systems touched

## Decisions
Any choices made and why.

## Verification
How we confirmed it worked.

## Next step
Link to STEP-NNN+1 or "TBD"
```

---

## Commit Message Format

```
<type>(<scope>): <short summary>

Step: STEP-NNN
Phase: <blueprint|A|B|…>

<body — optional why>
```

**Types:** `docs`, `feat`, `fix`, `chore`, `ci`, `refactor`, `test`, `build`

**Examples:**

```
docs(blueprint): add master build plan volumes 0–9

Step: STEP-001
Phase: blueprint

Establishes design constitution before any application code.
```

```
feat(trips): implement start trip flow

Step: STEP-012
Phase: C

FR-004 Start Trip from Volume 3 functional requirements.
```

---

## Branch Strategy

| Branch | Use |
|--------|-----|
| `main` | Production-ready; Netlify deploys from here |
| `develop` | Optional integration branch |
| `step/NNN-short-name` | Optional per-step branches; merge via PR |

For solo development, committing directly to `main` with STEP IDs is acceptable. Prefer PRs when a step spans multiple commits.

---

## GitHub Integration

- **Issues:** Optional `STEP-NNN` in issue title for traceability
- **PRs:** Title includes step ID; body links to `docs/build-steps/STEP-NNN-*.md`
- **Tags:** Release tags `v0.1.0`, `v1.0.0` — noted in CHANGELOG and BUILD-LOG
- **Actions:** CI runs on every push (added in STEP-002)

---

## Phase Reference

| Phase | Name | Blueprint ref |
|-------|------|---------------|
| — | Blueprint | Volumes 0–9 |
| A | Repo scaffold | Volume 6, Phase A checklist |
| B | Supabase schema + auth | Volume 4 |
| C | Core trip flow | FR-004–006 |
| D | Receipt OCR | Volume 5 |
| E | Reports + exports | FR-011 |
| F | Stripe subscriptions | FR-012 |
| G | Polish + PWA | Volume 2 |
| H | Beta launch | Volume 7 launch checklist |

---

## Adding a New Step (Checklist)

1. Create `docs/build-steps/STEP-NNN-title.md` from template
2. Do the work
3. Commit with `Step: STEP-NNN` in message
4. Update commit SHA in the step doc
5. Add row to `BUILD-LOG.md`
6. Update `CHANGELOG.md` if user-visible
7. Push to GitHub

---

*Established in STEP-001.*
