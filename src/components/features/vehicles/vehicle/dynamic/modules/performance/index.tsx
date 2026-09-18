import { FormatNumber, Stack } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import React from 'react';

import InfoTooltip from '@/components/common/infoTooltip';
import { XSSpinner } from '@/components/common/spinners';
import {
  degreesOfGrade,
  Gradient,
  Group,
  Seconds,
} from '@/components/features/vehicles/vehicle/dynamic/modules/performance/parts';
import ChartCard from '@/components/wiki/chartCard';
import SectionMarker from '@/components/wiki/sectionMarker';
import { StatsCell, StatsRoot, StatsRow } from '@/components/wiki/stats';
import TitledCard from '@/components/wiki/titledCard';
import { useDynamicData } from '@/hooks/providers/dynamicData';
import { getOneModuleOfType } from '@/utils/alterations';

const AccelerationChart = dynamic(
  () =>
    import('@/components/features/vehicles/vehicle/dynamic/modules/performance/chart'),
  {
    ssr: false,
    loading: () => <XSSpinner />,
  },
);

export default function Performance() {
  const { assembledModules } = useDynamicData();

  const driveData = getOneModuleOfType('DriveData', assembledModules);
  const metrics = driveData?.data.metrics;

  if (!driveData || !metrics) return null;

  // `reverse` is missing from published data despite the schema: keep it optional
  const { acceleration, braking, driveline, grades, pivot, reverse } = metrics;
  const gradeSpeeds = [
    [10, grades.at10.kmh],
    [30, grades.at30.kmh],
    [60, grades.at60.kmh],
  ] as const;

  return (
    <>
      <SectionMarker name="Performance" />

      <TitledCard
        as="section"
        collapsible
        moduleId={driveData.id}
        title="Performance"
        withAnchor
      >
        <Stack gap={4}>
          {acceleration.curve.length > 0 &&
            !!acceleration.curveIntervalSeconds && (
              <ChartCard title="Acceleration">
                <AccelerationChart
                  curve={acceleration.curve}
                  intervalSeconds={acceleration.curveIntervalSeconds}
                  reverseCurve={reverse?.curve}
                  reverseIntervalSeconds={reverse?.curveIntervalSeconds}
                />
              </ChartCard>
            )}

          <StatsRoot>
            {acceleration.to30 !== undefined && (
              <StatsRow>
                <StatsCell>0–30 km/h</StatsCell>
                <StatsCell>
                  <Seconds value={acceleration.to30} />
                </StatsCell>
              </StatsRow>
            )}
            {acceleration.to50 !== undefined && (
              <StatsRow>
                <StatsCell>0–50 km/h</StatsCell>
                <StatsCell>
                  <Seconds value={acceleration.to50} />
                </StatsCell>
              </StatsRow>
            )}
            {acceleration.toTop !== undefined && (
              <StatsRow>
                <StatsCell>0–Vmax</StatsCell>
                <StatsCell>
                  <Seconds value={acceleration.toTop} />
                </StatsCell>
              </StatsRow>
            )}
            {reverse?.toTop !== undefined && (
              <StatsRow>
                <StatsCell>0–Vmax (reverse)</StatsCell>
                <StatsCell>
                  <Seconds value={reverse.toTop} />
                </StatsCell>
              </StatsRow>
            )}
            {driveline.shiftSeconds > 0 && (
              <StatsRow>
                <StatsCell>Shift time</StatsCell>
                <StatsCell>
                  <Seconds value={driveline.shiftSeconds} />
                </StatsCell>
              </StatsRow>
            )}
          </StatsRoot>

          <Group moduleId={driveData.id} title="Braking">
            <StatsRow>
              <StatsCell>Deceleration</StatsCell>
              <StatsCell>
                <FormatNumber
                  maximumFractionDigits={1}
                  value={braking.decelMs2}
                />{' '}
                m/s²
              </StatsCell>
            </StatsRow>
            <StatsRow>
              <StatsCell>Vmax–0</StatsCell>
              <StatsCell>
                <FormatNumber
                  maximumFractionDigits={1}
                  style="unit"
                  unit="meter"
                  value={braking.stopFromTopMeters}
                />
              </StatsCell>
            </StatsRow>
          </Group>

          <Group moduleId={driveData.id} title="Gradeability">
            <StatsRow>
              <StatsCell>
                Max gradient{' '}
                <InfoTooltip
                  content="The steepest slope the vehicle can physically climb, limited by traction or available power"
                  iconProps={{
                    color: 'fg.muted',
                  }}
                />
              </StatsCell>
              <StatsCell>
                <Gradient
                  degrees={grades.ceiling.degrees}
                  percent={grades.ceiling.percent}
                />
              </StatsCell>
            </StatsRow>
            {gradeSpeeds.map(([percent, kmh]) => (
              <StatsRow key={percent}>
                <StatsCell>
                  <Gradient
                    degrees={degreesOfGrade(percent)}
                    percent={percent}
                  />
                </StatsCell>
                <StatsCell>
                  <FormatNumber
                    maximumFractionDigits={1}
                    style="unit"
                    unit="kilometer-per-hour"
                    value={kmh}
                  />
                </StatsCell>
              </StatsRow>
            ))}
          </Group>

          {pivot && (
            <Group moduleId={driveData.id} title="Manoeuvrability">
              <StatsRow>
                <StatsCell>Pivot rate</StatsCell>
                <StatsCell>
                  <FormatNumber
                    maximumFractionDigits={1}
                    style="unit"
                    unit="degree-per-second"
                    value={pivot.degPerSec}
                  />
                </StatsCell>
              </StatsRow>
              {pivot.timeTo180 !== undefined && (
                <StatsRow>
                  <StatsCell>Pivot 180°</StatsCell>
                  <StatsCell>
                    <Seconds value={pivot.timeTo180} />
                  </StatsCell>
                </StatsRow>
              )}
              {pivot.timeTo360 !== undefined && (
                <StatsRow>
                  <StatsCell>Pivot 360°</StatsCell>
                  <StatsCell>
                    <Seconds value={pivot.timeTo360} />
                  </StatsCell>
                </StatsRow>
              )}
            </Group>
          )}
        </Stack>
      </TitledCard>
    </>
  );
}
