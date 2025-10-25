import { Link, Table } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import slug from 'slug';

import TitledCard from '@/components/wikiComponents/titledCard';
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

  const availabilityEntries = React.useMemo(() => {
    if (!availability) return [];
    return Object.entries(availability);
  }, [availability]);

  if (!isAvailable) return null;
  return (
    <TitledCard
      as="section"
      innerPadding={4}
      title="In-game availability"
      withAnchor
    >
      <Table.Root
        aria-label="Vehicle in-game availability across loadouts and teams"
        background="none"
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
            <Table.ColumnHeader>Loadout/Team</Table.ColumnHeader>

            {teams.map((team) => (
              <Table.ColumnHeader key={team}>
                <Link asChild variant="underline">
                  <NextLink href={`/${initials}/teams/${slug(team)}`}>
                    {team}
                  </NextLink>
                </Link>
              </Table.ColumnHeader>
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {availabilityEntries.map(([loadoutName, loadout], index) => (
            <Table.Row
              key={loadoutName}
              css={{
                '& .chakra-table__cell': {
                  borderBottomWidth:
                    index === availabilityEntries.length - 1 ? 0 : undefined,
                },
              }}
            >
              <Table.Cell>
                <Link asChild variant="underline">
                  <NextLink href={`/${initials}/loadouts/${slug(loadoutName)}`}>
                    {loadoutName}
                  </NextLink>
                </Link>
              </Table.Cell>

              {teams.map((team) => (
                <Table.Cell key={team}>
                  {loadout.teams[team]?.tier !== undefined
                    ? `Tier ${loadout.teams[team].tier}`
                    : '✗'}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </TitledCard>
  );
}
