import { FormatNumber, HStack, Stack } from '@chakra-ui/react';
import React from 'react';

import { Switch } from '@/components/ui/switch';
import { StatsCell, StatsRoot, StatsRow } from '@/components/wiki/stats';
import TitledCard from '@/components/wiki/titledCard';
import { useShell } from '@/hooks/providers/shell';
import {
  getPenetrationAngles,
  getPenetrationCells,
  getPenetrationDistances,
} from '@/utils/shellPenetration';

export default function ShellPenetrationTable() {
  const shell = useShell();
  const [mode, setMode] = React.useState<'los' | 'rel'>('rel');

  const angles = getPenetrationAngles(shell.penetrationTable);
  const distances = getPenetrationDistances(shell.penetrationTable, angles[0]);

  return (
    <TitledCard
      as="section"
      endAddon={
        <HStack data-md-ignore>
          LOS
          <Switch
            checked={mode === 'rel'}
            size="sm"
            onCheckedChange={(details) =>
              setMode(details.checked ? 'rel' : 'los')
            }
          />
          REL
        </HStack>
      }
      innerPadding={4}
      title="Penetration"
      withAnchor
    >
      <StatsRoot>
        <StatsRow>
          <StatsCell asTitle>Distance/Angle</StatsCell>
          {angles.map((angle) => (
            <StatsCell key={angle}>
              <FormatNumber
                style="unit"
                unit="degree"
                unitDisplay="narrow"
                value={angle}
              />
            </StatsCell>
          ))}
        </StatsRow>
        {distances.map((distance) => (
          <StatsRow key={distance}>
            <StatsCell>
              <FormatNumber style="unit" unit="meter" value={distance} />
            </StatsCell>
            {angles.map((angle) => {
              const anglePens = getPenetrationCells(
                shell.penetrationTable,
                angle,
                distance,
                mode,
              );

              const anglePenCells = anglePens.map((penetration) => (
                <span key={`${distance}-${angle}-${penetration}`}>
                  {penetration ? (
                    <FormatNumber
                      style="unit"
                      unit="millimeter"
                      value={penetration}
                    />
                  ) : (
                    '?mm'
                  )}
                </span>
              ));

              return (
                <StatsCell key={`${distance}-${angle}`}>
                  {anglePenCells.length > 1 ? (
                    <Stack gap={0}>{anglePenCells}</Stack>
                  ) : (
                    anglePenCells[0]
                  )}
                </StatsCell>
              );
            })}
          </StatsRow>
        ))}
      </StatsRoot>
    </TitledCard>
  );
}
