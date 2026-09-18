import Head from 'next/head';
import React from 'react';
import slug from 'slug';

import PageActions from '@/components/common/pageActions';
import Shell from '@/components/features/shells';
import ShellsSearchSidebar from '@/components/features/shells/searchSidebar';
import ShellHeaderActions from '@/components/features/shells/shell/headerActions';
import ArticleNotFound from '@/components/layout/articleNotFound';
import ArticlePage from '@/components/layout/articlePage';
import { getKeywords } from '@/components/layout/head';
import Layout from '@/components/layout/layout';
import { linkedDataScripts } from '@/components/layout/linkedData';
import PageMeta from '@/components/layout/pageMeta';
import SearchLayout from '@/components/layout/searchLayout/layout';
import { useCanonicalSlug } from '@/hooks/useCanonicalSlug';
import { usePlace } from '@/hooks/usePlace';
import { useRouterQuery } from '@/hooks/useRouterQuery';
import { useSwapSlug } from '@/hooks/useSwapSlug';
import { trpc } from '@/utils/trpc';

export default function PlaceShell() {
  const shellQuery = useRouterQuery('shell')!;
  const shellSlug = slug(shellQuery);
  const place = usePlace()!;

  const utils = trpc.useUtils();
  const { isStale, shownSlug: deferredSlug } = useSwapSlug(
    shellSlug,
    (nextSlug) =>
      utils.shells.bySlug.prefetch({ placeId: place.placeId, slug: nextSlug }),
  );

  const [shell] = trpc.shells.bySlug.useSuspenseQuery({
    placeId: place.placeId,
    slug: deferredSlug,
  });

  useCanonicalSlug('shell', shellSlug, !!shell);

  const title = shell
    ? shell.weapon === shell.name
      ? shell.name
      : `${shell.weapon} - ${shell.name}`
    : 'Shell not found';
  const description = shell
    ? `${shell.weapon} - ${shell.name} shell statistics for ${place.placeName}`
    : undefined;

  return (
    <PageMeta title={title} description={description}>
      {shell && (
        <Head>
          <meta
            content={[shell.weapon, shell.name, ...getKeywords(place)].join(
              ',',
            )}
            name="keywords"
          />

          {linkedDataScripts(shell.linkedData)}
        </Head>
      )}

      <Layout noPadding>
        <SearchLayout sidebar={<ShellsSearchSidebar />}>
          {shell ? (
            <ArticlePage
              actions={
                <PageActions iconOnly>
                  <ShellHeaderActions shell={shell} />
                </PageActions>
              }
              markdownTarget
              placeName={place.placeName}
              stickyTitle={shell.name}
              swapId={deferredSlug}
              swapStale={isStale}
              titleId="shell-page-title"
            >
              <Shell shell={shell} />
            </ArticlePage>
          ) : (
            <ArticleNotFound title="Shell not found" />
          )}
        </SearchLayout>
      </Layout>
    </PageMeta>
  );
}
