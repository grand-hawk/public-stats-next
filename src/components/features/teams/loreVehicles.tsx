import NextLink from 'next/link';
import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';

import VehicleCell from '@/components/features/teams/loadouts/vehicleCell';
import VehicleCellGrid from '@/components/features/teams/loadouts/vehicleCellGrid';
import { EmptyState } from '@/components/ui/empty-state';
import TitledCard from '@/components/wiki/titledCard';

import type { ListVehicle } from '@/server/api/trpc/routers/vehicles';

interface ListVehiclesProps {
  initials: string;
  vehicles: ListVehicle[];
}

export default function ListVehicles({
  initials,
  vehicles,
}: ListVehiclesProps) {
  if (vehicles.length === 0) {
    return (
      <TitledCard as="section" title="Lore vehicles" withAnchor>
        <EmptyState
          icon={<GrDocumentMissing />}
          title="No lore vehicles for this team"
        />
      </TitledCard>
    );
  }

  return (
    <TitledCard as="section" title="Lore vehicles" withAnchor>
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

      <div data-md-show style={{ display: 'none' }}>
        <table>
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.slug}>
                <td>
                  <NextLink
                    href={`/${initials}/vehicles/${vehicle.slug}`}
                    prefetch={false}
                  >
                    {vehicle.name}
                  </NextLink>
                </td>
                <td>{vehicle.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TitledCard>
  );
}
