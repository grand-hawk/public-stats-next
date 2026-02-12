import ky from 'ky';
import Cache from 'stale-lru-cache';

import { env } from '@/env';
import { processHtmlToMarkdown } from '@/server/utils/processHtmlTomarkdown';
import { getExtension } from '@/utils/extensions';
import { getBaseUrl } from '@/utils/trpc';

export function createMarkdownRouteHandler() {
  async function revalidate(htmlUrl: string) {
    const htmlResponse = await ky.get(htmlUrl, { throwHttpErrors: false });
    if (!htmlResponse.ok) return null;

    const html = await htmlResponse.text();

    return processHtmlToMarkdown(html);
  }

  const cache = new Cache<string, string | null>({
    maxAge: env.NODE_ENV === 'development' ? 0 : 3600,
    staleWhileRevalidate: env.NODE_ENV === 'development' ? 0 : 86400,
    revalidate,
  });

  return async function handler(
    _request: Request,
    resolvedUrl: string,
  ): Promise<Response> {
    const [urlPath] = resolvedUrl.split('?');

    if (getExtension(urlPath) !== '.md')
      return new Response(null, { status: 404 });

    const htmlUrl = new URL(
      urlPath.replace(/^\/md\//, '').replace(/\.md$/, ''),
      getBaseUrl(),
    );
    htmlUrl.hash = '';
    htmlUrl.search = '';

    const htmlUrlString = htmlUrl.toString();

    const headSuccess = await ky
      .head(htmlUrlString)
      .then((response) => response.ok)
      .catch(() => false);
    if (!headSuccess) return new Response(null, { status: 404 });

    let markdown: string | null | undefined = await cache.get(htmlUrlString);
    if (!markdown) {
      markdown = await revalidate(htmlUrlString);
      cache.set(htmlUrlString, markdown);
    }

    if (!markdown) return new Response(null, { status: 404 });

    return new Response(markdown, {
      headers: {
        Link: `<${htmlUrlString}>; rel="canonical"`,
        'X-Robots-Tag': 'noindex',
        'content-type': 'text/markdown; charset=utf-8',
        'cache-control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  };
}
