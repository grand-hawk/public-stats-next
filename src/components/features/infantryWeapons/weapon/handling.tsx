import { FormatNumber } from '@chakra-ui/react';
import React from 'react';

import TipStat from '@/components/features/shells/shell/tipStat';
import Stat, { StatGrid } from '@/components/wiki/stat';
import TitledCard from '@/components/wiki/titledCard';
import { useInfantryWeapon } from '@/hooks/providers/infantryWeapon';
import {
  cyclesByFireRate,
  fireModeLabel,
  sightMagnification,
} from '@/utils/infantryWeapons';

export default function InfantryWeaponHandling() {
  const weapon = useInfantryWeapon();

  return (
    <TitledCard as="section" title="Weapon" withAnchor>
      <StatGrid>
        {weapon.fireModes.length > 0 && (
          <Stat
            label={weapon.fireModes.length > 1 ? 'Fire modes' : 'Fire mode'}
          >
            {weapon.magazineSize === 1
              ? 'Single shot'
              : weapon.fireModes.map(fireModeLabel).join(', ')}
          </Stat>
        )}

        {weapon.rpm && cyclesByFireRate(weapon) && (
          <Stat label="Rounds per minute">
            <FormatNumber value={weapon.rpm} />
            /min
          </Stat>
        )}

        {weapon.magazineSize && (
          <Stat label="Magazine">
            <FormatNumber value={weapon.magazineSize} />{' '}
            {weapon.magazineSize === 1 ? 'round' : 'rounds'}
          </Stat>
        )}

        {weapon.unlimitedReserve && (
          <Stat label="Spare ammunition">Unlimited</Stat>
        )}

        {weapon.reserveAmmo !== undefined && (
          <Stat label="Spare ammunition">
            {weapon.reserveAmmo === 0 ? (
              'None'
            ) : (
              <>
                <FormatNumber value={weapon.reserveAmmo} />{' '}
                {weapon.reserveAmmo === 1 ? 'round' : 'rounds'}
              </>
            )}
          </Stat>
        )}

        {weapon.pellets && (
          <Stat label="Projectiles per shot">
            <FormatNumber value={weapon.pellets} />
          </Stat>
        )}

        {weapon.sightFov && (
          <Stat label="Sight zoom">
            {weapon.sightFov
              .map(
                (fov) =>
                  `${new Intl.NumberFormat('en', { maximumFractionDigits: 1 }).format(sightMagnification(fov))}x`,
              )
              .join(', ')}
          </Stat>
        )}

        {weapon.rangefinder && <Stat label="Rangefinder">Yes</Stat>}

        {weapon.heavy && (
          <TipStat
            label="Heavy weapon"
            tip="You walk slower and can barely jump while holding a heavy weapon"
          >
            Yes
          </TipStat>
        )}
      </StatGrid>
    </TitledCard>
  );
}
