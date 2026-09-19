import Head from 'next/head';
import React from 'react';
import slug from 'slug';

import InfantryWeapon from '@/components/features/infantryWeapons/weapon';
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
import { trpc } from '@/utils/trpc';

export default function PlaceInfantryWeapon() {
  const weaponQuery = useRouterQuery('weapon')!;
  const weaponSlug = slug(weaponQuery);
  const place = usePlace()!;

  const utils = trpc.useUtils();
  const { isStale, shownSlug } = useSwapSlug(weaponSlug, (nextSlug) =>
    utils.infantryWeapons.bySlug.prefetch({
      placeId: place.placeId,
      slug: nextSlug,
    }),
  );

  const [weapon] = trpc.infantryWeapons.bySlug.useSuspenseQuery({
    placeId: place.placeId,
    slug: shownSlug,
  });

  useCanonicalSlug('weapon', weaponSlug, !!weapon);

  const title = weapon ? weapon.name : 'Weapon not found';
  const description = weapon
    ? `${weapon.name} infantry weapon statistics for ${place.placeName}`
    : undefined;

  return (
    <PageMeta title={title} description={description}>
      {weapon && (
        <Head>
          <meta
            content={[weapon.name, ...getKeywords(place)].join(',')}
            name="keywords"
          />
        </Head>
      )}

      <Layout noPadding>
        {weapon ? (
          <ArticlePage
            bandColor={weapon.teamColor}
            markdownTarget
            placeName={place.placeName}
            stickyTitle={weapon.name}
            swapId={shownSlug}
            swapStale={isStale}
            titleId="infantry-weapon-page-title"
          >
            <InfantryWeapon weapon={weapon} />
            <Navbox group="weapons" />
          </ArticlePage>
        ) : (
          <ArticleNotFound title="Weapon not found" />
        )}
      </Layout>
    </PageMeta>
  );
}
