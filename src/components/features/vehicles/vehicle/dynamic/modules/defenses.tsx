import React from 'react';

import SectionMarker from '@/components/wiki/sectionMarker';
import { StatsCell, StatsRoot, StatsRow } from '@/components/wiki/stats';
import TitledCard from '@/components/wiki/titledCard';
import { useDynamicData } from '@/hooks/providers/dynamicData';
import { getOneModuleOfType } from '@/utils/alterations';

export default function Defenses() {
  const { assembledModules } = useDynamicData();

  const essModule = getOneModuleOfType('ESS', assembledModules);
  const ewModule = getOneModuleOfType('EW', assembledModules);

  if (!essModule && !ewModule) return null;
  return (
    <>
      <SectionMarker name="Defenses" />

      <TitledCard
        as="section"
        collapsible
        innerPadding={4}
        moduleId={essModule?.id || ewModule?.id}
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
            <StatsCell />
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
    </>
  );
}
