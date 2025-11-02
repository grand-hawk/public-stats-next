import { Box, FormatNumber } from '@chakra-ui/react';
import React from 'react';

import Stat from '@/components/wiki/stat';
import TitledCard from '@/components/wiki/titledCard';
import { useShell } from '@/hooks/providers/shell';

export default function ShellProjectile() {
  const shell = useShell();

  return (
    <TitledCard as="section" title="Projectile" withAnchor>
      <Box
        display="grid"
        gapX={6}
        gapY={2}
        gridTemplateColumns="repeat(auto-fit, minmax(10rem, 1fr))"
      >
        <Stat label="Mass">
          <FormatNumber style="unit" unit="kilogram" value={shell.mass} />
        </Stat>

        <Stat label="Velocity">
          <FormatNumber
            style="unit"
            unit="meter-per-second"
            value={shell.velocity}
          />
        </Stat>

        <Stat label="Max penetration">
          <FormatNumber
            style="unit"
            unit="millimeter"
            value={shell.maxPenetration}
          />
        </Stat>

        {shell.diameter && (
          <Stat label="Penetrator diameter">
            <FormatNumber
              style="unit"
              unit="millimeter"
              value={shell.diameter}
            />
          </Stat>
        )}

        {shell.ricochetAngle && (
          <Stat label="Ricochet angle">
            <FormatNumber
              style="unit"
              unit="degree"
              unitDisplay="narrow"
              value={shell.ricochetAngle}
            />
          </Stat>
        )}

        {shell.reloadMultiplier && (
          <Stat label="Reload multiplier">
            <FormatNumber value={shell.reloadMultiplier} />x
          </Stat>
        )}
      </Box>
    </TitledCard>
  );
}
