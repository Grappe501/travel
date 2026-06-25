# MEC-V2-S003 — Team invites & accountant role

**STEP:** STEP-076 · **Target:** 1.16.0 · **ROAD:** ROAD-CAT-COLLAB

---

## Prompt (for build agent)

```txt
Active project: Mileage & Expense Copilot

Build Slice: MEC-V2-S003 — Team invites & accountant read-only

Mission:
Wire existing BusinessMember model to invites, roles, and read-only accountant access for Small Business tier.

Context:
- prisma/schema.prisma BusinessMember, BusinessMemberRole
- DEC-004 § pricing Small Business 5 seats
- Volume 20 Ch. 12 collaboration

Allowed files:
- prisma/schema.prisma + migration
- apps/web/src/app/settings/team/**
- apps/web/src/server/services/business-member.service.ts
- apps/web/src/app/api/businesses/[id]/members/**
- apps/web/src/lib/permissions/**
- packages/shared/src/schemas/business-member.ts
- docs/build-steps/STEP-076-team-invites.md

Forbidden:
- Cross-business data leaks
- Accountant write access to trips/receipts
- Skipping auth checks on member routes

Deliverables:
1. Invite by email → pending member → accept via magic link
2. Roles: owner, employee, accountant (read + export only)
3. /settings/team management UI for business owner
4. Enforce 5-seat limit on Small Business subscription
5. Service-layer checks on all trip/receipt mutations
6. Integration test: accountant cannot PATCH trip

Validation:
pnpm lint && pnpm typecheck && pnpm test && pnpm test:integration && pnpm build

Exit criteria:
- [ ] Owner invites accountant; accountant sees trips read-only
- [ ] Accountant can export reports CSV/PDF
- [ ] Employee cannot access billing settings
- [ ] APP_RELEASE 1.16.0
```

---

## Kanban

☐ Planned
