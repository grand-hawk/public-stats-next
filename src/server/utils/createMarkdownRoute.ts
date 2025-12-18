import ky from 'ky';
import Cache from 'stale-lru-cache';

import { env } from '@/env';
import { processHtmlToMarkdown } from '@/server/utils/processHtmlTomarkdown';
import { getExtension } from '@/utils/extensions';
import { getBaseUrl } from '@/utils/trpc';

import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

export function createMarkdownRoute() {
  async function revalidate(htmlUrl: string) {
    const htmlResponse = await ky.get(htmlUrl, { throwHttpErrors: false });
    if (!htmlResponse.ok) return null;

    const html = await htmlResponse.text();

    return processHtmlToMarkdown(html);
  }

  const cache = new Cache({
    maxAge: env.NODE_ENV === 'development' ? 0 : 3600,
    staleWhileRevalidate: env.NODE_ENV === 'development' ? 0 : 86400,
    revalidate,
  });

  async function getServerSideProps({
    res,
    resolvedUrl,
  }: GetServerSidePropsContext): Promise<GetServerSidePropsResult<{}>> {
    if (getExtension(resolvedUrl) !== '.md') return { notFound: true };

    const htmlUrl = new URL(
      resolvedUrl.replace(/^\/md\//, '').replace(/\.md$/, ''),
      getBaseUrl(),
    );
    htmlUrl.hash = '';
    htmlUrl.search = '';

    const htmlUrlString = htmlUrl.toString();

    const headSuccess = await ky
      .head(htmlUrlString)
      .then((response) => response.ok)
      .catch(() => false);
    if (!headSuccess) return { notFound: true };

    let markdown = await cache.get(htmlUrlString);
    if (!markdown) {
      markdown = await revalidate(htmlUrlString);
      cache.set(htmlUrlString, markdown);
    }

    if (markdown === null) return { notFound: true };

    res.setHeader('content-type', 'text/markdown; charset=utf-8');
    res.setHeader(
      'cache-control',
      'public, max-age=3600, stale-while-revalidate=86400',
    );

    res.write(markdown);

    res.end();

    return { props: {} };
  }

  return getServerSideProps;
}
