import { NextResponse } from 'next/server';
import { isNotificationsSchemaReady, isV12SchemaReady } from '@/lib/db/schema-health';
import { getBuildMetadata, getDependencyFlags } from '@/lib/monitoring/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  const dependencies = getDependencyFlags();
  const build = getBuildMetadata();
  let migrationsApplied = false;
  let notificationsReady = false;

  if (dependencies.databaseConfigured) {
    try {
      migrationsApplied = await isV12SchemaReady();
      notificationsReady = await isNotificationsSchemaReady();
    } catch {
      migrationsApplied = false;
      notificationsReady = false;
    }
  }

  const allCoreReady =
    dependencies.databaseConfigured &&
    dependencies.supabaseConfigured &&
    dependencies.storageConfigured &&
    migrationsApplied;

  return NextResponse.json({
    status: allCoreReady ? 'ok' : 'degraded',
    service: 'mileage-expense-copilot',
    version: '1.7.0',
    slice: 'MEC-V1-S030',
    step: 'STEP-062',
    migrationsApplied,
    notificationsReady,
    ...build,
    dependencies,
  });
}
