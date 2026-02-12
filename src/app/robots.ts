import { getBaseUrl } from '@/utils/trpc';

import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: [
      new URL('/sitemap.xml', baseUrl).toString(),
      new URL('/sitemap-md.xml', baseUrl).toString(),
    ],
  };
}
