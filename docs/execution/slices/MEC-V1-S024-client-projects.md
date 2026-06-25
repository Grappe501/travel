# MEC-V1-S024 — Client & Project Modules

```txt
Active project: Mileage & Expense Copilot

Build Slice: MEC-V1-S024 — Client & Project Modules

Mission:
V1.1 core objects — structured clients/projects for trip tagging and client reports (SCR-037–039).

Context:
- Prior: MEC-V1-S023 (STEP-055) category AI complete
- BUILD-ID: BUILD-016
- Screens: SCR-037, SCR-038, SCR-039
- APIs: API-CLI-001–003, API-PRJ-001–002

Allowed paths:
prisma/schema.prisma
packages/shared/src/schemas/client-project.ts
apps/web/src/server/services/client.service.ts
apps/web/src/server/services/project.service.ts
apps/web/src/app/api/clients/**
apps/web/src/app/api/projects/**
apps/web/src/app/clients/**
apps/web/src/components/clients/**
apps/web/src/server/services/trip.service.ts

Rules:
- Soft-delete clients/projects (record_status)
- Trips store client_id/project_id + denormalized name snapshots
- Projects scoped to business; optional client link
- Trip start accepts optional clientId/projectId

Deliverables:
1. Prisma Client + Project models, trip FKs, migration
2. CRUD services + API routes
3. /clients, /clients/[id], /clients/[id]/projects/[pid] pages
4. Trip start client/project pickers
5. Settings link to clients

Validation:
pnpm lint && pnpm typecheck && pnpm build && pnpm test

Exit criteria:
- [x] Client CRUD with business scope
- [x] Project CRUD under client
- [x] Trip start links client/project with name snapshots
- [x] SCR-037–039 routes shipped

Commit:
feat(core): MEC-V1-S024 client and project modules

Step: STEP-056
BUILD-IDs: BUILD-016
```
