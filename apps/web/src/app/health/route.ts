import { NextResponse } from 'next/server';
import { getBuildMetadata, getDependencyFlags } from '@/lib/monitoring/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  const dependencies = getDependencyFlags();
  const build = getBuildMetadata();
  const allCoreReady =
    dependencies.databaseConfigured &&
    dependencies.supabaseConfigured &&
    dependencies.storageConfigured;

  return NextResponse.json({
    status: allCoreReady ? 'ok' : 'degraded',
    service: 'mileage-expense-copilot',
    version: '1.2.0',
    slice: 'MEC-V1-S025',
    step: 'STEP-057',
    ...build,
    dependencies,
  });
}
