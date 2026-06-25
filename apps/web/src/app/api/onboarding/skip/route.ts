import { NextResponse } from 'next/server';
import { jsonData } from '@/lib/api/response';
import { requireSessionUser } from '@/lib/auth/server';
import { skipOnboarding } from '@/server/services/onboarding.service';

export async function POST() {
  const user = await requireSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = await skipOnboarding(user.id);
  return jsonData({ onboardingCompleted: profile.onboardingCompleted });
}
