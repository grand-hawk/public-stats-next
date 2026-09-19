import { Box, Span } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import FamilyLinks from '@/components/features/vehicles/family/familyLinks';
import LineageGrid from '@/components/features/vehicles/lineageGrid';
import TeamIcon from '@/components/icons/teams';
import ArticleTitle from '@/components/wiki/articleTitle';
import SectionMarker from '@/components/wiki/sectionMarker';
import TitledCard from '@/components/wiki/titledCard';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';

import type {
  LineageVehicle,
  VehicleFamily as VehicleFamilyData,
} from '@/server/api/trpc/routers/vehicles';

function groupByTeam(vehicles: LineageVehicle[]) {
  const teams = new Map<string, LineageVehicle[]>();

  for (const vehicle of vehicles) {
    const members = teams.get(vehicle.team);
    if (members) members.push(vehicle);
    else teams.set(vehicle.team, [vehicle]);
  }

  return [...teams].sort(
    ([teamA, a], [teamB, b]) =>
      b.length - a.length || teamA.localeCompare(teamB),
  );
}

export default function VehicleFamily({
  family,
}: {
  family: VehicleFamilyData;
}) {
  const initials = usePlaceInitials()!;
  const teams = groupByTeam(family.vehicles);
  const count = family.vehicles.length;

  return (
    <>
      <ArticleTitle
        id="vehicle-family-page-title"
        title={family.name}
        meta={
          <>
            <Span>Vehicle family</Span>
            <Span>
              {count} {count === 1 ? 'vehicle' : 'vehicles'}
            </Span>
          </>
        }
      />

      {teams.map(([team, vehicles]) => (
        <React.Fragment key={team}>
          <SectionMarker name={team} />

          <TitledCard
            as="section"
            endAddon={<TeamIcon size="20px" team={team} />}
            title={team}
            withAnchor
          >
            <LineageGrid vehicles={vehicles} />
          </TitledCard>
        </React.Fragment>
      ))}

      {family.related.length > 0 && (
        <>
          <SectionMarker name="Other families" />

          <TitledCard
            as="section"
            title="Other families"
            withAnchor
            endAddon={
              <Box
                asChild
                css={{
                  color: 'var(--color-progressive)',
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                <NextLink
                  href={`/${initials}/vehicles/families`}
                  prefetch={false}
                >
                  All families
                </NextLink>
              </Box>
            }
          >
            <FamilyLinks families={family.related} />
          </TitledCard>
        </>
      )}
    </>
  );
}
