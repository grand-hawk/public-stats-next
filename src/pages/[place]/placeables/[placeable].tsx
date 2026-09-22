import Head from 'next/head';
import React from 'react';
import slug from 'slug';

import Placeable from '@/components/features/placeables/placeable';
import ArticleNotFound from '@/components/layout/articleNotFound';
import ArticlePage from '@/components/layout/articlePage';
import { getKeywords } from '@/components/layout/head';
import Layout from '@/components/layout/layout';
import PageMeta from '@/components/layout/pageMeta';
import Navbox from '@/components/wiki/navbox';
import { useCanonicalSlug } from '@/hooks/useCanonicalSlug';
import { usePlace } from '@/hooks/usePlace';
import { useRouterQuery } from '@/hooks/useRouterQuery';
import { useSwapSlug } from '@/hooks/useSwapSlug';
import {
  placeableDisplayName,
  placeableKindLabel,
} from '@/utils/placeables';
import { trpc } from '@/utils/trpc';

export default function PlacePlaceable() {
  const placeableQuery = useRouterQuery('placeable')!;
  const placeableSlug = slug(placeableQuery);
  const place = usePlace()!;

  const utils = trpc.useUtils();
  const { isStale, shownSlug } = useSwapSlug(placeableSlug, (nextSlug) =>
    utils.placeables.bySlug.prefetch({
      placeId: place.placeId,
      slug: nextSlug,
    }),
  );

  const [placeable] = trpc.placeables.bySlug.useSuspenseQuery({
    placeId: place.placeId,
    slug: shownSlug,
  });

  useCanonicalSlug('placeable', placeableSlug, !!placeable);

  const name = placeable ? placeableDisplayName(placeable.name) : undefined;
  const title = name ?? 'Placeable not found';
  const description = placeable
    ? `${name}, a ${placeableKindLabel(placeable.kind).toLowerCase()} placeable in ${place.placeName}`
    : undefined;

  return (
    <PageMeta title={title} description={description}>
      {placeable && (
        <Head>
          <meta
            content={[name, ...getKeywords(place)].join(',')}
            name="keywords"
          />
        </Head>
      )}

      <Layout noPadding>
        {placeable ? (
          <ArticlePage
            bandColor={placeable.teamColor}
            markdownTarget
            placeName={place.placeName}
            stickyTitle={name}
            swapId={shownSlug}
            swapStale={isStale}
            titleId="placeable-page-title"
          >
            <Placeable placeable={placeable} />
            <Navbox group="weapons" />
          </ArticlePage>
        ) : (
          <ArticleNotFound title="Placeable not found" />
        )}
      </Layout>
    </PageMeta>
  );
}
