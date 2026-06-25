import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/trips/:path*',
    '/receipts/:path*',
    '/expenses/:path*',
    '/reports/:path*',
    '/vehicles/:path*',
    '/businesses/:path*',
    '/billing/:path*',
    '/settings/:path*',
    '/admin/:path*',
    '/onboarding/:path*',
    '/clients/:path*',
    '/ai/:path*',
    '/search',
    '/search/:path*',
    '/notifications',
    '/notifications/:path*',
    '/dashboard',
    '/login',
    '/signup',
    '/auth/:path*',
  ],
};
