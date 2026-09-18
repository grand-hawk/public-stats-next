import { Box } from '@chakra-ui/react';
import React from 'react';
import slugify from 'slug';

import RelatedPages from '@/components/common/relatedPages';
import LoadoutHeader from '@/components/features/loadouts/header';
import LoadoutTeams from '@/components/features/loadouts/teams';
import ArticleNotFound from '@/components/layout/articleNotFound';
import ArticlePage from '@/components/layout/articlePage';
import Layout from '@/components/layout/layout';
import PageMeta from '@/components/layout/pageMeta';
import ArticleProse from '@/components/wiki/articleProse';
import { useCanonicalSlug } from '@/hooks/useCanonicalSlug';
import { usePlace } from '@/hooks/usePlace';
import { useRouterQuery } from '@/hooks/useRouterQuery';
import { useSwapSlug } from '@/hooks/useSwapSlug';
import { loadoutDisplayName } from '@/utils/loadoutDisplayName';
import { trpc } from '@/utils/trpc';
import { applyWikilinks } from '@/utils/wikilinks';

export default function PlaceLoadout() {
  const loadoutQuery = useRouterQuery('loadout')!;
  const loadoutSlug = slugify(loadoutQuery);
  const place = usePlace()!;

  const utils = trpc.useUtils();
  const { isStale, shownSlug } = useSwapSlug(loadoutSlug, (nextSlug) =>
    utils.loadouts.bySlug.prefetch({ placeId: place.placeId, slug: nextSlug }),
  );

  const [loadout] = trpc.loadouts.bySlug.useSuspenseQuery({
    placeId: place.placeId,
    slug: shownSlug,
  });

  useCanonicalSlug('loadout', loadoutSlug, !!loadout);

  const linkedDescription = loadout?.description
    ? applyWikilinks(loadout.description, place.initials)
    : undefined;

  const displayName = loadout ? loadoutDisplayName(loadout.name) : null;
  const title = displayName ?? 'Loadout not found';
  const description = displayName
    ? `${displayName} loadout statistics and team compositions for ${place.placeName}`
    : undefined;

  return (
    <PageMeta title={title} description={description}>
      <Layout noPadding>
        {loadout && displayName ? (
          <ArticlePage
            markdownTarget
            placeName={place.placeName}
            stickyTitle={displayName}
            swapId={shownSlug}
            swapStale={isStale}
            titleId="loadout-page-title"
          >
            <LoadoutHeader name={loadout.name} tagline={loadout.tagline} />

            {linkedDescription && (
              <Box marginBlockStart="24px">
                <ArticleProse>{linkedDescription}</ArticleProse>
              </Box>
            )}

            <LoadoutTeams initials={place.initials} loadout={loadout} />

            <RelatedPages items={loadout.relatedPages} />
          </ArticlePage>
        ) : (
          <ArticleNotFound title="Loadout not found" />
        )}
      </Layout>
    </PageMeta>
  );
}
