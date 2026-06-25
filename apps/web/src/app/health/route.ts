import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const isProduction = process.env.NODE_ENV === 'production';

  return NextResponse.json({
    status: 'ok',
    service: 'mileage-expense-copilot',
    slice: 'MEC-V1-S017',
    step: 'STEP-049',
    build: process.env.NETLIFY ? 'netlify' : 'local',
    ...(isProduction
      ? {}
      : {
          databaseConfigured: Boolean(process.env.DATABASE_URL),
          supabaseConfigured: Boolean(
            process.env.NEXT_PUBLIC_SUPABASE_URL &&
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
              !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
          ),
          storageConfigured: Boolean(
            process.env.SUPABASE_SERVICE_ROLE_KEY &&
              process.env.NEXT_PUBLIC_SUPABASE_URL &&
              !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
          ),
          openAiConfigured: Boolean(
            process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('...')
          ),
          stripeConfigured: Boolean(
            process.env.STRIPE_SECRET_KEY &&
              process.env.STRIPE_PRICE_PRO_MONTHLY &&
              process.env.STRIPE_PRICE_SMALL_BUSINESS_MONTHLY &&
              !process.env.STRIPE_SECRET_KEY.includes('...')
          ),
        }),
  });
}
