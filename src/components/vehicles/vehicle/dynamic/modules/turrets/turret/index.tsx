import { Flex, FormatNumber, Stack } from '@chakra-ui/react';
import React from 'react';

import Sights from '@/components/vehicles/vehicle/dynamic/modules/turrets/turret/sights';
import Weapons from '@/components/vehicles/vehicle/dynamic/modules/turrets/turret/weapons';
import Feature from '@/components/wiki/feature';
import { StatsCell, StatsRoot, StatsRow } from '@/components/wiki/stats';
import TitledCard from '@/components/wiki/titledCard';
import { useDynamicData } from '@/hooks/providers/dynamicData';
import { getModulesByReferences } from '@/utils/alterations';

import type { TurretWithName } from '@/components/vehicles/vehicle/dynamic/modules/turrets';

export default function Turret({ turret }: { turret: TurretWithName }) {
  const { assembledModules } = useDynamicData();

  const weapons = getModulesByReferences<'Weapon'>(
    turret.data.weapons,
    assembledModules,
  );

  const features = [
    turret.data.lws && (
      <Feature key="lws" description="Laser warning system" name="LWS" />
    ),
    turret.data.maws && (
      <Feature
        key="maws"
        description="Missile approach warning system"
        name="MAWS"
      />
    ),
    turret.data.stabilizer && <Feature key="stab" name="Stabilizer" />,
    weapons.some((weapon) => weapon.data.name === 'Smoke Grenade') && (
      <Feature key="smoke" name="Smoke grenades" />
    ),
    weapons.some((weapon) => weapon.data.name === 'Flares') && (
      <Feature key="flares" name="Flares" />
    ),
  ].filter(Boolean);

  const isFixed =
    turret.data.traverse.speed.horizontal === 0 &&
    turret.data.traverse.speed.vertical === 0;

  return (
    <TitledCard
      as="section"
      collapsible
      innerPadding={4}
      title={turret.name}
      withAnchor
    >
      <Stack gap={4}>
        {features.length > 0 && (
          <Flex flexWrap="wrap" gap={2}>
            {features}
          </Flex>
        )}

        <StatsRoot>
          <StatsRow>
            <StatsCell asTitle>Traversal</StatsCell>
            <StatsCell />
          </StatsRow>
          {turret.data.traverse.mouseAim && (
            <StatsRow withPaddingLeft>
              <StatsCell>Mouse aim</StatsCell>
              <StatsCell>Yes</StatsCell>
            </StatsRow>
          )}
          {isFixed ? (
            <StatsRow withPaddingLeft>
              <StatsCell>Fixed</StatsCell>
              <StatsCell>Yes</StatsCell>
            </StatsRow>
          ) : (
            <>
              <StatsRow withPaddingLeft>
                <StatsCell>Horizontal speed</StatsCell>
                <StatsCell>
                  <FormatNumber
                    style="unit"
                    unit="degree-per-second"
                    value={turret.data.traverse.speed.horizontal}
                  />
                </StatsCell>
              </StatsRow>
              <StatsRow withPaddingLeft>
                <StatsCell>Vertical speed</StatsCell>
                <StatsCell>
                  <FormatNumber
                    style="unit"
                    unit="degree-per-second"
                    value={turret.data.traverse.speed.vertical}
                  />
                </StatsCell>
              </StatsRow>
            </>
          )}
          <StatsRow withPaddingLeft>
            <StatsCell>Vertical limits</StatsCell>
            <StatsCell>
              <FormatNumber
                style="unit"
                unit="degree"
                unitDisplay="narrow"
                value={turret.data.traverse.vertical.min}
              />
              –
              <FormatNumber
                style="unit"
                unit="degree"
                unitDisplay="narrow"
                value={turret.data.traverse.vertical.max}
              />
            </StatsCell>
          </StatsRow>
        </StatsRoot>

        <Weapons
          turret={turret}
          weapons={weapons
            .filter(
              (weapon) =>
                weapon.data.name !== 'Smoke Grenade' &&
                weapon.data.name !== 'Flares',
            )
            .sort((a, b) => a.data.orderIndex - b.data.orderIndex)}
        />

        <Sights turret={turret} />
      </Stack>
    </TitledCard>
  );
}
