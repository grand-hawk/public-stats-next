import TitledCard from '@/components/titledCard';
import { NamedVehicle } from '@/server/api/trpc/routers/vehicles';
import React from 'react';

export default function VehicleGeneralInformation({
  vehicle,
}: {
  vehicle: NamedVehicle;
}) {
  return <TitledCard title="General information">test</TitledCard>;
}
