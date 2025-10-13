import React from 'react';

import TitledCard from '@/components/titledCard';

import type { NamedVehicle } from '@/server/api/trpc/routers/vehicles';

export default function VehicleGeneralInformation({
  vehicle,
}: {
  vehicle: NamedVehicle;
}) {
  return (
    <TitledCard title="General information">{vehicle.info.slug}</TitledCard>
  );
}
