import type { NextConfig } from 'next';
import { HSTS_HEADER, SECURITY_HEADERS } from './src/lib/security/headers';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@mileage-copilot/shared'],
  serverExternalPackages: ['@prisma/client', 'prisma'],
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
