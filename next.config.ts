import bundleAnalyzer from '@next/bundle-analyzer';

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  output: process.env.NEXT_OUTPUT as NextConfig['output'],

  devIndicators: false,
  poweredByHeader: false,

  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },

  async redirects() {
    return [
      {
        source: '/vehicles/:slug',
        destination: `/mtc/vehicles/:slug`,
        permanent: true,
      },
      {
        source: '/:path((?!md/).*\\.md)',
        destination: '/md/:path',
        permanent: true,
      },
    ];
  },

  assetPrefix: process.env.ASSET_PREFIX,

  images: {
    loader: process.env.NEXT_PUBLIC_IMAGE_LOADER ? 'custom' : 'default',
    loaderFile: process.env.NEXT_PUBLIC_IMAGE_LOADER
      ? './src/images.ts'
      : undefined,
  },
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
