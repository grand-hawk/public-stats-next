import React from 'react';

import {
  StatsCell,
  StatsRoot,
  StatsRow,
} from '@/components/wikiComponents/stats';
import TitledCard from '@/components/wikiComponents/titledCard';
import { useDynamicData } from '@/hooks/providers/dynamicData';
import { getOneModuleOfType } from '@/utils/alterations';

export default function Defenses() {
  const { assembledModules } = useDynamicData();

  const essModule = getOneModuleOfType('ESS', assembledModules);
  const ewModule = getOneModuleOfType('EW', assembledModules);

  if (!essModule && !ewModule) return null;
  return (
    <TitledCard
      as="section"
      collapsible
      innerPadding={4}
      title="Defenses"
      withAnchor
    >
      <StatsRoot>
        <StatsRow>
          <StatsCell>Engine smoke system</StatsCell>
          <StatsCell>{essModule?.data.present ? 'Yes' : 'No'}</StatsCell>
        </StatsRow>

        <StatsRow withPaddingTop>
          <StatsCell asTitle>Electronic warfare</StatsCell>
        </StatsRow>
        <StatsRow withPaddingLeft>
          <StatsCell>IED jammer</StatsCell>
          <StatsCell>{ewModule?.data.ied ? 'Yes' : 'No'}</StatsCell>
        </StatsRow>
        <StatsRow withPaddingLeft>
          <StatsCell>Drone jammer</StatsCell>
          <StatsCell>{ewModule?.data.drone ? 'Yes' : 'No'}</StatsCell>
        </StatsRow>
      </StatsRoot>
    </TitledCard>
  );
}
