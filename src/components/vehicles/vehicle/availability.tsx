import TitledCard from '@/components/titledCard';
import { usePlace } from '@/hooks/usePlace';
import { NamedVehicle } from '@/server/api/trpc/routers/vehicles';
import { trpc } from '@/utils/trpc';
import { Center, Link, Table } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import slug from 'slug';

export default function VehicleAvailability({
  vehicle,
}: {
  vehicle: NamedVehicle;
}) {
  const place = usePlace()!;
  const [availability] = trpc.loadouts.vehicleAvailability.useSuspenseQuery({
    placeId: place.placeId,
    slug: vehicle.info.slug,
  });
  const isAvailable = availability && Object.keys(availability).length > 0;

  const teams = React.useMemo(() => {
    if (!availability) return [];

    const allTeams = new Set<string>();

    for (const loadout of Object.values(availability)) {
      for (const team of Object.keys(loadout.teams)) allTeams.add(team);
    }

    return [...allTeams];
  }, [availability]);

  const availabilityEntries = React.useMemo(() => {
    if (!availability) return [];
    return Object.entries(availability);
  }, [availability]);

  if (!isAvailable) return null;
  return (
    <TitledCard title="Availability">
      <Table.Root
        size="sm"
        showColumnBorder
        background="none"
        css={{
          '& .chakra-table__row': {
            background: 'none',
          },
        }}
      >
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Loadout/Team</Table.ColumnHeader>

            {teams.map((team) => (
              <Table.ColumnHeader key={team}>
                <Link asChild>
                  <NextLink href={`/${place.initials}/teams/${slug(team)}`}>
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
                <Link asChild>
                  <NextLink
                    href={`/${place.initials}/loadouts/${slug(loadoutName)}`}
                  >
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
