import { Box, Text } from '@chakra-ui/react';
import React from 'react';

import { LoreTeamRow, TeamCard } from '@/components/features/teams/card';
import ArticlePage from '@/components/layout/articlePage';
import Layout from '@/components/layout/layout';
import {
  NARROW_MEDIA,
  SUB900_MEDIA,
} from '@/components/layout/shell/constants';
import ArticleTitle from '@/components/wiki/articleTitle';
import TitledCard from '@/components/wiki/titledCard';
import { usePlace } from '@/hooks/usePlace';
import { trpc } from '@/utils/trpc';

const CARD_GRID_CSS = {
  display: 'grid',
  gap: '12px',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  marginBlockStart: '24px',
  [SUB900_MEDIA]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
  [NARROW_MEDIA]: { gridTemplateColumns: 'minmax(0, 1fr)' },
} as const;

const ROW_GRID_CSS = {
  display: 'grid',
  gap: '4px',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  [SUB900_MEDIA]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
  [NARROW_MEDIA]: { gridTemplateColumns: 'minmax(0, 1fr)' },
} as const;

export default function PlaceTeams() {
  const place = usePlace()!;
  const [teams] = trpc.teams.list.useSuspenseQuery({ placeId: place.placeId });

  const playable = teams.filter((team) => !team.lore);
  const lore = teams.filter((team) => team.lore);

  return (
    <Layout noPadding>
      <ArticlePage placeName={place.placeName} titleId="teams-page-title">
        <ArticleTitle id="teams-page-title" title="Teams" />

        <Box css={CARD_GRID_CSS}>
          {playable.map((team) => (
            <TeamCard
              key={team.slug}
              href={`/${place.initials}/teams/${team.slug}`}
              loadouts={team.loadouts}
              name={team.name}
            />
          ))}
        </Box>

        {lore.length > 0 && (
          <TitledCard as="section" title="Lore teams">
            <Text
              color="fg.muted"
              css={{
                fontSize: '0.875rem',
                lineHeight: '1.375rem',
                marginBlockEnd: '12px',
              }}
            >
              Teams referenced by vehicles but not playable in any loadout.
            </Text>

            <Box css={ROW_GRID_CSS}>
              {lore.map((team) => (
                <LoreTeamRow
                  key={team.slug}
                  href={`/${place.initials}/teams/${team.slug}`}
                  name={team.name}
                />
              ))}
            </Box>
          </TitledCard>
        )}
      </ArticlePage>
    </Layout>
  );
}
