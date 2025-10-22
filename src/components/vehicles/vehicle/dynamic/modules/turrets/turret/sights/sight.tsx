import { Flex, FormatNumber, Stack } from '@chakra-ui/react';
import React from 'react';

import InfoTooltip from '@/components/infoTooltip';
import VehicleFeature from '@/components/vehicles/vehicle/feature';
import InlineCard from '@/components/wikiComponents/inlineCard';
import StatsTable from '@/components/wikiComponents/statsTables';
import { betterSentenceCase } from '@/utils/betterSentenceCase';

import type { TurretWithName } from '@/components/vehicles/vehicle/dynamic/modules/turrets';
import type { Row, Table } from '@/components/wikiComponents/statsTables';
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
  sight,
  sightIndex,
  turretName,
}: {
  turretName: string;
  sight: TurretWithName['data']['sights'][number];
  sightIndex: number;
}) {
  const features = [
    sight.fcs && (
      <VehicleFeature key="fcs" description="Fire control system" name="FCS" />
    ),
    sight.lead && <VehicleFeature key="lead" name="Lead" />,
  ].filter(Boolean);

  const fovTooltip = (
    <InfoTooltip
      content="Vertical field of view"
      iconProps={{
        color: 'fg.muted',
      }}
    />
  );

  let baseZoom: React.ReactNode | undefined = sight.zoom.base
    ? convertSightZoom(sight.zoom.base)
    : undefined;
  let thermalZoom: React.ReactNode | undefined = sight.zoom.thermal
    ? convertSightZoom(sight.zoom.thermal)
    : undefined;

  if (baseZoom && sight.zoom.base!.fov)
    baseZoom = (
      <>
        {baseZoom} {fovTooltip}
      </>
    );
  if (thermalZoom && sight.zoom.thermal!.fov)
    thermalZoom = (
      <>
        {thermalZoom} {fovTooltip}
      </>
    );

  const zoomRows: (Row | undefined)[] = [
    baseZoom && !sight.thermal?.forced ? ['Zoom', baseZoom] : undefined,
    thermalZoom ? ['Thermal zoom', thermalZoom] : undefined,
  ];

  const baseAspectRatio = sight.zoom.base?.aspectRatio;
  const thermalAspectRatio = sight.zoom.thermal?.aspectRatio;

  const aspectRatioRows: (Row | undefined)[] = [
    baseAspectRatio !== undefined && !sight.thermal?.forced
      ? [
          'Aspect ratio',
          <>
            <FormatNumber maximumFractionDigits={3} value={baseAspectRatio} />
          </>,
        ]
      : undefined,
    thermalAspectRatio !== undefined
      ? [
          'Thermal aspect ratio',
          <>
            <FormatNumber
              maximumFractionDigits={3}
              value={thermalAspectRatio}
            />
          </>,
        ]
      : undefined,
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
    sight.traverse
      ? [
          'Vertical limits',
          <>
            <FormatNumber
              style="unit"
              unit="degree"
              unitDisplay="narrow"
              value={sight.traverse.vertical.min}
            />
            –
            <FormatNumber
              style="unit"
              unit="degree"
              unitDisplay="narrow"
              value={sight.traverse.vertical.max}
            />
          </>,
        ]
      : undefined,
    ...zoomRows,
    ...aspectRatioRows,
  ];

  return (
    <InlineCard
      title={
        sight.name ? betterSentenceCase(sight.name) : `Sight ${sightIndex + 1}`
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
    </InlineCard>
  );
}
