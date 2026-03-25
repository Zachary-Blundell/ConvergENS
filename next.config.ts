// next.config.ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '95.141.241.120',
        prot: '8055',
        // pathname: '**',
      },
    ],
  },
};

export default createNextIntlPlugin()(nextConfig);
