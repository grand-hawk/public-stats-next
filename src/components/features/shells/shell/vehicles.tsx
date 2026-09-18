import NextLink from 'next/link';
import React from 'react';
import slug from 'slug';

import VehicleCell from '@/components/features/teams/loadouts/vehicleCell';
import VehicleCellGrid from '@/components/features/teams/loadouts/vehicleCellGrid';
import TitledCard from '@/components/wiki/titledCard';
import { useShell } from '@/hooks/providers/shell';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';

export default function ShellVehicles() {
  const initials = usePlaceInitials()!;
  const shell = useShell();

  if (shell.vehicles.length === 0) return null;
  return (
    <TitledCard
      as="section"
      title="Vehicles with this shell"
      withAnchor="vehicles"
    >
      <VehicleCellGrid>
        {shell.vehicles.map((vehicle) => (
          <VehicleCell
            key={vehicle}
            initials={initials}
            name={vehicle}
            slug={slug(vehicle)}
          />
        ))}
      </VehicleCellGrid>

      <ul data-md-show style={{ display: 'none' }}>
        {shell.vehicles.map((vehicle) => (
          <li key={vehicle}>
            <NextLink
              href={`/${initials}/vehicles/${slug(vehicle)}`}
              prefetch={false}
            >
              {vehicle}
            </NextLink>
          </li>
        ))}
      </ul>
    </TitledCard>
  );
}
