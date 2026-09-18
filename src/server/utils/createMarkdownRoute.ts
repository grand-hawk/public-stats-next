import ky from 'ky';

import { createCache } from '@/server/utils/createCache';
import { processHtmlToMarkdown } from '@/server/utils/processHtmlTomarkdown';
import { getExtension } from '@/utils/extensions';
import { getNameFromInitials } from '@/utils/placeUtils';
import { getBaseUrl, getInternalUrl } from '@/utils/trpc';
import { getConfig } from '@generated/config';

import type { PlaceName } from '@generated/config';
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

type Response = GetServerSidePropsContext['res'];

function sendMarkdown(res: Response, markdown: string, canonicalUrl: string) {
  res.setHeader('Link', `<${canonicalUrl}>; rel="canonical"`);
  res.setHeader('X-Robots-Tag', 'noindex');
  res.setHeader('content-type', 'text/markdown; charset=utf-8');
  res.setHeader(
    'cache-control',
    'public, max-age=3600, stale-while-revalidate=86400',
  );

  res.write(markdown);

  res.end();
}

export function createMarkdownRoute() {
  async function revalidate(htmlUrl: string) {
    const htmlResponse = await ky.get(htmlUrl, { throwHttpErrors: false });
    if (!htmlResponse.ok) return null;

    const html = await htmlResponse.text();

    return processHtmlToMarkdown(html);
  }

  const cache = createCache<string, string | null>(revalidate);

  return async function getServerSideProps({
    res,
    resolvedUrl,
  }: GetServerSidePropsContext): Promise<GetServerSidePropsResult<{}>> {
    const [path] = resolvedUrl.split('?');

    if (getExtension(path) !== '.md') return { notFound: true };

    const htmlPath = path.replace(/^\/md\//, '').replace(/\.md$/, '');
    const htmlUrlString = new URL(htmlPath, getInternalUrl()).toString();

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

    sendMarkdown(res, markdown, new URL(htmlPath, getBaseUrl()).toString());

    return { props: {} };
  };
}

export function createPlaceMarkdownRoute(
  section: string | null,
  render: (placeName: PlaceName) => Promise<string | null>,
) {
  const cache = createCache<PlaceName, string | null>(render);

  return async function getServerSideProps({
    params,
    res,
  }: GetServerSidePropsContext): Promise<GetServerSidePropsResult<{}>> {
    const { place: initials } = params || {};
    if (!initials || typeof initials !== 'string') return { notFound: true };

    const { data: config } = getConfig();
    const placeName = getNameFromInitials(config, initials);
    if (!placeName) return { notFound: true };

    let markdown = await cache.get(placeName);
    if (!markdown) {
      markdown = await render(placeName);
      cache.set(placeName, markdown);
    }

    if (markdown === null) return { notFound: true };

    sendMarkdown(
      res,
      markdown,
      new URL(
        section ? `${initials}/${section}` : initials,
        getBaseUrl(),
      ).toString(),
    );

    return { props: {} };
  };
}
