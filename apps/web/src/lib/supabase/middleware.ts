import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isAuthFlowPath, isAuthPath, isProtectedPath } from '@/lib/auth/constants';
import { getPublicSupabaseConfig } from './config';

type CookieToSet = { name: string; value: string; options: CookieOptions };

function withSessionCookies(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie.name, cookie.value);
  });
  return target;
}

export async function updateSession(request: NextRequest) {
  const { url, anonKey } = getPublicSupabaseConfig();

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (isProtectedPath(pathname) && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('redirect', pathname);
    return withSessionCookies(supabaseResponse, NextResponse.redirect(loginUrl));
  }

  if (isAuthPath(pathname) && user) {
    const continueUrl = request.nextUrl.clone();
    continueUrl.pathname = '/auth/continue';
    const redirectParam = request.nextUrl.searchParams.get('redirect');
    if (redirectParam) {
      continueUrl.searchParams.set('redirect', redirectParam);
    } else {
      continueUrl.searchParams.delete('redirect');
    }
    return withSessionCookies(supabaseResponse, NextResponse.redirect(continueUrl));
  }

  if (
    isAuthFlowPath(pathname) &&
    !user &&
    pathname !== '/auth/forgot-password' &&
    pathname !== '/auth/callback'
  ) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    if (pathname === '/auth/reset-password') {
      loginUrl.searchParams.set('error', 'reset_session_required');
    }
    return withSessionCookies(supabaseResponse, NextResponse.redirect(loginUrl));
  }

  return supabaseResponse;
}
