import { env } from '@/env';
import { getBaseUrl } from '@/utils/trpc';

import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

export function getServerSideProps({
  res,
}: GetServerSidePropsContext): GetServerSidePropsResult<{}> {
  const baseUrl = getBaseUrl();

  res.setHeader('content-type', 'text/plain; charset=utf-8');
  res.setHeader(
    'cache-control',
    'public, max-age=604800, stale-while-revalidate=86400',
  );

  const content = env.DISALLOW_INDEXING
    ? `User-agent: *\nDisallow: /\n`
    : `User-agent: *\n` +
      `Allow: /\n` +
      `Disallow: /md/\n` +
      `\n` +
      `Sitemap: ${new URL('/sitemap.xml', baseUrl).toString()}`;

  res.write(content);

  res.end();

  return { props: {} };
}

export default function Sitemap() {
  return null;
}
