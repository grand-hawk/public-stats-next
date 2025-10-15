import React from 'react';

import StatsTable from '@/components/statsTables';
import TitledCard from '@/components/vehicles/titledCard';
import { getOneModuleOfType } from '@/utils/alterations';

import type { Table } from '@/components/statsTables';
import type { DynamicModuleProps } from '@/components/vehicles/vehicle/dynamic/modules';

export default function Defenses({ data }: { data: DynamicModuleProps }) {
  const essModule = getOneModuleOfType(
    'ESS',
    data.vehicle,
    data.enabledAlterations,
  );
  const ewModule = getOneModuleOfType(
    'EW',
    data.vehicle,
    data.enabledAlterations,
  );

  if (!essModule && !ewModule) return null;

  const essTable: Table = [
    ['Engine smoke system', essModule?.data.present ? 'Yes' : 'No'],
  ];

  const ewTable: Table = [
    ['Electronic warfare', null],
    ['IED jammer', ewModule?.data.ied ? 'Yes' : 'No'],
    ['Drone jammer', ewModule?.data.drone ? 'Yes' : 'No'],
  ];

  return (
    <TitledCard
      as="section"
      collapsible
      innerPadding={4}
      title="Defenses"
      withAnchor
    >
      <StatsTable tables={[essTable, ewTable]} />
    </TitledCard>
  );
}
