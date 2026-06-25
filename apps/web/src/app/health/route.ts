import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'mileage-expense-copilot',
    slice: 'MEC-V1-S006',
    step: 'STEP-038',
    build: process.env.NETLIFY ? 'netlify' : 'local',
    databaseConfigured: Boolean(process.env.DATABASE_URL),
    supabaseConfigured: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
    ),
  });
}
