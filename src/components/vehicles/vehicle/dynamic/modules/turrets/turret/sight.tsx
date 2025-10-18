import { Flex, Stack } from '@chakra-ui/react';
import { sentenceCase } from 'change-case';
import React from 'react';

import StatsTable from '@/components/statsTables';
import TitledCard from '@/components/vehicles/titledCard';
import VehicleFeature from '@/components/vehicles/vehicle/feature';

import type { Table } from '@/components/statsTables';
import type { TurretWithName } from '@/components/vehicles/vehicle/dynamic/modules/turrets';
import type { VehicleModuleFromType } from '@/utils/vehicles';

type SightZoom =
  VehicleModuleFromType<'Turret'>['data']['sights'][number]['zoom'];
type SightZoomType = NonNullable<SightZoom[keyof SightZoom]>;

function convertSightZoom(zoom: SightZoomType) {
  const suffix = zoom.fov ? '°' : 'x';

  if ('steps' in zoom)
    return zoom.steps
      .sort((a, b) => (zoom.fov ? b - a : a - b))
      .map((step) => `${step}${suffix}`)
      .join(', ');

  if (zoom.min === zoom.max) return `${zoom.min}${suffix}`;
  return `${zoom.min}${suffix}–${zoom.max}${suffix}`;
}

export default function Sight({
  sight,
  sightIndex,
  turretName,
}: {
  turretName: string;
  sight: TurretWithName['data']['sights'][number];
  sightIndex: number;
}) {
  const features = [
    sight.fcs && <VehicleFeature key="fcs" name="Fire control system" />,
    sight.lead && <VehicleFeature key="lead" name="Lead" />,
  ].filter(Boolean);

  const baseZoom = sight.zoom.base
    ? convertSightZoom(sight.zoom.base)
    : undefined;
  const thermalZoom = sight.zoom.thermal
    ? convertSightZoom(sight.zoom.thermal)
    : undefined;

  const sightTable: Table = [
    [null],
    ['Rangefinder', sight.rangefinder],
    sight.thermal
      ? [
          'Thermals',
          `${sight.thermal.type}${sight.thermal.forced ? ' (forced)' : ''}`,
        ]
      : undefined,
    baseZoom && !sight.thermal?.forced ? ['Zoom', baseZoom] : undefined,
    thermalZoom && thermalZoom !== baseZoom
      ? ['Thermal zoom', thermalZoom]
      : undefined,
  ];

  return (
    <TitledCard
      background="bg.muted"
      closedByDefault={sightIndex !== 0}
      collapsible="force"
      innerPadding={4}
      keepBorder
      title={sight.name ? sentenceCase(sight.name) : `Sight ${sightIndex + 1}`}
      withAnchor={`${turretName}-sight-${sightIndex + 1}`}
    >
      <Stack gap={4}>
        {features.length > 0 && (
          <Flex flexWrap="wrap" gap={2}>
            {features}
          </Flex>
        )}

        <StatsTable tables={[sightTable]} />
      </Stack>
    </TitledCard>
  );
}
