import { FormatNumber } from '@chakra-ui/react';
import React from 'react';

import TipStat from '@/components/features/shells/shell/tipStat';
import Stat, { StatGrid } from '@/components/wiki/stat';
import TitledCard from '@/components/wiki/titledCard';
import { useShell } from '@/hooks/providers/shell';

export default function ShellDamage() {
  const shell = useShell();

  return (
    <TitledCard as="section" title="Damage" withAnchor>
      <StatGrid>
        <Stat article="damage" label="Max damage">
          <FormatNumber value={shell.damage} /> HP
        </Stat>

        <Stat label="Player damage">
          <FormatNumber value={shell.humanoidDamage} /> HP
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
              <TipStat
                label="Explosion radius"
                tip="This is the radius of the explosion, and not the kill radius. Drop-off applies in-game"
              >
                <FormatNumber
                  maximumFractionDigits={3}
                  style="unit"
                  unit="meter"
                  value={shell.explosive.radius}
                />
              </TipStat>
            )}

            {shell.explosive.killRadius && (
              <TipStat
                label="Kill radius"
                tip="This is the maximum distance from the center of the explosion where humanoid death is guaranteed"
              >
                <FormatNumber
                  maximumFractionDigits={3}
                  style="unit"
                  unit="meter"
                  value={shell.explosive.killRadius}
                />
              </TipStat>
            )}
          </>
        )}

        {shell.cluster && (
          <Stat label="Submunitions">
            <FormatNumber value={shell.cluster.submunitions} />
          </Stat>
        )}

        {shell.shrapMultiplier && (
          <Stat label="Shrapnel multiplier">
            <FormatNumber value={shell.shrapMultiplier} />x
          </Stat>
        )}

        {shell.eraTip && (
          <TipStat
            article="antiEra"
            label="ERA tip"
            tip="How much of an ERA panel's protection against solid shot this round removes. Modern panels resist part of it, which is why some rounds go above 1."
          >
            <FormatNumber value={shell.eraTip} />
          </TipStat>
        )}
      </StatGrid>
    </TitledCard>
  );
}
