# Prisma / Neon

Schema: `schema.prisma`  
Migration: `migrations/20260624180000_init/`

## Local setup

1. Create a Neon project and copy the connection string.
2. Add to `.env.local` at repo root (or `prisma/.env`):

```bash
DATABASE_URL="postgresql://..."
# Optional for Neon pooled connections:
# DIRECT_URL="postgresql://..."
```

3. Apply migration:

```bash
pnpm db:migrate:deploy
# or for dev:
pnpm db:migrate
```

4. Regenerate client after schema changes:

```bash
pnpm db:generate
```

## CI / build without database

Validation and generate use a placeholder `DATABASE_URL` — no live DB required for `pnpm build`.
