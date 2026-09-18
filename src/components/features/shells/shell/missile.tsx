import { FormatNumber } from '@chakra-ui/react';
import React from 'react';

import TipStat from '@/components/features/shells/shell/tipStat';
import Stat, { StatGrid } from '@/components/wiki/stat';
import TitledCard from '@/components/wiki/titledCard';
import { useShell } from '@/hooks/providers/shell';

export default function ShellMissile() {
  const shell = useShell();

  if (!shell.missile) return null;
  return (
    <TitledCard as="section" title="Missile" withAnchor>
      <StatGrid>
        {shell.missile.boostTime && (
          <Stat label="Boost time">
            <FormatNumber
              style="unit"
              unit="second"
              unitDisplay="narrow"
              value={shell.missile.boostTime}
            />
          </Stat>
        )}

        {shell.missile.irccm && (
          <TipStat label="IRCCM" tip="Infrared counter countermeasures">
            Yes
          </TipStat>
        )}

        {shell.missile.limit !== undefined && (
          <Stat label="G limit">
            <FormatNumber value={shell.missile.limit} />G
          </Stat>
        )}

        {shell.missile.turnRate !== undefined && (
          <Stat label="Turn rate">
            <FormatNumber
              style="unit"
              unit="degree-per-second"
              unitDisplay="narrow"
              value={shell.missile.turnRate}
            />
          </Stat>
        )}

        {shell.missile.unjammable && <Stat label="Unjammable">Yes</Stat>}

        {shell.laser && (
          <TipStat
            label="Laser guidance"
            tip="Ammunition guided by laser, triggers LWS"
          >
            Yes
          </TipStat>
        )}
      </StatGrid>
    </TitledCard>
  );
}
