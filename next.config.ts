// next.config.ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms.convergens.org',
        // pathname: '**',
      },
    ],
  },
};

export default createNextIntlPlugin()(nextConfig);
