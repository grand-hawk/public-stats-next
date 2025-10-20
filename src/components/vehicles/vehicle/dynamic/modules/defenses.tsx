import React from 'react';

import StatsTable from '@/components/statsTables';
import TitledCard from '@/components/vehicles/titledCard';
import { useDynamicData } from '@/hooks/contexts/dynamicData';
import { useVehicle } from '@/hooks/contexts/vehicle';
import { getOneModuleOfType } from '@/utils/alterations';

import type { Table } from '@/components/statsTables';

export default function Defenses() {
  const vehicle = useVehicle();
  const { enabledAlterations } = useDynamicData();

  const essModule = getOneModuleOfType('ESS', vehicle, enabledAlterations);
  const ewModule = getOneModuleOfType('EW', vehicle, enabledAlterations);

  if (!essModule && !ewModule) return null;

  const essTable: Table = [
    [null],
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
