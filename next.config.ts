import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  output: process.env.NEXT_OUTPUT as NextConfig['output'],

  experimental: {
    ...(process.env.NODE_ENV === 'development' && {
      allowDevelopmentBuild: true,
    }),
  },
};

export default nextConfig;
