import { redirect } from 'next/navigation';
import { resolvePostAuthPath } from '@/lib/auth/guards';
import { createClient } from '@/lib/supabase/server';
import { ensureUserProfile } from '@/server/services/auth.service';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        await ensureUserProfile({
          id: user.id,
          email: user.email,
          emailVerified: Boolean(user.email_confirmed_at),
        });
      }

      if (next && next.startsWith('/') && !next.startsWith('//')) {
        return redirect(`${origin}${next}`);
      }

      const destination = await resolvePostAuthPath();
      return redirect(`${origin}${destination}`);
    }
  }

  return redirect(`${origin}/login?error=auth_callback_failed`);
}
