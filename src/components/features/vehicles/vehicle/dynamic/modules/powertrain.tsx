import { FormatNumber, Stack } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import React from 'react';

import InfoTooltip from '@/components/common/infoTooltip';
import { XSSpinner } from '@/components/common/spinners';
import Gearing from '@/components/features/vehicles/vehicle/dynamic/modules/gearing';
import ChartCard from '@/components/wiki/chartCard';
import SectionMarker from '@/components/wiki/sectionMarker';
import { StatsCell, StatsRoot, StatsRow } from '@/components/wiki/stats';
import TitledCard from '@/components/wiki/titledCard';
import { useDynamicData } from '@/hooks/providers/dynamicData';
import { getOneModuleOfType } from '@/utils/alterations';

const EngineChart = dynamic(
  () =>
    import('@/components/features/vehicles/vehicle/dynamic/modules/engineChart'),
  {
    ssr: false,
    loading: () => <XSSpinner />,
  },
);

export default function Powertrain() {
  const { assembledModules } = useDynamicData();

  const driveData = getOneModuleOfType('DriveData', assembledModules);

  if (!driveData) return null;
  return (
    <>
      <SectionMarker name="Powertrain" />

      <TitledCard
        as="section"
        collapsible
        moduleId={driveData.id}
        title="Powertrain"
        withAnchor
      >
        <Stack gap={4}>
          <StatsRoot>
            <StatsRow>
              <StatsCell asTitle>Engine</StatsCell>
              <StatsCell>{driveData.data.engine.name}</StatsCell>
            </StatsRow>
            <StatsRow withPaddingLeft>
              <StatsCell>Type</StatsCell>
              <StatsCell>{driveData.data.engine.type}</StatsCell>
            </StatsRow>
            <StatsRow withPaddingLeft>
              <StatsCell>Max RPM</StatsCell>
              <StatsCell>
                <FormatNumber value={driveData.data.engine.maxRPM} /> RPM
              </StatsCell>
            </StatsRow>
            <StatsRow withPaddingLeft>
              <StatsCell>Horsepower</StatsCell>
              <StatsCell>
                <FormatNumber value={driveData.data.engine.horsepower} /> hp
              </StatsCell>
            </StatsRow>
            <StatsRow withPaddingLeft>
              <StatsCell>Power-to-weight ratio</StatsCell>
              <StatsCell>
                <FormatNumber
                  maximumFractionDigits={1}
                  value={driveData.data.engine.horsepower / driveData.data.mass}
                />{' '}
                hp/t
              </StatsCell>
            </StatsRow>
          </StatsRoot>

          {driveData.data.metrics && (
            <ChartCard title="Engine output">
              <EngineChart
                idleRPM={driveData.data.metrics.engine.idleRPM}
                points={driveData.data.metrics.engine.points}
              />
            </ChartCard>
          )}

          <StatsRoot>
            <StatsRow>
              <StatsCell asTitle>Transmission</StatsCell>
              <StatsCell>
                {driveData.data.metrics?.driveline.transmissionName}
                {driveData.data.metrics?.driveline.genericTransmission && (
                  <>
                    {' '}
                    <InfoTooltip
                      content="A representative transmission of this type, not the specific unit fitted to this vehicle"
                      iconProps={{
                        color: 'fg.muted',
                      }}
                    />
                  </>
                )}
              </StatsCell>
            </StatsRow>
            <StatsRow withPaddingLeft>
              <StatsCell>Forward gears</StatsCell>
              <StatsCell>{driveData.data.transmission.forwardGears}</StatsCell>
            </StatsRow>
            <StatsRow withPaddingLeft>
              <StatsCell>Reverse gears</StatsCell>
              <StatsCell>{driveData.data.transmission.reverseGears}</StatsCell>
            </StatsRow>
            {driveData.data.metrics && (
              <StatsRow withPaddingLeft>
                <StatsCell>Steering</StatsCell>
                <StatsCell>
                  {driveData.data.metrics.driveline.steeringName}
                </StatsCell>
              </StatsRow>
            )}
            {driveData.data.transmission.neutralSteering && (
              <StatsRow withPaddingLeft>
                <StatsCell>Neutral steering</StatsCell>
                <StatsCell>Yes</StatsCell>
              </StatsRow>
            )}
            {driveData.data.transmission.automatic && (
              <StatsRow withPaddingLeft>
                <StatsCell>Automatic gearbox</StatsCell>
                <StatsCell>Yes</StatsCell>
              </StatsRow>
            )}
          </StatsRoot>

          <Gearing />
        </Stack>
      </TitledCard>
    </>
  );
}
