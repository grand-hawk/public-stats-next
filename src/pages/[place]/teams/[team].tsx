import { Box } from '@chakra-ui/react';
import React from 'react';
import slugify from 'slug';

import RelatedPages from '@/components/common/relatedPages';
import TeamHeader from '@/components/features/teams/header';
import TeamLoadouts from '@/components/features/teams/loadouts';
import TeamLoreVehicles from '@/components/features/teams/loreVehicles';
import TeamWeapons from '@/components/features/teams/weapons';
import ArticleNotFound from '@/components/layout/articleNotFound';
import ArticlePage from '@/components/layout/articlePage';
import Layout from '@/components/layout/layout';
import PageMeta from '@/components/layout/pageMeta';
import ArticleProse from '@/components/wiki/articleProse';
import { useCanonicalSlug } from '@/hooks/useCanonicalSlug';
import { usePlace } from '@/hooks/usePlace';
import { useRouterQuery } from '@/hooks/useRouterQuery';
import { useSwapSlug } from '@/hooks/useSwapSlug';
import { trpc } from '@/utils/trpc';
import { applyWikilinks } from '@/utils/wikilinks';

export default function PlaceTeam() {
  const teamQuery = useRouterQuery('team')!;
  const teamSlug = slugify(teamQuery);
  const place = usePlace()!;

  const utils = trpc.useUtils();
  const { isStale, shownSlug } = useSwapSlug(teamSlug, (nextSlug) =>
    utils.teams.bySlug.prefetch({ placeId: place.placeId, slug: nextSlug }),
  );

  const [team] = trpc.teams.bySlug.useSuspenseQuery({
    placeId: place.placeId,
    slug: shownSlug,
  });

  useCanonicalSlug('team', teamSlug, !!team);

  const title = team ? team.name : 'Team not found';
  const description = team
    ? `${team.name} team statistics and vehicle compositions for ${place.placeName}`
    : undefined;

  const linkedDescription = team?.description
    ? applyWikilinks(team.description, place.initials)
    : undefined;

  return (
    <PageMeta title={title} description={description}>
      <Layout noPadding>
        {team ? (
          <ArticlePage
            bandColor={team.color}
            markdownTarget
            placeName={place.placeName}
            stickyTitle={team.name}
            swapId={shownSlug}
            swapStale={isStale}
            titleId="team-page-title"
          >
            <TeamHeader lore={team.lore} name={team.name} />

            {linkedDescription && (
              <Box marginBlockStart="24px">
                <ArticleProse>{linkedDescription}</ArticleProse>
              </Box>
            )}

            {!team.lore && (
              <TeamLoadouts initials={place.initials} team={team} />
            )}

            {!team.lore && (
              <TeamWeapons initials={place.initials} team={team} />
            )}

            <TeamLoreVehicles
              initials={place.initials}
              vehicles={team.loreVehicles}
            />

            <RelatedPages items={team.relatedPages} />
          </ArticlePage>
        ) : (
          <ArticleNotFound title="Team not found" />
        )}
      </Layout>
    </PageMeta>
  );
}
