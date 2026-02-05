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

  res.write(
    `User-agent: *\n` +
      `Allow: /\n` +
      `\n` +
      `Sitemap: ${new URL('/sitemap.xml', baseUrl).toString()}`,
  );

  res.end();

  return { props: {} };
}

export default function Sitemap() {
  return null;
}
