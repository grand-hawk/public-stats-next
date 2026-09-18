import { FormatNumber, Stack } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import React from 'react';

import InfoTooltip from '@/components/common/infoTooltip';
import { XSSpinner } from '@/components/common/spinners';
import {
  gearLabel,
  gearWord,
} from '@/components/features/vehicles/vehicle/dynamic/modules/gearing/shared';
import ChartCard from '@/components/wiki/chartCard';
import { StatsCell, StatsRoot, StatsRow } from '@/components/wiki/stats';
import TitledCard from '@/components/wiki/titledCard';
import { useDynamicData } from '@/hooks/providers/dynamicData';
import { getOneModuleOfType } from '@/utils/alterations';

import type { VehiclesPlaceDataVehicleDriveDataMetrics } from '@generated/vehicles';

const GearingChart = dynamic(
  () =>
    import('@/components/features/vehicles/vehicle/dynamic/modules/gearing/chart'),
  {
    ssr: false,
    loading: () => <XSSpinner />,
  },
);

const TractiveEffortChart = dynamic(
  () =>
    import('@/components/features/vehicles/vehicle/dynamic/modules/gearing/tractiveEffortChart'),
  {
    ssr: false,
    loading: () => <XSSpinner />,
  },
);

const REDLINE_TOOLTIP =
  'Speed each gear reaches at maximum RPM. Top gear sits slightly above Vmax, which the vehicle reaches before redline';

const STEPLESS_REDLINE_TOOLTIP =
  'Continuously variable — these are range boundaries, not discrete gears. Speed each range reaches at maximum RPM';

function GearRows({
  gears,
  stepless,
}: {
  gears: VehiclesPlaceDataVehicleDriveDataMetrics['gears']['forward'];
  stepless: boolean;
}) {
  return gears.map((gear) => (
    <StatsRow key={gear.gear} withPaddingLeft>
      <StatsCell>{gearLabel(gear.gear, stepless)}</StatsCell>
      <StatsCell>
        {gear.ratio === undefined ? (
          '—'
        ) : (
          <>
            <FormatNumber maximumFractionDigits={3} value={gear.ratio} />
            :1
          </>
        )}
      </StatsCell>
      <StatsCell>
        <FormatNumber
          maximumFractionDigits={1}
          style="unit"
          unit="kilometer-per-hour"
          value={gear.topKmh}
        />
      </StatsCell>
    </StatsRow>
  ));
}

export default function Gearing() {
  const { assembledModules } = useDynamicData();

  const driveData = getOneModuleOfType('DriveData', assembledModules);
  const metrics = driveData?.data.metrics;

  if (!driveData || !metrics) return null;

  const { driveline, engine, gears, tractiveEffort } = metrics;
  const vmax = driveData.data.engine.forwardSpeed;

  return (
    <TitledCard
      collapsible
      headingAs="h3"
      moduleId={driveData.id}
      title="Gearing"
      withAnchor="Powertrain gearing"
    >
      <Stack gap={4}>
        <StatsRoot>
          <StatsRow>
            <StatsCell asTitle>Forward</StatsCell>
            <StatsCell asTitle>Ratio</StatsCell>
            <StatsCell asTitle>
              At redline{' '}
              <InfoTooltip
                content={
                  driveline.stepless
                    ? STEPLESS_REDLINE_TOOLTIP
                    : REDLINE_TOOLTIP
                }
                iconProps={{
                  color: 'fg.muted',
                }}
              />
            </StatsCell>
          </StatsRow>
          <GearRows gears={gears.forward} stepless={driveline.stepless} />

          <StatsRow withPaddingTop>
            <StatsCell asTitle>Reverse</StatsCell>
            <StatsCell />
            <StatsCell />
          </StatsRow>
          <GearRows gears={gears.reverse} stepless={driveline.stepless} />

          {!!gears.selector?.length && (
            <>
              <StatsRow withPaddingTop>
                <StatsCell asTitle>
                  Selector{' '}
                  <InfoTooltip
                    content="Positions on the gear selector. Each one exposes only part of the gearbox's forward range"
                    iconProps={{
                      color: 'fg.muted',
                    }}
                  />
                </StatsCell>
                <StatsCell />
                <StatsCell />
              </StatsRow>
              {gears.selector.map((position) => (
                <StatsRow key={position.name} withPaddingLeft>
                  <StatsCell>{position.name}</StatsCell>
                  <StatsCell colSpan={2}>
                    {position.startGear === position.topGear
                      ? gearLabel(position.startGear, driveline.stepless)
                      : `${gearWord(driveline.stepless)}s ${position.startGear}–${position.topGear}`}
                  </StatsCell>
                </StatsRow>
              ))}
            </>
          )}
        </StatsRoot>

        {!driveline.stepless && gears.forward.length > 0 && (
          <ChartCard
            title="Engine speed"
            tooltip="Where the engine sits at each road speed. Each line runs from idle to redline in that gear, so the drop between lines is the RPM lost on an upshift"
          >
            <GearingChart
              gears={gears.forward}
              idleRPM={engine.idleRPM}
              maxRPM={engine.maxRPM}
              vmax={vmax}
            />
          </ChartCard>
        )}

        {tractiveEffort.gears.length > 0 && (
          <ChartCard
            title="Pull"
            tooltip="Pull is the force at the tracks, as a multiple of the vehicle's weight. A gear can hold a grade wherever its curve sits above that grade's dashed line"
          >
            <TractiveEffortChart
              stepless={driveline.stepless}
              tractiveEffort={tractiveEffort}
              vmax={vmax}
            />
          </ChartCard>
        )}
      </Stack>
    </TitledCard>
  );
}
