import { NextResponse } from 'next/server';
import { isV12SchemaReady } from '@/lib/db/schema-health';
import { getBuildMetadata, getDependencyFlags } from '@/lib/monitoring/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  const dependencies = getDependencyFlags();
  const build = getBuildMetadata();
  let migrationsApplied = false;

  if (dependencies.databaseConfigured) {
    try {
      migrationsApplied = await isV12SchemaReady();
    } catch {
      migrationsApplied = false;
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
    version: '1.2.0',
    slice: 'MEC-V1-S025',
    step: 'STEP-057',
    migrationsApplied,
    ...build,
    dependencies,
  });
}
