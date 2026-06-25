import { NextResponse } from 'next/server';
import { APP_RELEASE } from '@/lib/app-release';
import { isGpsTrackingSchemaReady, isNotificationsSchemaReady, isV12SchemaReady } from '@/lib/db/schema-health';
import { getBuildMetadata, getDependencyFlags } from '@/lib/monitoring/config';
import { evaluateProductionReadiness } from '@/lib/monitoring/production-readiness';

export const dynamic = 'force-dynamic';

export async function GET() {
  const dependencies = getDependencyFlags();
  const build = getBuildMetadata();
  let migrationsApplied = false;
  let notificationsReady = false;
  let gpsTrackingReady = false;

  if (dependencies.databaseConfigured) {
    try {
      migrationsApplied = await isV12SchemaReady();
      notificationsReady = await isNotificationsSchemaReady();
      gpsTrackingReady = await isGpsTrackingSchemaReady();
    } catch {
      migrationsApplied = false;
      notificationsReady = false;
      gpsTrackingReady = false;
    }
  }

  const readiness = evaluateProductionReadiness({
    dependencies,
    migrationsApplied,
    notificationsReady,
    build,
  });

  const status = readiness.coreReady ? 'ok' : 'degraded';

  return NextResponse.json({
    status,
    service: 'mileage-expense-copilot',
    version: APP_RELEASE.version,
    slice: APP_RELEASE.slice,
    step: APP_RELEASE.step,
    migrationsApplied,
    notificationsReady,
    gpsTrackingReady,
    readiness: {
      coreReady: readiness.coreReady,
      productionReady: readiness.productionReady,
      stripeMode: readiness.stripeMode,
      missingForProduction: readiness.missingForProduction,
      gates: readiness.gates,
    },
    ...build,
    dependencies,
  });
}
