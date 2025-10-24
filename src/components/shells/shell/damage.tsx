import { Box, FormatNumber } from '@chakra-ui/react';
import React from 'react';

import InfoTooltip from '@/components/infoTooltip';
import Stat from '@/components/wikiComponents/stat';
import TitledCard from '@/components/wikiComponents/titledCard';
import { useShell } from '@/hooks/contexts/shell';

export default function ShellDamage() {
  const shell = useShell();

  return (
    <TitledCard as="section" title="Damage" withAnchor>
      <Box
        display="grid"
        gapX={6}
        gapY={2}
        gridTemplateColumns="repeat(auto-fit, minmax(10rem, 1fr))"
      >
        <Stat label="Base damage">
          <FormatNumber value={shell.damage} /> HP
        </Stat>

        {shell.explosive && (
          <>
            <Stat label="Explosive mass">
              <FormatNumber
                style="unit"
                unit="kilogram"
                value={shell.explosive.mass}
              />
            </Stat>

            {shell.explosive.radius && (
              <Stat
                label={
                  <>
                    Explosion radius
                    <InfoTooltip content="This is the radius of the explosion, and not the kill radius. Drop-off applies in-game" />
                  </>
                }
              >
                <FormatNumber
                  maximumFractionDigits={3}
                  style="unit"
                  unit="meter"
                  value={shell.explosive.radius}
                />
              </Stat>
            )}

            {shell.explosive.killRadius && (
              <Stat
                label={
                  <>
                    Kill radius
                    <InfoTooltip content="This is the maximum distance from the center of the explosion where humanoid death is guaranteed" />
                  </>
                }
              >
                <FormatNumber
                  maximumFractionDigits={3}
                  style="unit"
                  unit="meter"
                  value={shell.explosive.killRadius}
                />
              </Stat>
            )}
          </>
        )}

        {shell.cluster && (
          <>
            <Stat label="Submunitions">
              <FormatNumber value={shell.cluster.submunitions} />
            </Stat>
          </>
        )}

        {shell.shrapMultiplier && (
          <Stat label="Shrapnel multiplier">
            <FormatNumber value={shell.shrapMultiplier} />x
          </Stat>
        )}

        {shell.eraTip && (
          <Stat
            label={
              <>
                ERA tip
                <InfoTooltip content="ERA tip reduces ERA effectiveness against the penetrator" />
              </>
            }
          >
            <FormatNumber value={shell.eraTip} />
          </Stat>
        )}
      </Box>
    </TitledCard>
  );
}
