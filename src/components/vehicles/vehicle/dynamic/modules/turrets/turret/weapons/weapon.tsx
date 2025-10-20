import { FormatNumber } from '@chakra-ui/react';
import React from 'react';
import slug from 'slug';

import StatsTable from '@/components/statsTables';
import InlineCard from '@/components/vehicles/inlineCard';
import { useDynamicData } from '@/hooks/contexts/dynamicData';
import {
  getModulesByReferences,
  getOneModuleFromReferences,
} from '@/utils/alterations';
import { betterSentenceCase } from '@/utils/betterSentenceCase';

import type { Row, Table } from '@/components/statsTables';
import type { VehicleModuleFromType } from '@/utils/vehicles';

export default function Weapon({
  turretName,
  weapon,
}: {
  weapon: VehicleModuleFromType<'Weapon'>;
  turretName: string;
}) {
  const { assembledModules } = useDynamicData();

  const nameSlug = slug(weapon.data.name);
  const ammoModels = getModulesByReferences<'AmmoModel'>(
    weapon.data.ammoModels,
    assembledModules,
  );
  const ammoSelection =
    weapon.data.ammoSelection !== 'all'
      ? getOneModuleFromReferences<'Ammo'>(
          weapon.data.ammoSelection,
          assembledModules,
        )
      : null;
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
            ammo,
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
            .sort((a, b) => b.data.size - a.data.size)
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
