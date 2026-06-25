# Cursor Slice Prompt Template

Copy and fill for each MEC-V1-S0NN session.

---

```txt
Active project: Mileage & Expense Copilot

Build Slice: MEC-V1-S0NN — <NAME>

Mission:
<one sentence>

Context:
- Execution Package: docs/execution/VERSION_1_EXECUTION_PACKAGE.md
- MEI: docs/MASTER-EXECUTION-INDEX.md
- MRIDs: <list>
- DRS: <domain IDs>
- Prior slice complete: MEC-V1-S0NN-1
- Decisions: DEC-001, DEC-002, DEC-003

Allowed files:
<paths>

Forbidden:
- Do not commit secrets or .env files
- Do not bypass auth on protected routes
- Do not expose receipt images publicly
- Do not silently alter financial records
- Do not add out-of-scope V1 features (DEC-002)
- Do not skip validation commands

Deliverables:
1. <list>
2. Update SLICE-INDEX kanban status
3. STEP-0NN build-step doc + BUILD-LOG entry

Validation:
pnpm lint
pnpm typecheck
pnpm build
# + prisma / test if applicable

Exit criteria:
- [ ] <checklist>

Commit message:
MEC-V1-S0NN <short description>

Step: STEP-0NN
BUILD-IDs: BUILD-0NN
MRID-IDs: <if applicable>
DRS-IDs: <if applicable>
```

---

See filled prompts in [slices/](slices/).
