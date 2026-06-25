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

let notificationsSchemaCache: { value: boolean; checkedAt: number } | null = null;

/** Returns false when STEP-059 notifications migration is not applied. */
export async function isNotificationsSchemaReady(): Promise<boolean> {
  if (notificationsSchemaCache && Date.now() - notificationsSchemaCache.checkedAt < CACHE_MS) {
    return notificationsSchemaCache.value;
  }

  try {
    await prisma.$queryRaw`SELECT dedupe_key FROM notifications LIMIT 0`;
    await prisma.$queryRaw`SELECT notification_prefs FROM profiles LIMIT 0`;
    notificationsSchemaCache = { value: true, checkedAt: Date.now() };
    return true;
  } catch {
    notificationsSchemaCache = { value: false, checkedAt: Date.now() };
    return false;
  }
}

export function resetSchemaReadyCache(): void {
  schemaReadyCache = null;
  notificationsSchemaCache = null;
  gpsSchemaCache = null;
}

let gpsSchemaCache: { value: boolean; checkedAt: number } | null = null;

/** Returns false when STEP-070 GPS migration is not applied. */
export async function isGpsTrackingSchemaReady(): Promise<boolean> {
  if (gpsSchemaCache && Date.now() - gpsSchemaCache.checkedAt < CACHE_MS) {
    return gpsSchemaCache.value;
  }

  try {
    await prisma.$queryRaw`SELECT tracking_enabled FROM trips LIMIT 0`;
    await prisma.$queryRaw`SELECT id FROM trip_gps_points LIMIT 0`;
    await prisma.$queryRaw`SELECT app_prefs FROM profiles LIMIT 0`;
    gpsSchemaCache = { value: true, checkedAt: Date.now() };
    return true;
  } catch {
    gpsSchemaCache = { value: false, checkedAt: Date.now() };
    return false;
  }
}
