import { NextResponse } from 'next/server';
import { jsonData } from '@/lib/api/response';
import { requireSessionUser } from '@/lib/auth/server';
import { getOnboardingStatus } from '@/server/services/onboarding.service';

export async function GET() {
  const user = await requireSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const status = await getOnboardingStatus(user.id);
  return jsonData(status);
}
