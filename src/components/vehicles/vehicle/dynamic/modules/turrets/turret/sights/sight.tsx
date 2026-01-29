import { Flex, FormatNumber, Stack } from '@chakra-ui/react';
import React from 'react';

import InfoTooltip from '@/components/infoTooltip';
import Feature from '@/components/wiki/feature';
import InlineCard from '@/components/wiki/inlineCard';
import { StatsCell, StatsRoot, StatsRow } from '@/components/wiki/stats';
import { useDynamicData } from '@/hooks/providers/dynamicData';
import { getModulesByReferences } from '@/utils/alterations';

import type { TurretWithName } from '@/components/vehicles/vehicle/dynamic/modules/turrets';
import type { VehicleModuleFromType } from '@/utils/vehicles';

type SightZoom =
  VehicleModuleFromType<'Turret'>['data']['sights'][number]['zoom'];
type SightZoomType = NonNullable<SightZoom[keyof SightZoom]>;

function convertSightZoom(zoom: SightZoomType) {
  const suffix = zoom.fov ? '°' : 'x';

  if ('steps' in zoom)
    return [...zoom.steps]
      .sort((a, b) => (zoom.fov ? b - a : a - b))
      .map((step) => `${step}${suffix}`)
      .join(', ');

  if (zoom.min === zoom.max) return `${zoom.min}${suffix}`;
  return zoom.fov
    ? `${zoom.max}${suffix}–${zoom.min}${suffix}`
    : `${zoom.min}${suffix}–${zoom.max}${suffix}`;
}

export default function Sight({
  moduleId,
  sight,
  sightIndex,
  turretName,
}: {
  moduleId?: string;
  turretName: string;
  sight: TurretWithName['data']['sights'][number];
  sightIndex: number;
}) {
  const { assembledModules } = useDynamicData();

  const sightAddons = getModulesByReferences<'TurretSightAddon'>(
    sight.addons,
    assembledModules,
  );

  const features = [
    sight.fcs && (
      <Feature key="fcs" description="Fire control system" name="FCS" />
    ),
    sight.lead && <Feature key="lead" name="Lead" />,
    ...sightAddons.map((addon) => (
      <Feature key={addon.id} name={addon.data.name} />
    )),
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

  const baseAspectRatio = sight.zoom.base?.aspectRatio;
  const thermalAspectRatio = sight.zoom.thermal?.aspectRatio;

  return (
    <InlineCard
      headingAs="h4"
      moduleId={moduleId}
      title={sight.name}
      withAnchor={`${turretName}-sight-${sightIndex + 1}`}
    >
      <Stack gap={4}>
        {features.length > 0 && (
          <Flex flexWrap="wrap" gap={2}>
            {features}
          </Flex>
        )}

        <StatsRoot>
          <StatsRow>
            <StatsCell>Rangefinder</StatsCell>
            <StatsCell>{sight.rangefinder}</StatsCell>
          </StatsRow>
          {sight.thermal && (
            <StatsRow>
              <StatsCell>Thermals</StatsCell>
              <StatsCell>
                {sight.thermal.type}
                {sight.thermal.forced ? ' (forced)' : ''}
              </StatsCell>
            </StatsRow>
          )}
          {sight.traverse && (
            <StatsRow>
              <StatsCell>Vertical limits</StatsCell>
              <StatsCell>
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
              </StatsCell>
            </StatsRow>
          )}
          {baseZoom && !sight.thermal?.forced && (
            <StatsRow>
              <StatsCell>Zoom</StatsCell>
              <StatsCell>{baseZoom}</StatsCell>
            </StatsRow>
          )}
          {thermalZoom && (
            <StatsRow>
              <StatsCell>Thermal zoom</StatsCell>
              <StatsCell>{thermalZoom}</StatsCell>
            </StatsRow>
          )}
          {baseAspectRatio !== undefined && !sight.thermal?.forced && (
            <StatsRow>
              <StatsCell>Aspect ratio</StatsCell>
              <StatsCell>
                <FormatNumber
                  maximumFractionDigits={3}
                  value={baseAspectRatio}
                />
              </StatsCell>
            </StatsRow>
          )}
          {thermalAspectRatio !== undefined && (
            <StatsRow>
              <StatsCell>Thermal aspect ratio</StatsCell>
              <StatsCell>
                <FormatNumber
                  maximumFractionDigits={3}
                  value={thermalAspectRatio}
                />
              </StatsCell>
            </StatsRow>
          )}
        </StatsRoot>
      </Stack>
    </InlineCard>
  );
}
