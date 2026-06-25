import type { NextConfig } from 'next';
import { HSTS_HEADER, SECURITY_HEADERS } from './src/lib/security/headers';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ['@mileage-copilot/shared'],
  serverExternalPackages: ['@prisma/client', 'prisma'],
  env: {
    NEXT_PUBLIC_SENTRY_RELEASE:
      process.env.COMMIT_REF?.slice(0, 12) ??
      process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) ??
      process.env.npm_package_version,
  },
  async headers() {
    const values = { ...SECURITY_HEADERS };

    if (process.env.NODE_ENV === 'production') {
      values['Strict-Transport-Security'] = HSTS_HEADER;
    }

    return [
      {
        source: '/(.*)',
        headers: Object.entries(values).map(([key, value]) => ({ key, value })),
      },
    ];
  },
};

export default nextConfig;
