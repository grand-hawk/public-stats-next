import { Box, Flex, Stack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';
import Markdown from 'react-markdown';
import slugify from 'slug';

import ArticleToc from '@/components/common/articleToc';
import Infobox from '@/components/common/infobox';
import RelatedPages from '@/components/common/relatedPages';
import TeamHeader from '@/components/features/teams/header';
import TeamLoadouts from '@/components/features/teams/loadouts';
import TeamLoreVehicles from '@/components/features/teams/loreVehicles';
import Layout from '@/components/layout/layout';
import PageMeta from '@/components/layout/pageMeta';
import { EmptyState } from '@/components/ui/empty-state';
import { Prose } from '@/components/ui/prose';
import { usePlace } from '@/hooks/usePlace';
import { useRouterQuery } from '@/hooks/useRouterQuery';
import { articleMarkdownComponents } from '@/utils/articleMarkdown';
import { trpc } from '@/utils/trpc';
import { applyWikilinks } from '@/utils/wikilinks';

import type { InfoboxRow } from '@/components/common/infobox';
import type { Team } from '@/server/api/trpc/routers/teams';

function buildTeamInfobox(team: Team): InfoboxRow[] {
  const rows: InfoboxRow[] = [
    { label: 'Type', value: team.lore ? 'Lore' : 'Playable' },
  ];

  if (!team.lore) {
    const loadoutNames = Object.keys(team.loadouts);
    const vehicleNames = new Set<string>();
    for (const vehicles of Object.values(team.loadouts)) {
      for (const name of Object.keys(vehicles)) vehicleNames.add(name);
    }

    rows.push({ label: 'Loadouts', value: String(loadoutNames.length) });
    rows.push({ label: 'Vehicles', value: String(vehicleNames.size) });
  }

  return rows;
}

export default function PlaceTeam() {
  const router = useRouter();
  const teamQuery = useRouterQuery('team')!;
  const teamSlug = slugify(teamQuery);
  const place = usePlace()!;

  const articleRef = React.useRef<HTMLDivElement>(null);

  const [team] = trpc.teams.bySlug.useSuspenseQuery({
    placeId: place.placeId,
    slug: teamSlug,
  });

  React.useEffect(() => {
    if (!team) return;

    if (teamQuery !== teamSlug) {
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          team: teamSlug,
        },
      });
    }
  }, [router, teamQuery, team, teamSlug]);

  const title = team ? team.name : 'Team not found';
  const description = team
    ? `${team.name} team statistics and vehicle compositions for ${place.placeName}`
    : undefined;

  const infoboxRows = team ? buildTeamInfobox(team) : [];

  const linkedDescription = team?.description
    ? applyWikilinks(team.description, place.initials)
    : undefined;

  return (
    <PageMeta title={title} description={description}>
      <Layout noPadding>
        {team ? (
          <Flex
            justifyContent="center"
            marginBottom={{ base: 4, md: 0 }}
            paddingX={{ base: 4, md: 6, lg: 8 }}
            paddingY={{ base: 0, md: 2, lg: 4 }}
          >
            <Box
              display="flex"
              gap={4}
              maxWidth={{
                base: '4xl',
                '2xl':
                  'calc(var(--chakra-sizes-4xl) + var(--chakra-sizes-3xs) + var(--chakra-spacing-4))',
              }}
              width="100%"
            >
              <Stack
                aria-labelledby="team-page-title"
                as="article"
                data-md-target
                flex="1"
                gap={4}
                maxWidth="4xl"
                minWidth={0}
                ref={articleRef}
              >
                <TeamHeader name={team.name} slug={teamSlug} />

                <Box>
                  <Box
                    data-md-ignore
                    float={{ md: 'right' }}
                    marginBottom={{ base: 4, md: 3 }}
                    marginLeft={{ md: 5 }}
                    width={{ base: '100%', md: '18rem' }}
                  >
                    <Infobox rows={infoboxRows} />
                  </Box>

                  {linkedDescription && (
                    <Prose color="fg/90" maxWidth="none" size="md">
                      <Markdown components={articleMarkdownComponents}>
                        {linkedDescription}
                      </Markdown>
                    </Prose>
                  )}

                  <Box clear="both" />
                </Box>

                {!team.lore && (
                  <TeamLoadouts initials={place.initials} team={team} />
                )}

                <TeamLoreVehicles
                  initials={place.initials}
                  vehicles={team.loreVehicles}
                />

                <RelatedPages items={team.relatedPages} />
              </Stack>

              <Box
                as="aside"
                data-md-ignore
                flexShrink={0}
                hideBelow="2xl"
                maxHeight="max-content"
                position="sticky"
                top={4}
                width="var(--chakra-sizes-3xs)"
              >
                <ArticleToc articleRef={articleRef} />
              </Box>
            </Box>
          </Flex>
        ) : (
          <Flex alignItems="center" height="100%">
            <EmptyState icon={<GrDocumentMissing />} title="Team not found" />
          </Flex>
        )}
      </Layout>
    </PageMeta>
  );
}
