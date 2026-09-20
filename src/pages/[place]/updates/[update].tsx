import Head from 'next/head';
import React from 'react';

import UpdateEntry from '@/components/features/updates/entry';
import ArticleNotFound from '@/components/layout/articleNotFound';
import ArticlePage from '@/components/layout/articlePage';
import Layout from '@/components/layout/layout';
import PageMeta from '@/components/layout/pageMeta';
import { usePlace } from '@/hooks/usePlace';
import { useRouterQuery } from '@/hooks/useRouterQuery';
import { trpc } from '@/utils/trpc';
import { updatePageTitle } from '@/utils/updateDate';

export default function PlaceUpdate() {
  const place = usePlace()!;
  const slug = useRouterQuery('update')!;
  const preview = useRouterQuery('preview') ?? undefined;

  const [view] = trpc.updates.bySlug.useSuspenseQuery({
    placeId: place.placeId,
    preview,
    slug,
  });

  if (!view) {
    return (
      <PageMeta title="Update not found">
        <Head>
          <meta content="noindex" name="robots" />
        </Head>
        <Layout noPadding>
          <ArticleNotFound title="Update not found" />
        </Layout>
      </PageMeta>
    );
  }

  const { next, previous, update, vehicles } = view;

  return (
    <PageMeta
      description={update.summary}
      title={updatePageTitle(update.title)}
    >
      {update.draft ? (
        <Head>
          <meta content="noindex" name="robots" />
        </Head>
      ) : null}

      <Layout noPadding>
        <ArticlePage
          markdownTarget
          placeName={place.placeName}
          stickyTitle={updatePageTitle(update.title)}
          titleId="update-page-title"
        >
          <UpdateEntry
            initials={place.initials}
            next={next}
            previous={previous}
            update={update}
            vehicles={vehicles}
          />
        </ArticlePage>
      </Layout>
    </PageMeta>
  );
}
