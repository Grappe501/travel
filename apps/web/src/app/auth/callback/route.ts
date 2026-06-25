import { NextResponse } from 'next/server';
import { resolvePostAuthPath } from '@/lib/auth/guards';
import { createClient } from '@/lib/supabase/server';
import { ensureUserProfile } from '@/server/services/auth.service';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next');

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user?.email) {
          try {
            await ensureUserProfile({
              id: user.id,
              email: user.email,
              emailVerified: Boolean(user.email_confirmed_at),
            });
          } catch (profileError) {
            console.error('[auth/callback] profile sync failed', profileError);
          }
        }

        if (next && next.startsWith('/') && !next.startsWith('//')) {
          return NextResponse.redirect(new URL(next, origin));
        }

        const destination = await resolvePostAuthPath();
        return NextResponse.redirect(new URL(destination, origin));
      }
    } catch (callbackError) {
      console.error('[auth/callback] exchange failed', callbackError);
    }
  }

  return NextResponse.redirect(new URL('/login?error=auth_callback_failed', origin));
}
