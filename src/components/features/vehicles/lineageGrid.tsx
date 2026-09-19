import NextLink from 'next/link';
import React from 'react';

import VehicleCell from '@/components/features/teams/loadouts/vehicleCell';
import VehicleCellGrid from '@/components/features/teams/loadouts/vehicleCellGrid';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';

import type { LineageVehicle } from '@/server/api/trpc/routers/vehicles';

export default function LineageGrid({
  vehicles,
}: {
  vehicles: LineageVehicle[];
}) {
  const initials = usePlaceInitials()!;

  return (
    <>
      <VehicleCellGrid>
        {vehicles.map((vehicle) => (
          <VehicleCell
            key={vehicle.slug}
            initials={initials}
            name={vehicle.name}
            premium={vehicle.premium}
            role={vehicle.role}
            slug={vehicle.slug}
          />
        ))}
      </VehicleCellGrid>

      <ul data-md-show style={{ display: 'none' }}>
        {vehicles.map((vehicle) => (
          <li key={vehicle.slug}>
            <NextLink
              href={`/${initials}/vehicles/${vehicle.slug}`}
              prefetch={false}
            >
              {vehicle.name}
            </NextLink>
            {` (${vehicle.role})`}
          </li>
        ))}
      </ul>
    </>
  );
}
