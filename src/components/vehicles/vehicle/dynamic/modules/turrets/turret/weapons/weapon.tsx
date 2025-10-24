import { FormatNumber, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import slug from 'slug';

import InlineCard from '@/components/wikiComponents/inlineCard';
import StatsTable from '@/components/wikiComponents/statsTables';
import { useDynamicData } from '@/hooks/providers/dynamicData';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';
import {
  getModulesByReferences,
  getOneModuleFromReferences,
} from '@/utils/alterations';
import { betterSentenceCase } from '@/utils/betterSentenceCase';

import type { Row, Table } from '@/components/wikiComponents/statsTables';
import type { VehicleModuleFromType } from '@/utils/vehicles';

export default function Weapon({
  turretName,
  weapon,
}: {
  weapon: VehicleModuleFromType<'Weapon'>;
  turretName: string;
}) {
  const initials = usePlaceInitials();
  const { assembledModules } = useDynamicData();

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

  const weaponTable: Table = [
    [null],
    [
      'Reload speed',
      <>
        <FormatNumber
          style="unit"
          unit="second"
          unitDisplay="narrow"
          value={weapon.data.reloadSpeed}
        />
      </>,
    ],
    ammoModels.length > 1
      ? [
          'Refill speed',
          <>
            <FormatNumber
              style="unit"
              unit="second"
              unitDisplay="narrow"
              value={weapon.data.refillSpeed}
            />
          </>,
        ]
      : undefined,
    weapon.data.overheat
      ? [
          'Overheat',
          <>
            <FormatNumber value={weapon.data.overheat.shots} /> shots /{' '}
            <FormatNumber
              style="unit"
              unit="second"
              unitDisplay="narrow"
              value={weapon.data.overheat.cooldown}
            />
          </>,
        ]
      : undefined,
    magazine
      ? [
          'Magazine',
          <>
            <FormatNumber value={magazine.data.size} />
          </>,
        ]
      : undefined,
  ];

  const ammoSelectionTable: Table | undefined = ammoSelection
    ? [
        ['Ammo', null],
        ...(Object.entries(ammoSelection.data)
          .filter(([_, count]) => count !== false)
          .map(([ammo, count]) => [
            <>
              <Link asChild>
                <NextLink
                  href={`/${initials}/shells/${nameSlug}-${slug(ammo)}`}
                >
                  {ammo}
                </NextLink>
              </Link>
            </>,
            count === true ? (
              '*'
            ) : (
              <>
                <FormatNumber value={count as number} />
              </>
            ),
          ]) as Row[]),
      ]
    : undefined;

  const ammoModelsTable: Table | undefined =
    ammoModels.length > 0
      ? [
          ['Ammo models', null],
          ...(ammoModels
            .sort((a, b) => {
              if (a.data.primary && !b.data.primary) return -1;
              if (!a.data.primary && b.data.primary) return 1;
              return b.data.size - a.data.size;
            })
            .map((ammoModel) => [
              betterSentenceCase(ammoModel.data.name),
              <>
                <FormatNumber value={ammoModel.data.size} />
              </>,
            ]) as Row[]),
        ]
      : undefined;

  return (
    <InlineCard
      title={weapon.data.name}
      withAnchor={`${turretName}-weapon-${nameSlug}`}
    >
      <StatsTable tables={[weaponTable, ammoSelectionTable, ammoModelsTable]} />
    </InlineCard>
  );
}
