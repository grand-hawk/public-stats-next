import { Box, Flex, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import TeamIcon from '@/components/icons/teams';
import Layout from '@/components/layout/layout';
import { usePlace } from '@/hooks/usePlace';
import { trpc } from '@/utils/trpc';

export default function PlaceTeams() {
  const place = usePlace()!;
  const [teams] = trpc.teams.list.useSuspenseQuery({ placeId: place.placeId });

  const playable = teams.filter((team) => !team.lore);
  const lore = teams.filter((team) => team.lore);

  return (
    <Layout>
      <Flex justifyContent="center">
        <Stack gap={6} maxWidth="3xl" width="100%">
          <Stack gap={2}>
            <Heading as="h1" size="2xl">
              Teams
            </Heading>
            <Text color="fg.subtle">
              Browse team vehicle selections and compositions.
            </Text>
          </Stack>

          <TeamGrid initials={place.initials} teams={playable} />

          {lore.length > 0 && (
            <Stack gap={3}>
              <Heading as="h2" size="md">
                Lore teams
              </Heading>
              <Text color="fg.subtle" fontSize="sm">
                Teams referenced by vehicles but not playable in any loadout.
              </Text>
              <TeamGrid initials={place.initials} teams={lore} />
            </Stack>
          )}
        </Stack>
      </Flex>
    </Layout>
  );
}

function TeamGrid({
  initials,
  teams,
}: {
  initials: string;
  teams: Array<{ name: string; slug: string }>;
}) {
  return (
    <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
      {teams.map((team) => (
        <NextLink href={`/${initials}/teams/${team.slug}`} key={team.slug}>
          <Box
            _hover={{ backgroundColor: 'bg.emphasized' }}
            backgroundColor="bg.muted"
            padding={4}
            transition="background-color 0.15s"
          >
            <Flex alignItems="center" gap={3}>
              <TeamIcon team={team.name} />
              <Text fontWeight="semibold">{team.name}</Text>
            </Flex>
          </Box>
        </NextLink>
      ))}
    </SimpleGrid>
  );
}
