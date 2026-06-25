import { NextResponse } from 'next/server';
import { resolvePostAuthPath } from '@/lib/auth/guards';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const redirectTo = searchParams.get('redirect');
    const destination = await resolvePostAuthPath(redirectTo);
    return NextResponse.redirect(new URL(destination, request.url));
  } catch (error) {
    console.error('[auth/continue] failed', error);
    return NextResponse.redirect(new URL('/login?error=continue_failed', request.url));
  }
}
