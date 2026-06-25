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
    slice: 'MEC-V1-S024',
    step: 'STEP-056',
    ...build,
    dependencies,
  });
}
