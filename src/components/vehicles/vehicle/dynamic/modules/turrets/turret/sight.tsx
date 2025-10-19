import { Flex, Stack } from '@chakra-ui/react';
import React from 'react';

import StatsTable from '@/components/statsTables';
import TitledCard from '@/components/vehicles/titledCard';
import VehicleFeature from '@/components/vehicles/vehicle/feature';
import { betterSentenceCase } from '@/utils/betterSentenceCase';

import type { Row, Table } from '@/components/statsTables';
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
  return zoom.fov
    ? `${zoom.max}${suffix}–${zoom.min}${suffix}`
    : `${zoom.min}${suffix}–${zoom.max}${suffix}`;
}

export default function Sight({
  onlySight,
  sight,
  sightIndex,
  turretName,
}: {
  turretName: string;
  sight: TurretWithName['data']['sights'][number];
  sightIndex: number;
  onlySight?: boolean;
}) {
  const features = [
    sight.fcs && (
      <VehicleFeature key="fcs" description="Fire control system" name="FCS" />
    ),
    sight.lead && <VehicleFeature key="lead" name="Lead" />,
  ].filter(Boolean);

  const baseZoom = sight.zoom.base
    ? convertSightZoom(sight.zoom.base)
    : undefined;
  const thermalZoom = sight.zoom.thermal
    ? convertSightZoom(sight.zoom.thermal)
    : undefined;

  const isSameZoom = baseZoom === thermalZoom;

  const zoomRows: (Row | undefined)[] =
    (isSameZoom && !sight.thermal?.forced) || (sight.thermal && !thermalZoom)
      ? [['Day/thermal zoom', baseZoom]]
      : sight.thermal?.forced && thermalZoom
        ? [['Thermal zoom', thermalZoom]]
        : [
            baseZoom ? ['Zoom', baseZoom] : undefined,
            thermalZoom ? ['Thermal zoom', thermalZoom] : undefined,
          ];

  const sightTable: Table = [
    [null],
    ['Rangefinder', sight.rangefinder],
    sight.thermal
      ? [
          'Thermals',
          `${sight.thermal.type}${sight.thermal.forced ? ' (forced)' : ''}`,
        ]
      : undefined,
    ...zoomRows,
  ];

  return (
    <TitledCard
      background="bg.muted"
      closedByDefault={sightIndex !== 0}
      collapsible="force"
      innerPadding={4}
      keepBorder
      title={
        sight.name
          ? betterSentenceCase(sight.name)
          : onlySight
            ? 'Sight'
            : `Sight ${sightIndex + 1}`
      }
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
