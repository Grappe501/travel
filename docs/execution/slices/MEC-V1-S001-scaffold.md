# MEC-V1-S001 — Project Scaffold

**COPY INTO CURSOR TO START BUILDING**

---

```txt
Active project: Mileage & Expense Copilot

Build Slice: MEC-V1-S001 — Project Scaffold

Mission:
Create the production-ready foundation for Mileage & Expense Copilot using Next.js 15, TypeScript, Tailwind, pnpm workspaces, and the documented repository structure.

Context:
- Execution Package: docs/execution/VERSION_1_EXECUTION_PACKAGE.md
- DEC-001 tech stack, DEC-003 repo structure
- MEI BUILD-001 / WAVE-001
- This is the FIRST CODE slice. No product features yet.

Allowed work:
- pnpm workspace root + apps/web Next.js 15 (App Router)
- TypeScript strict
- Tailwind CSS
- ESLint + Prettier
- Basic route shells (dashboard, trips, receipts, login, signup, health)
- Folder structure per DEC-003
- docs/execution, docs/decisions (already exist — verify)
- .env.example from docs/execution/env.example
- src/lib/env.ts — Zod env validation (placeholders ok)
- Root README local setup section
- netlify.toml verify/update for Next.js
- package.json scripts: lint, typecheck, build, dev
- Health route: /health or apps/web/src/app/health

Allowed paths:
apps/web/**
packages/shared/** (package.json shell only)
prisma/ (folder only — no schema yet)
tests/** (folder structure)
scripts/**
package.json
pnpm-workspace.yaml
.env.example
.github/workflows/ci.yml (basic lint + build)

Forbidden:
- Prisma schema / migrations
- Supabase auth implementation
- Stripe, OpenAI, receipt upload, trip logic
- Real secrets in any committed file
- Features beyond layout shells

Deliverables:
1. Monorepo boots: pnpm install && pnpm dev
2. apps/web builds
3. Folder tree matches DEC-003
4. .env.example at repo root
5. docs/decisions/DEC-001-tech-stack.md exists (verify)
6. STEP-033 build-step doc

Validation:
pnpm lint
pnpm typecheck
pnpm build

Exit criteria:
- [ ] App boots locally on H: drive
- [ ] Build passes in CI shape
- [ ] Folder structure exists
- [ ] .env.example placeholders only
- [ ] README explains local setup
- [ ] /health returns OK
- [ ] No secrets committed

Commit message:
feat(scaffold): MEC-V1-S001 production app foundation

Step: STEP-033
BUILD-IDs: BUILD-001
Slice: MEC-V1-S001
```

---

| Field | Value |
|-------|-------|
| BUILD | BUILD-001 |
| MRIDs | — |
| DRS | CORE-WAVE-001 |
