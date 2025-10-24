import { Box, FormatNumber, HStack, Span } from '@chakra-ui/react';
import React from 'react';

import InfoTooltip from '@/components/infoTooltip';
import Stat from '@/components/wikiComponents/stat';
import TitledCard from '@/components/wikiComponents/titledCard';
import { useShell } from '@/hooks/contexts/shell';
import StatsTable, {
  Row,
  Table,
} from '@/components/wikiComponents/statsTables';
import { Switch } from '@/components/ui/switch';
import { relPenetration } from '@/utils/penetration';

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
        value={angle}
        unit="degree"
        unitDisplay="narrow"
        style="unit"
      />
    )),
  ];

  const rows: Row[] = distances.map((distance) => [
    <FormatNumber
      key={distance}
      value={distance}
      style="unit"
      unit="meter"
      unitDisplay="narrow"
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
            value={penetration}
            key={`${distance}-${angle}-${penetration}`}
            style="unit"
            unit="millimeter"
            unitDisplay="narrow"
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
      title="Penetration"
      withAnchor
      innerPadding={4}
      endAddon={
        <HStack>
          LOS
          <Switch
            size="sm"
            checked={mode === 'rel'}
            onCheckedChange={(details) =>
              setMode(details.checked ? 'rel' : 'los')
            }
          />
          REL
        </HStack>
      }
    >
      <StatsTable tables={[table]} noInlinePadding />
    </TitledCard>
  );
}
