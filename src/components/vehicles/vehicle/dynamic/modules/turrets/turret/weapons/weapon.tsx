import { FormatNumber, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import slug from 'slug';

import InlineCard from '@/components/wiki/inlineCard';
import { StatsCell, StatsRoot, StatsRow } from '@/components/wiki/stats';
import { useDynamicData } from '@/hooks/providers/dynamicData';
import { usePlace } from '@/hooks/usePlace';
import {
  getModulesByReferences,
  getOneModuleFromReferences,
} from '@/utils/alterations';
import { betterSentenceCase } from '@/utils/betterSentenceCase';
import { trpc } from '@/utils/trpc';

import type { VehicleModuleFromType } from '@/utils/vehicles';

export default function Weapon({
  turretName,
  weapon,
}: {
  weapon: VehicleModuleFromType<'Weapon'>;
  turretName: string;
}) {
  const place = usePlace()!;
  const { assembledModules } = useDynamicData();

  const [reloadMultipliers] =
    trpc.shells.reloadMultipliersBySlug.useSuspenseQuery({
      placeId: place.placeId,
      weapon: weapon.data.name,
    });

  const nameSlug = slug(weapon.data.name);
  const ammoModels = getModulesByReferences<'AmmoModel'>(
    weapon.data.ammoModels,
    assembledModules,
  );
  const ammoSelection = getOneModuleFromReferences<'AmmoSelection'>(
    weapon.data.ammoSelection,
    assembledModules,
  );
  const magazine = getOneModuleFromReferences<'Magazine'>(
    weapon.data.magazine,
    assembledModules,
  );

  return (
    <InlineCard
      title={weapon.data.name}
      withAnchor={`${turretName}-weapon-${nameSlug}`}
    >
      <StatsRoot>
        <StatsRow>
          <StatsCell>Reload speed</StatsCell>
          <StatsCell>
            <FormatNumber
              style="unit"
              unit="second"
              unitDisplay="narrow"
              value={weapon.data.reloadSpeed}
            />
          </StatsCell>
        </StatsRow>
        {ammoModels.length > 1 && (
          <StatsRow>
            <StatsCell>Refill speed</StatsCell>
            <StatsCell>
              <FormatNumber
                style="unit"
                unit="second"
                unitDisplay="narrow"
                value={weapon.data.refillSpeed}
              />
            </StatsCell>
          </StatsRow>
        )}
        {weapon.data.overheat && (
          <StatsRow>
            <StatsCell>Overheat</StatsCell>
            <StatsCell>
              <FormatNumber value={weapon.data.overheat.shots} /> shots /{' '}
              <FormatNumber
                style="unit"
                unit="second"
                unitDisplay="narrow"
                value={weapon.data.overheat.cooldown}
              />
            </StatsCell>
          </StatsRow>
        )}
        {magazine && (
          <StatsRow>
            <StatsCell>Magazine size</StatsCell>
            <StatsCell>
              <FormatNumber value={magazine.data.size} />
            </StatsCell>
          </StatsRow>
        )}

        {ammoSelection && (
          <>
            <StatsRow withPaddingTop>
              <StatsCell asTitle>Ammo</StatsCell>
              <StatsCell>Max</StatsCell>
              {Object.keys(reloadMultipliers).length > 0 && (
                <StatsCell>Reload</StatsCell>
              )}
            </StatsRow>
            {Object.entries(ammoSelection.data)
              .filter(([_, count]) => count !== false)
              .map(([ammo, count]) => (
                <StatsRow key={ammo} withPaddingLeft>
                  <StatsCell>
                    <Link asChild color="inherit" variant="underline">
                      <NextLink
                        href={`/${place.initials}/shells/${nameSlug}-${slug(ammo)}`}
                      >
                        {ammo}
                      </NextLink>
                    </Link>
                  </StatsCell>
                  <StatsCell>
                    {count === true ? (
                      '*'
                    ) : (
                      <FormatNumber value={count as number} />
                    )}
                  </StatsCell>
                  {reloadMultipliers[ammo] && (
                    <StatsCell>
                      <FormatNumber
                        style="unit"
                        unit="second"
                        unitDisplay="narrow"
                        value={
                          weapon.data.reloadSpeed * reloadMultipliers[ammo]
                        }
                      />
                    </StatsCell>
                  )}
                </StatsRow>
              ))}
          </>
        )}

        {ammoModels.length > 0 && (
          <>
            <StatsRow withPaddingTop>
              <StatsCell asTitle>Ammo models</StatsCell>
            </StatsRow>
            {ammoModels
              .sort((a, b) => {
                if (a.data.primary && !b.data.primary) return -1;
                if (!a.data.primary && b.data.primary) return 1;
                return b.data.size - a.data.size;
              })
              .map((ammoModel) => (
                <StatsRow key={ammoModel.data.name} withPaddingLeft>
                  <StatsCell>
                    {betterSentenceCase(ammoModel.data.name)}
                  </StatsCell>
                  <StatsCell>
                    <FormatNumber value={ammoModel.data.size} />
                  </StatsCell>
                </StatsRow>
              ))}
          </>
        )}
      </StatsRoot>
    </InlineCard>
  );
}
