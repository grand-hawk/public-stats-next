import { Box, Stack } from '@chakra-ui/react';
import Head from 'next/head';
import React from 'react';
import slugify from 'slug';

import { ArticleProvider } from '@/components/article/context';
import { articleMdxComponents } from '@/components/article/mdxComponents';
import { ARTICLE_MDX_CSS } from '@/components/article/prose';
import TableOfContents from '@/components/article/tableOfContents';
import RelatedPages from '@/components/common/relatedPages';
import ArticleNotFound from '@/components/layout/articleNotFound';
import ArticlePage from '@/components/layout/articlePage';
import Layout from '@/components/layout/layout';
import { linkedDataScripts } from '@/components/layout/linkedData';
import PageMeta from '@/components/layout/pageMeta';
import ArticleTitle from '@/components/wiki/articleTitle';
import Navbox from '@/components/wiki/navbox';
import { articleModules } from '@/content/articleModules';
import { useCanonicalSlug } from '@/hooks/useCanonicalSlug';
import { usePlace } from '@/hooks/usePlace';
import { useRouterQuery } from '@/hooks/useRouterQuery';
import { useScrollToHash } from '@/hooks/useScrollToHash';
import { useSwapSlug } from '@/hooks/useSwapSlug';
import { trpc } from '@/utils/trpc';

const DATE_FORMAT = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
  year: 'numeric',
});

export default function PlaceArticle() {
  const articleQuery = useRouterQuery('article')!;
  const articleSlug = slugify(articleQuery);
  const place = usePlace()!;

  const utils = trpc.useUtils();
  const { isStale, shownSlug } = useSwapSlug(articleSlug, (nextSlug) =>
    utils.articles.bySlug.prefetch({ placeId: place.placeId, slug: nextSlug }),
  );

  trpc.articles.assertExists.useQuery(
    { placeId: place.placeId, slug: articleSlug },
    { retry: false },
  );

  const [article] = trpc.articles.bySlug.useSuspenseQuery({
    placeId: place.placeId,
    slug: shownSlug,
  });

  useCanonicalSlug(
    'article',
    article?.slug ?? articleSlug,
    !!article && !isStale,
  );

  useScrollToHash(isStale ? undefined : article?.slug);

  const Content = article ? articleModules[article.slug] : undefined;
  const markers = React.useMemo(
    () =>
      (article?.outline ?? []).map(({ depth, id, text }) => ({
        name: text,
        slug: id,
        depth,
      })),
    [article?.outline],
  );

  if (!article || !Content) {
    return (
      <PageMeta title="Page not found">
        <Head>
          <meta content="noindex" name="robots" />
        </Head>
        <Layout noPadding>
          <ArticleNotFound title="Page not found" />
        </Layout>
      </PageMeta>
    );
  }

  const { meta } = article;

  return (
    <PageMeta description={meta.summary} title={meta.title}>
      <Head>{linkedDataScripts(article.linkedData)}</Head>

      <Layout noPadding>
        <ArticlePage
          markdownTarget
          placeName={place.placeName}
          stickyTitle={meta.title}
          swapId={article.slug}
          swapStale={isStale}
          titleId="article-page-title"
        >
          <ArticleTitle
            id="article-page-title"
            title={meta.title}
            meta={
              <span data-md-ignore>
                Updated {DATE_FORMAT.format(new Date(meta.updated))}
              </span>
            }
          />

          <Box
            css={{
              display: 'grid',
              gap: '32px',
              gridTemplateColumns: 'minmax(0, 1fr)',
              marginBlockStart: '24px',
              width: '100%',
              '@media (min-width: 1280px)': {
                gridTemplateColumns: 'minmax(0, 1fr) 240px',
              },
            }}
          >
            <Stack gap={0} minWidth={0}>
              <TableOfContents markers={markers} variant="inline" />

              <ArticleProvider value={{ refs: article.refs }}>
                <Box color="fg" css={ARTICLE_MDX_CSS}>
                  <Content components={articleMdxComponents} />
                </Box>
              </ArticleProvider>

              <Navbox group={meta.group} />
              <RelatedPages items={article.relatedPages} />
            </Stack>

            <TableOfContents markers={markers} variant="rail" />
          </Box>
        </ArticlePage>
      </Layout>
    </PageMeta>
  );
}
