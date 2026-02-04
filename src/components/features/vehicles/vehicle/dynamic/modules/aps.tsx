import { FormatNumber } from '@chakra-ui/react';
import React from 'react';

import InfoTooltip from '@/components/common/infoTooltip';
import { StatsCell, StatsRoot, StatsRow } from '@/components/wiki/stats';
import TitledCard from '@/components/wiki/titledCard';
import { useDynamicData } from '@/hooks/providers/dynamicData';
import { getAllModulesOfType } from '@/utils/alterations';

export default function APS() {
  const { assembledModules } = useDynamicData();

  const apsModules = getAllModulesOfType('APS', assembledModules);

  if (apsModules.length === 0) return null;
  return (
    <>
      {apsModules.map((aps, index) => {
        const title = apsModules.length > 1 ? `APS ${index + 1}` : 'APS';

        return (
          <TitledCard
            key={aps.id}
            as="section"
            collapsible
            innerPadding={4}
            moduleId={aps.id}
            title={title}
            withAnchor
            closedByDefault
          >
            <StatsRoot>
              <StatsRow>
                <StatsCell>Horizontal limits</StatsCell>
                <StatsCell>
                  <FormatNumber
                    style="unit"
                    unit="degree"
                    unitDisplay="narrow"
                    value={aps.data.traverse.horizontal.min}
                  />{' '}
                  /{' '}
                  <FormatNumber
                    style="unit"
                    unit="degree"
                    unitDisplay="narrow"
                    value={aps.data.traverse.horizontal.max}
                  />
                </StatsCell>
              </StatsRow>

              <StatsRow>
                <StatsCell>Vertical limits</StatsCell>
                <StatsCell>
                  <FormatNumber
                    style="unit"
                    unit="degree"
                    unitDisplay="narrow"
                    value={aps.data.traverse.vertical.min}
                  />{' '}
                  /{' '}
                  <FormatNumber
                    style="unit"
                    unit="degree"
                    unitDisplay="narrow"
                    value={aps.data.traverse.vertical.max}
                  />
                </StatsCell>
              </StatsRow>

              <StatsRow>
                <StatsCell>Ammo</StatsCell>
                <StatsCell>
                  <FormatNumber value={aps.data.launchers} /> launcher
                  {aps.data.launchers > 1 ? 's' : ''},{' '}
                  <FormatNumber value={aps.data.ammo} /> charge
                  {aps.data.ammo > 1 ? 's' : ''} each
                </StatsCell>
              </StatsRow>

              <StatsRow>
                <StatsCell>Cooldown</StatsCell>
                <StatsCell>
                  <FormatNumber
                    style="unit"
                    unit="second"
                    unitDisplay="narrow"
                    value={aps.data.cooldown}
                  />{' '}
                  <InfoTooltip
                    content="Minimum time between interceptions"
                    iconProps={{
                      color: 'fg.muted',
                    }}
                  />
                </StatsCell>
              </StatsRow>

              <StatsRow>
                <StatsCell>Reaction time</StatsCell>
                <StatsCell>
                  <FormatNumber
                    style="unit"
                    unit="second"
                    unitDisplay="narrow"
                    value={aps.data.reactionTime}
                  />
                </StatsCell>
              </StatsRow>

              <StatsRow>
                <StatsCell>Interception speed</StatsCell>
                <StatsCell>
                  <FormatNumber
                    style="unit"
                    unit="meter-per-second"
                    value={aps.data.interceptionSpeed.min}
                  />{' '}
                  min,{' '}
                  <FormatNumber
                    style="unit"
                    unit="meter-per-second"
                    value={aps.data.interceptionSpeed.max}
                  />{' '}
                  max
                </StatsCell>
              </StatsRow>

              <StatsRow>
                <StatsCell>KE reduction</StatsCell>
                <StatsCell>
                  <FormatNumber style="percent" value={aps.data.resistance} />
                </StatsCell>
              </StatsRow>
            </StatsRoot>
          </TitledCard>
        );
      })}
    </>
  );
}
