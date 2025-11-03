import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import slug from 'slug';

import Layout from '@/components/utils/layout';
import { usePlace } from '@/hooks/usePlace';
import { useRouterQuery } from '@/hooks/useRouterQuery';
import { formatTitle } from '@/utils/formatTitle';
import { trpc } from '@/utils/trpc';

export default function PlaceTeam() {
  const router = useRouter();
  const teamQuery = useRouterQuery('team')!;
  const teamSlug = slug(teamQuery);
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

  return (
    <>
      {team ? (
        <Head>
          <title>{formatTitle(team.name, place.initials)}</title>
        </Head>
      ) : (
        <Head>
          <title>{formatTitle('Team not found', place.initials)}</title>
        </Head>
      )}

      <Layout overwriteTabLabel={team?.name}>Placeholder</Layout>
    </>
  );
}
