import { Flex, FormatNumber, Stack } from '@chakra-ui/react';
import React from 'react';

import InfoTooltip from '@/components/infoTooltip';
import Feature from '@/components/wikiComponents/feature';
import InlineCard from '@/components/wikiComponents/inlineCard';
import {
  StatsCell,
  StatsRoot,
  StatsRow,
} from '@/components/wikiComponents/stats';
import { betterSentenceCase } from '@/utils/betterSentenceCase';

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
      <Feature key="fcs" description="Fire control system" name="FCS" />
    ),
    sight.lead && <Feature key="lead" name="Lead" />,
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
