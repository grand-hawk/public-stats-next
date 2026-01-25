import { Flex, Stack } from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';
import slugify from 'slug';

import LoadoutHeader from '@/components/loadouts/header';
import LoadoutTeams from '@/components/loadouts/teams';
import { EmptyState } from '@/components/ui/empty-state';
import Layout from '@/components/utils/layout';
import { usePlace } from '@/hooks/usePlace';
import { useRouterQuery } from '@/hooks/useRouterQuery';
import { formatTitle } from '@/utils/formatTitle';
import { trpc } from '@/utils/trpc';

export default function PlaceLoadout() {
  const router = useRouter();
  const loadoutQuery = useRouterQuery('loadout')!;
  const loadoutSlug = slugify(loadoutQuery);
  const place = usePlace()!;

  const [loadout] = trpc.loadouts.bySlug.useSuspenseQuery({
    placeId: place.placeId,
    slug: loadoutSlug,
  });

  React.useEffect(() => {
    if (!loadout) return;

    if (loadoutQuery !== loadoutSlug)
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          loadout: loadoutSlug,
        },
      });
  }, [router, loadoutQuery, loadout, loadoutSlug]);

  const title = loadout ? loadout.name : 'Loadout not found';

  return (
    <>
      <Head>
        <title>{formatTitle(title, place.initials)}</title>

        <meta content={title} property="og:title" />
        <meta content={title} name="twitter:title" />
      </Head>

      <Layout noPadding overwriteTabLabel={loadout?.name}>
        {loadout ? (
          <Flex
            justifyContent="center"
            marginBottom={{ base: 4, md: 0 }}
            padding={{ base: 0, md: 2, lg: 4 }}
          >
            <Stack
              as="article"
              data-md-target
              gap={4}
              maxWidth="5xl"
              width="100%"
            >
              <LoadoutHeader initials={place.initials} name={loadout.name} />
              <LoadoutTeams initials={place.initials} loadout={loadout} />
            </Stack>
          </Flex>
        ) : (
          <Flex alignItems="center" height="100%">
            <EmptyState
              icon={<GrDocumentMissing />}
              title="Loadout not found"
            />
          </Flex>
        )}
      </Layout>
    </>
  );
}
