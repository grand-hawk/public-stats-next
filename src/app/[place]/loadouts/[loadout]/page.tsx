'use client';

import { Flex, Stack } from '@chakra-ui/react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';
import slugify from 'slug';

import LoadoutHeader from '@/components/features/loadouts/header';
import LoadoutTeams from '@/components/features/loadouts/teams';
import Layout from '@/components/layout/layout';
import PageMeta from '@/components/layout/pageMeta';
import { EmptyState } from '@/components/ui/empty-state';
import { usePlace } from '@/hooks/usePlace';
import { trpc } from '@/utils/trpc';

export default function PlaceLoadout() {
  const router = useRouter();
  const params = useParams();
  const loadoutQuery = params.loadout as string;
  const loadoutSlug = slugify(loadoutQuery);
  const place = usePlace()!;

  const [loadout] = trpc.loadouts.bySlug.useSuspenseQuery({
    placeId: place.placeId,
    slug: loadoutSlug,
  });

  React.useEffect(() => {
    if (!loadout) return;

    if (loadoutQuery !== loadoutSlug) {
      const newPath = `/${place.initials}/loadouts/${loadoutSlug}`;
      router.replace(newPath);
    }
  }, [router, loadoutQuery, loadout, loadoutSlug, place.initials]);

  const title = loadout ? loadout.name : 'Loadout not found';
  const description = loadout
    ? `${loadout.name} loadout statistics and team compositions for ${place.placeName}`
    : undefined;

  return (
    <PageMeta title={title} description={description}>
      <Layout noPadding overwriteTabLabel={loadout?.name}>
        {loadout ? (
          <Flex
            justifyContent="center"
            marginBottom={{ base: 4, md: 0 }}
            padding={{ base: 0, md: 2, lg: 4 }}
          >
            <Stack
              aria-labelledby="loadout-page-title"
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
    </PageMeta>
  );
}
