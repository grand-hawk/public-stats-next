import { Box, FormatNumber } from '@chakra-ui/react';
import React from 'react';

import InfoTooltip from '@/components/infoTooltip';
import Stat from '@/components/wikiComponents/stat';
import TitledCard from '@/components/wikiComponents/titledCard';
import { useShell } from '@/hooks/providers/shell';

export default function ShellMissile() {
  const shell = useShell();

  if (!shell.missile) return null;
  return (
    <TitledCard as="section" title="Missile" withAnchor>
      <Box
        display="grid"
        gapX={6}
        gapY={2}
        gridTemplateColumns="repeat(auto-fit, minmax(10rem, 1fr))"
      >
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
          <Stat
            label={
              <>
                IRCCM
                <InfoTooltip content="Infrared counter countermeasures" />
              </>
            }
          >
            Yes
          </Stat>
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
          <Stat
            label={
              <>
                Laser guidance
                <InfoTooltip content="Ammunition guided by laser, triggers LWS" />
              </>
            }
          >
            Yes
          </Stat>
        )}
      </Box>
    </TitledCard>
  );
}
