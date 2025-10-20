// next.config.ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['convergensapi.zac.coffee'],
  },
};

export default createNextIntlPlugin()(nextConfig);
