import { Box, FormatNumber } from '@chakra-ui/react';
import React from 'react';

import InfoTooltip from '@/components/infoTooltip';
import Stat from '@/components/wikiComponents/stat';
import TitledCard from '@/components/wikiComponents/titledCard';
import { useShell } from '@/hooks/contexts/shell';

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
      </Box>
    </TitledCard>
  );
}
