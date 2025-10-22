import React from 'react';

import StatsTable from '@/components/wikiComponents/statsTables';
import TitledCard from '@/components/wikiComponents/titledCard';
import { useDynamicData } from '@/hooks/contexts/dynamicData';
import { getOneModuleOfType } from '@/utils/alterations';

import type { Table } from '@/components/wikiComponents/statsTables';

export default function Defenses() {
  const { assembledModules } = useDynamicData();

  const essModule = getOneModuleOfType('ESS', assembledModules);
  const ewModule = getOneModuleOfType('EW', assembledModules);

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
