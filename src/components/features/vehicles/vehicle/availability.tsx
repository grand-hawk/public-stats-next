import { Link, Table } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import slug from 'slug';

import SectionMarker from '@/components/wiki/sectionMarker';
import TitledCard from '@/components/wiki/titledCard';
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

      <TitledCard
        as="section"
        innerPadding={4}
        title="In-game availability"
        withAnchor
      >
        <Table.Root
          aria-label="Vehicle in-game availability across loadouts and teams"
          css={{
            '& .chakra-table__row': {
              background: 'none',
            },
          }}
          showColumnBorder
          size="sm"
        >
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Team/Loadout</Table.ColumnHeader>

              {loadouts.map((loadout) => (
                <Table.ColumnHeader key={loadout}>
                  <Link asChild variant="underline">
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
            {teams.map((team, index) => (
              <Table.Row
                key={team}
                css={{
                  '& .chakra-table__cell': {
                    borderBottomWidth:
                      index === teams.length - 1 ? 0 : undefined,
                  },
                }}
              >
                <Table.Cell>
                  <Link asChild variant="underline">
                    <NextLink
                      href={`/${initials}/teams/${slug(team)}`}
                      prefetch={false}
                    >
                      {team}
                    </NextLink>
                  </Link>
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
      </TitledCard>
    </>
  );
}
