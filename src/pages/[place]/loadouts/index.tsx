import { Box, Flex, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import Head from 'next/head';
import Image from 'next/image';
import NextLink from 'next/link';
import React from 'react';

import Layout from '@/components/layout/layout';
import { usePlace } from '@/hooks/usePlace';
import { formatTitle } from '@/utils/formatTitle';
import { trpc } from '@/utils/trpc';

export default function PlaceLoadouts() {
  const place = usePlace()!;
  const [loadouts] = trpc.loadouts.list.useSuspenseQuery({
    placeId: place.placeId,
  });

  const title = 'Loadouts';

  return (
    <>
      <Head>
        <title>{formatTitle(title, place.initials)}</title>

        <meta content={title} property="og:title" />
        <meta content={title} name="twitter:title" />
      </Head>

      <Layout>
        <Flex justifyContent="center">
          <Stack gap={6} maxWidth="3xl" width="100%">
            <Stack gap={2}>
              <Heading as="h1" size="2xl">
                Loadouts
              </Heading>
              <Text color="fg.muted">
                Explore era-based loadouts and compare team compositions.
              </Text>
            </Stack>

            <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={4}>
              {loadouts.map((loadout) => (
                <NextLink
                  href={`/${place.initials}/loadouts/${loadout.slug}`}
                  key={loadout.slug}
                >
                  <Stack
                    _hover={{ backgroundColor: 'bg.emphasized' }}
                    backgroundColor="bg.muted"
                    gap={0}
                    overflow="hidden"
                    transition="background-color 0.15s"
                  >
                    <Box height="120px" position="relative" width="100%">
                      <Image
                        alt={`${loadout.name} loadout thumbnail`}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        src={loadout.thumbnail}
                        style={{ objectFit: 'cover' }}
                      />
                    </Box>
                    <Stack gap={1} padding={3}>
                      <Text fontWeight="semibold">{loadout.name}</Text>
                      <Text color="fg.muted" fontSize="sm">
                        {loadout.description}
                      </Text>
                    </Stack>
                  </Stack>
                </NextLink>
              ))}
            </SimpleGrid>
          </Stack>
        </Flex>
      </Layout>
    </>
  );
}
