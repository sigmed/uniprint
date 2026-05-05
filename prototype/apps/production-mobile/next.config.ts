import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@uniprint/ui', '@uniprint/types', '@uniprint/tokens', '@uniprint/mocks'],
  typedRoutes: true,
};

export default config;
