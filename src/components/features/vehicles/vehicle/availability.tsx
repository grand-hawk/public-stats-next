import { HStack, Link, Table } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import slug from 'slug';

import MainArticle from '@/components/article/mainArticle';
import TeamIcon from '@/components/icons/teams';
import SectionMarker from '@/components/wiki/sectionMarker';
import { WIKITABLE_CSS, WikiTableFrame } from '@/components/wiki/stats';
import TitledCard from '@/components/wiki/titledCard';
import { STAT_ARTICLES } from '@/content/statLinks';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';

import type { VehicleAvailability } from '@/server/api/trpc/routers/vehicles';

export default function VehicleAvailability({
  availability,
  isAvailable,
}: {
  availability: VehicleAvailability;
  isAvailable: boolean;
}) {
  const initials = usePlaceInitials()!;

  const teams = React.useMemo(() => {
    if (!availability) return [];

    const allTeams = new Set<string>();

    for (const loadout of Object.values(availability)) {
      for (const team of Object.keys(loadout.teams)) allTeams.add(team);
    }

    return Array.from(allTeams);
  }, [availability]);

  const loadouts = React.useMemo(() => {
    if (!availability) return [];
    return Object.keys(availability);
  }, [availability]);

  if (!isAvailable) return null;
  return (
    <>
      <SectionMarker name="In-game availability" />

      <TitledCard as="section" title="In-game availability" withAnchor>
        <MainArticle label="See also" to={STAT_ARTICLES.tier} />

        <WikiTableFrame>
          <Table.Root
            aria-label="Vehicle in-game availability across loadouts and teams"
            background="none"
            css={WIKITABLE_CSS}
            size="sm"
          >
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Team/Loadout</Table.ColumnHeader>

                {loadouts.map((loadout) => (
                  <Table.ColumnHeader key={loadout}>
                    <Link asChild color="inherit">
                      <NextLink
                        href={`/${initials}/loadouts/${slug(loadout)}`}
                        prefetch={false}
                      >
                        {loadout}
                      </NextLink>
                    </Link>
                  </Table.ColumnHeader>
                ))}
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {teams.map((team) => (
                <Table.Row key={team}>
                  <Table.Cell>
                    <HStack gap={1.5}>
                      <TeamIcon size="16px" team={team} />
                      <Link asChild color="inherit">
                        <NextLink
                          href={`/${initials}/teams/${slug(team)}`}
                          prefetch={false}
                        >
                          {team}
                        </NextLink>
                      </Link>
                    </HStack>
                  </Table.Cell>

                  {loadouts.map((loadout) => (
                    <Table.Cell key={loadout}>
                      {availability[loadout]?.teams[team]?.tier !== undefined
                        ? `Tier ${availability[loadout].teams[team].tier}`
                        : '✗'}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </WikiTableFrame>
      </TitledCard>
    </>
  );
}
