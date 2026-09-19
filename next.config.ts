import bundleAnalyzer from '@next/bundle-analyzer';
import createMDX from '@next/mdx';

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,

  output: process.env.NEXT_OUTPUT as NextConfig['output'],

  outputFileTracingIncludes: {
    '*': ['./node_modules/.pnpm/@swc+helpers@*/node_modules/@swc/helpers/esm/**'],
  },

  devIndicators: false,
  poweredByHeader: false,

  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/mtc',
        statusCode: 301,
      },
      {
        source: '/:place/loadouts',
        destination: '/:place',
        permanent: false,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: '/.well-known/traffic-advice',
        destination: '/api/traffic-advice',
      },
    ];
  },

  assetPrefix: process.env.ASSET_PREFIX,

  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    loader: process.env.NEXT_PUBLIC_IMAGE_LOADER ? 'custom' : 'default',
    loaderFile: process.env.NEXT_PUBLIC_IMAGE_LOADER
      ? './src/images.js'
      : undefined,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.astrid.ovh',
      },
    ],
  },
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-frontmatter', 'remark-gfm'],
  },
});

export default withBundleAnalyzer(withMDX(nextConfig));
