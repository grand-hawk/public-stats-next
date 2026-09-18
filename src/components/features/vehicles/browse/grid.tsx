import { Box } from '@chakra-ui/react';
import React from 'react';

import VehicleCard from '@/components/features/vehicles/browse/card';
import { NARROW_MEDIA } from '@/components/layout/shell/constants';

import type { ListVehicle } from '@/server/api/trpc/routers/vehicles';

const GRID_CSS = {
  display: 'grid',
  gap: '12px',
  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  [NARROW_MEDIA]: { gridTemplateColumns: '1fr' },
} as const;

export default function VehicleGrid({
  placeInitials,
  vehicles,
}: {
  placeInitials: string;
  vehicles: ListVehicle[];
}) {
  return (
    <Box css={GRID_CSS}>
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.slug}
          href={`/${placeInitials}/vehicles/${vehicle.slug}`}
          isNew={vehicle.new}
          name={vehicle.name}
          premium={vehicle.premium}
          role={vehicle.role}
          slug={vehicle.slug}
          team={vehicle.team}
        />
      ))}
    </Box>
  );
}
