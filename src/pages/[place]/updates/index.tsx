import React from 'react';

import Updates from '@/components/features/updates';
import ArticlePage from '@/components/layout/articlePage';
import Layout from '@/components/layout/layout';
import PageMeta from '@/components/layout/pageMeta';
import { usePlace } from '@/hooks/usePlace';
import { trpc } from '@/utils/trpc';

export default function PlaceUpdates() {
  const place = usePlace()!;

  const [updates] = trpc.updates.list.useSuspenseQuery({
    placeId: place.placeId,
  });

  return (
    <PageMeta
      title="Updates"
      description={`Release notes and patch notes for ${place.placeName}.`}
    >
      <Layout noPadding>
        <ArticlePage
          markdownTarget
          placeName={place.placeName}
          stickyTitle="Updates"
          titleId="updates-page-title"
        >
          <Updates initials={place.initials} updates={updates} />
        </ArticlePage>
      </Layout>
    </PageMeta>
  );
}
