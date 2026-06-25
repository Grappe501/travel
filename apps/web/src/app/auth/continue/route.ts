import { NextResponse } from 'next/server';
import { resolvePostAuthPath } from '@/lib/auth/guards';
import { createClient } from '@/lib/supabase/server';
import { ensureUserProfile } from '@/server/services/auth.service';
import { markBetaTester } from '@/server/services/app-prefs.service';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const redirectTo = searchParams.get('redirect');
    const betaLabel = searchParams.get('beta_label')?.trim();

    if (betaLabel) {
      try {
        const supabase = await createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user?.email) {
          const profile = await ensureUserProfile({
            id: user.id,
            email: user.email,
            emailVerified: Boolean(user.email_confirmed_at),
          });
          await markBetaTester(profile.id, betaLabel);
        }
      } catch (error) {
        console.error('[auth/continue] beta label sync failed', error);
      }
    }

    const destination = await resolvePostAuthPath(redirectTo);
    return NextResponse.redirect(new URL(destination, request.url));
  } catch (error) {
    console.error('[auth/continue] failed', error);
    return NextResponse.redirect(new URL('/login?error=continue_failed', request.url));
  }
}
