import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@mileage-copilot/shared'],
  serverExternalPackages: ['@prisma/client', 'prisma'],
};

export default nextConfig;
