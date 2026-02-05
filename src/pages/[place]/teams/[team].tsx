import { Flex, Stack } from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';
import slugify from 'slug';

import TeamHeader from '@/components/features/teams/header';
import TeamLoadouts from '@/components/features/teams/loadouts';
import Layout from '@/components/layout/layout';
import { EmptyState } from '@/components/ui/empty-state';
import { usePlace } from '@/hooks/usePlace';
import { useRouterQuery } from '@/hooks/useRouterQuery';
import { formatTitle } from '@/utils/formatTitle';
import { trpc } from '@/utils/trpc';

export default function PlaceTeam() {
  const router = useRouter();
  const teamQuery = useRouterQuery('team')!;
  const teamSlug = slugify(teamQuery);
  const place = usePlace()!;

  const [team] = trpc.teams.bySlug.useSuspenseQuery({
    placeId: place.placeId,
    slug: teamSlug,
  });

  React.useEffect(() => {
    if (!team) return;

    if (teamQuery !== teamSlug)
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          team: teamSlug,
        },
      });
  }, [router, teamQuery, team, teamSlug]);

  const title = team ? team.name : 'Team not found';

  return (
    <>
      <Head>
        <title>{formatTitle(title, place.initials)}</title>

        <meta content={title} property="og:title" />
        <meta content={title} name="twitter:title" />
      </Head>

      <Layout noPadding>
        {team ? (
          <Flex
            justifyContent="center"
            marginBottom={{ base: 4, md: 0 }}
            padding={{ base: 0, md: 2, lg: 4 }}
          >
            <Stack
              aria-labelledby="team-page-title"
              as="article"
              data-md-target
              gap={4}
              maxWidth="5xl"
              width="100%"
            >
              <TeamHeader initials={place.initials} name={team.name} />
              <TeamLoadouts initials={place.initials} team={team} />
            </Stack>
          </Flex>
        ) : (
          <Flex alignItems="center" height="100%">
            <EmptyState icon={<GrDocumentMissing />} title="Team not found" />
          </Flex>
        )}
      </Layout>
    </>
  );
}
