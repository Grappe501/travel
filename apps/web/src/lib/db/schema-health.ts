import { prisma } from '@/lib/db/prisma';

let schemaReadyCache: { value: boolean; checkedAt: number } | null = null;

const CACHE_MS = 60_000;

/**
 * Returns false when v1.1/v1.2 migrations (clients, trip FKs, AI log) are not applied.
 */
export async function isV12SchemaReady(): Promise<boolean> {
  if (schemaReadyCache && Date.now() - schemaReadyCache.checkedAt < CACHE_MS) {
    return schemaReadyCache.value;
  }

  try {
    await prisma.$queryRaw`SELECT client_id FROM trips LIMIT 0`;
    await prisma.$queryRaw`SELECT id FROM clients LIMIT 0`;
    await prisma.$queryRaw`SELECT id FROM ai_interaction_log LIMIT 0`;
    schemaReadyCache = { value: true, checkedAt: Date.now() };
    return true;
  } catch {
    schemaReadyCache = { value: false, checkedAt: Date.now() };
    return false;
  }
}

export function resetSchemaReadyCache(): void {
  schemaReadyCache = null;
}
