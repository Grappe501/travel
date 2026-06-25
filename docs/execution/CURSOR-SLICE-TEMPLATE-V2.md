# Cursor Slice Prompt Template — V2

Copy and fill for each MEC-V2-S0NN session.

---

```txt
Active project: Mileage & Expense Copilot

Build Slice: MEC-V2-S0NN — <NAME>

Mission:
<one sentence>

Context:
- Execution Packet: docs/execution/VERSION_2_EXECUTION_PACKET.md
- V2 Slice Index: docs/execution/V2-SLICE-INDEX.md
- Scope Lock: docs/decisions/DEC-004-v2-scope-lock.md
- Go/No-Go: docs/execution/GO-NO-GO-V2-CHECKLIST.md
- MRIDs: <list or TBD>
- DRS: <domain IDs>
- Prior slice complete: MEC-V2-S0NN-1
- Decisions: DEC-001, DEC-004

Allowed files:
<paths from slice prompt>

Forbidden:
- Do not commit secrets or .env files
- Do not bypass auth on protected routes
- Do not expose receipt images publicly
- Do not silently alter financial records (N6)
- Do not add out-of-scope V2 features (DEC-004)
- Do not skip bridge slices S001–S005 if building V2-alpha features
- Do not skip validation commands

Deliverables:
1. <from slice spec>
2. Update V2-SLICE-INDEX kanban status
3. STEP-0NN build-step doc + BUILD-LOG entry
4. APP_RELEASE bump if release slice
5. CHANGELOG entry if user-facing release

Validation:
pnpm lint
pnpm typecheck
pnpm test
pnpm build
# + prisma migrate / ai:eval / integration if applicable

Exit criteria:
- [ ] <from slice prompt>

Commit message:
Release VX.Y.Z: <short description> (MEC-V2-S0NN)

Step: STEP-0NN
ROAD-IDs: ROAD-VER-2.0, <category>
MEC-V2-S0NN
```

---

See filled prompts in [slices/v2/](slices/v2/).
