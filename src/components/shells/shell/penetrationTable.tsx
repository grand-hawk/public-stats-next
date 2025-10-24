import { FormatNumber, HStack } from '@chakra-ui/react';
import React from 'react';

import { Switch } from '@/components/ui/switch';
import StatsTable from '@/components/wikiComponents/statsTables';
import TitledCard from '@/components/wikiComponents/titledCard';
import { useShell } from '@/hooks/contexts/shell';
import { relPenetration } from '@/utils/penetration';

import type { Row, Table } from '@/components/wikiComponents/statsTables';

export default function ShellPenetrationTable() {
  const shell = useShell();
  const [mode, setMode] = React.useState<'los' | 'rel'>('rel');

  const angles = Object.keys(shell.penetrationTable)
    .map(Number)
    .sort((a, b) => a - b);
  const distances = Object.keys(shell.penetrationTable[angles[0]])
    .map(Number)
    .sort((a, b) => a - b);

  const headerRow: Row = [
    'Distance/Angle',
    ...angles.map((angle) => (
      <FormatNumber
        key={angle}
        style="unit"
        unit="degree"
        unitDisplay="narrow"
        value={angle}
      />
    )),
  ];

  const rows: Row[] = distances.map((distance) => [
    <FormatNumber
      key={distance}
      style="unit"
      unit="meter"
      unitDisplay="narrow"
      value={distance}
    />,

    ...angles.map((angle) => {
      let anglePens = shell.penetrationTable[angle][distance];

      if (mode === 'rel')
        anglePens = anglePens.map(
          (anglePen) => anglePen && Math.round(relPenetration(anglePen, angle)),
        );

      return anglePens.map((penetration) =>
        penetration ? (
          <FormatNumber
            key={`${distance}-${angle}-${penetration}`}
            style="unit"
            unit="millimeter"
            unitDisplay="narrow"
            value={penetration}
          />
        ) : (
          '?mm'
        ),
      );
    }),
  ]);

  const table: Table = [headerRow, ...rows];

  return (
    <TitledCard
      as="section"
      endAddon={
        <HStack>
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
      <StatsTable noInlinePadding tables={[table]} />
    </TitledCard>
  );
}
