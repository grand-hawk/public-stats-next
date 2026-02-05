import { FormatNumber } from '@chakra-ui/react';
import React from 'react';

import ModuleIdSelect from '@/components/development/moduleIdSelect';
import SectionMarker from '@/components/wiki/sectionMarker';
import { StatsCell, StatsRoot, StatsRow } from '@/components/wiki/stats';
import TitledCard from '@/components/wiki/titledCard';
import { useDynamicData } from '@/hooks/providers/dynamicData';
import { getAllModulesOfType, getOneModuleOfType } from '@/utils/alterations';

const SEAT_PRIORITIES = ['Driver', 'Pilot', 'Co-pilot', 'Gunner'] as const;

export default function Vehicle() {
  const { assembledModules } = useDynamicData();

  const driveData = getOneModuleOfType('DriveData', assembledModules);
  const seats = getAllModulesOfType('Seat', assembledModules);

  const sortedSeats = React.useMemo(() => {
    const seatCount: Record<string, { count: number; ids: string[] }> = {};
    for (const seat of seats) {
      const name = seat.data.name;

      if (!seatCount[name]) seatCount[name] = { count: 0, ids: [] };
      seatCount[name].count += 1;
      seatCount[name].ids.push(seat.id);
    }

    const getPriorityIndex = (name: string) => {
      const index = SEAT_PRIORITIES.findIndex((priorityName) =>
        name.startsWith(priorityName),
      );
      return index === -1 ? Number.MAX_SAFE_INTEGER : index;
    };

    return Object.entries(seatCount).sort((a, b) => {
      const aPriority = getPriorityIndex(a[0]);
      const bPriority = getPriorityIndex(b[0]);

      if (aPriority !== bPriority) return aPriority - bPriority;
      return a[0].localeCompare(b[0]);
    });
  }, [seats]);

  if (!driveData && seats.length === 0) return null;
  return (
    <>
      <SectionMarker name="Vehicle" />

      <TitledCard
        as="section"
        collapsible
        innerPadding={4}
        moduleId={driveData?.id}
        title="Vehicle"
        withAnchor
      >
        <StatsRoot>
          {driveData && (
            <StatsRow>
              <StatsCell>Weight</StatsCell>
              <StatsCell>
                <FormatNumber
                  maximumFractionDigits={1}
                  value={driveData.data.mass}
                />{' '}
                t
              </StatsCell>
            </StatsRow>
          )}

          {seats.length > 0 && (
            <>
              <StatsRow withPaddingTop>
                <StatsCell asTitle>Seating capacity</StatsCell>
                <StatsCell>
                  <FormatNumber value={seats.length} />
                </StatsCell>
              </StatsRow>
              {sortedSeats.map(([name, { count, ids }]) => (
                <StatsRow key={name} withPaddingLeft>
                  <StatsCell>
                    {name}
                    {ids.map((id) => (
                      <ModuleIdSelect key={id} moduleId={id} />
                    ))}
                  </StatsCell>
                  <StatsCell>
                    <FormatNumber value={count} />
                  </StatsCell>
                </StatsRow>
              ))}
            </>
          )}

          {driveData && (
            <>
              <StatsRow withPaddingTop>
                <StatsCell asTitle>Max speed</StatsCell>
                <StatsCell />
              </StatsRow>
              <StatsRow withPaddingLeft>
                <StatsCell>Forward</StatsCell>
                <StatsCell>
                  <FormatNumber
                    style="unit"
                    unit="kilometer-per-hour"
                    value={driveData.data.engine.forwardSpeed}
                  />
                </StatsCell>
              </StatsRow>
              <StatsRow withPaddingLeft>
                <StatsCell>Backward</StatsCell>
                <StatsCell>
                  <FormatNumber
                    style="unit"
                    unit="kilometer-per-hour"
                    value={driveData.data.engine.reverseSpeed}
                  />
                </StatsCell>
              </StatsRow>
              {driveData.data.engine.amphibiousSpeed && (
                <StatsRow withPaddingLeft>
                  <StatsCell>Amphibious</StatsCell>
                  <StatsCell>
                    <FormatNumber
                      style="unit"
                      unit="kilometer-per-hour"
                      value={driveData.data.engine.amphibiousSpeed}
                    />
                  </StatsCell>
                </StatsRow>
              )}
            </>
          )}

          {(driveData?.data.suspensionControl.height ||
            driveData?.data.suspensionControl.horizontal ||
            driveData?.data.suspensionControl.vertical) && (
            <>
              <StatsRow withPaddingTop>
                <StatsCell asTitle>Active suspension</StatsCell>
                <StatsCell />
              </StatsRow>
              <StatsRow withPaddingLeft>
                <StatsCell>Ride height</StatsCell>
                <StatsCell>
                  {driveData.data.suspensionControl.height ? 'Yes' : 'No'}
                </StatsCell>
              </StatsRow>
              <StatsRow withPaddingLeft>
                <StatsCell>Lateral roll</StatsCell>
                <StatsCell>
                  {driveData.data.suspensionControl.horizontal ? 'Yes' : 'No'}
                </StatsCell>
              </StatsRow>
              <StatsRow withPaddingLeft>
                <StatsCell>Pitch</StatsCell>
                <StatsCell>
                  {driveData.data.suspensionControl.vertical ? 'Yes' : 'No'}
                </StatsCell>
              </StatsRow>
            </>
          )}
        </StatsRoot>
      </TitledCard>

      {driveData && (
        <>
          <SectionMarker name="Powertrain" />
          <TitledCard
            as="section"
            collapsible
            innerPadding={4}
            moduleId={driveData.id}
            title="Powertrain"
            withAnchor
          >
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
                    value={
                      driveData.data.engine.horsepower / driveData.data.mass
                    }
                  />{' '}
                  hp/t
                </StatsCell>
              </StatsRow>

              <StatsRow withPaddingTop>
                <StatsCell asTitle>Transmission</StatsCell>
                <StatsCell />
              </StatsRow>
              <StatsRow withPaddingLeft>
                <StatsCell>Forward gears</StatsCell>
                <StatsCell>
                  {driveData.data.transmission.forwardGears}
                </StatsCell>
              </StatsRow>
              <StatsRow withPaddingLeft>
                <StatsCell>Reverse gears</StatsCell>
                <StatsCell>
                  {driveData.data.transmission.reverseGears}
                </StatsCell>
              </StatsRow>
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
          </TitledCard>
        </>
      )}
    </>
  );
}
