# Database Migrations Runbook

**OPS-RB-011** · STEP-065 · Supabase Postgres + Prisma

## When to run

- After merging any PR that adds files under `prisma/migrations/`
- **Before** or **immediately after** Netlify deploy (Netlify build does **not** run migrations)

## Prerequisites

| Item | Notes |
|------|--------|
| `DIRECT_URL` | Session pooler **port 5432** — required for `prisma migrate deploy` |
| `DATABASE_URL` | Transaction pooler **port 6543** — runtime only |
| Network | Run from your machine or CI with DB access (not Netlify build) |

## Local (recommended)

From repo root with `.env.local` configured:

```bash
pnpm db:env:sync
pnpm db:migrate:deploy
pnpm db:verify-schema
```

`db:env:sync` writes `.env` with pooler URLs derived from `.env.local`.

## Production (Supabase)

1. Copy `DIRECT_URL` from Netlify env (session pooler, port 5432)
2. Export for one command:

```bash
# PowerShell
$env:DIRECT_URL="postgresql://postgres.PROJECT:PASSWORD@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
$env:DATABASE_URL=$env:DIRECT_URL
pnpm db:migrate:deploy
pnpm db:verify-schema
```

3. Verify live app:

```bash
curl https://travel-mileage.netlify.app/health
# readiness.gates → migrations + notifications-schema should be ok
```

## Troubleshooting

| Error | Fix |
|-------|-----|
| `P1001` Can't reach database | Use **pooler** host, not `db.xxx.supabase.co` (IPv6) |
| `P1017` Server closed connection | Use `DIRECT_URL` on port **5432**, not 6543 |
| Schema verify fails | Re-run migrate; check `_prisma_migrations` table in Supabase SQL editor |

## Rollback

Prisma migrations are forward-only. For bad deploys, restore DB from Supabase backup — see [database-restore.md](./database-restore.md).
