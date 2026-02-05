import { Box } from '@chakra-ui/react';
import { useQueryState } from 'nuqs';
import React from 'react';

import { useSuspenseConfig } from '@/hooks/useSuspenseConfig';
import { getNameFromInitials, getPlaceFromName } from '@/utils/placeUtils';
import { trpc } from '@/utils/trpc';

import ArmorCanvas from './armorCanvas';
import ArmorControls from './controls';
import { palettes } from './palettes';
import { useArmorProcessor } from './useArmorProcessor';

import type { ArmorAngle } from '@/utils/getVehicleImage';

export default function ArmorVisualizer() {
  const config = useSuspenseConfig();
  const rvName = getNameFromInitials(config, 'rv')!;
  const rvPlace = getPlaceFromName(config, rvName);

  const [vehicleList] = trpc.vehicles.list.useSuspenseQuery({
    placeId: rvPlace.placeId,
  });

  const [vehicleSlug, setVehicleSlug] = useQueryState('vehicle');
  const [angle, setAngle] = React.useState<ArmorAngle>('front');
  const [minMm, setMinMm] = React.useState(0);
  const [maxMm, setMaxMm] = React.useState(1000);
  const [autoRange, setAutoRange] = React.useState(true);
  const [palette, setPalette] = React.useState(palettes[0]);

  const saveRef = React.useRef<(() => void) | null>(null);

  const { canvas, detectedMax, detectedMin, error, loading, thicknessAt } =
    useArmorProcessor({
      angle,
      autoRange,
      maxMm,
      minMm,
      palette,
      slug: vehicleSlug,
    });

  const effectiveMin = autoRange ? detectedMin : minMm;
  const effectiveMax = autoRange ? detectedMax : maxMm;

  const handleSelectVehicle = React.useCallback(
    (slug: string) => void setVehicleSlug(slug),
    [setVehicleSlug],
  );

  const handleSave = React.useCallback(() => {
    saveRef.current?.();
  }, []);

  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        base: '1fr',
        md: '280px 1fr',
      }}
      gridTemplateRows={{
        md: '1fr',
      }}
      height={{ md: '100%' }}
      minHeight="0"
      overflow={{ md: 'clip' }}
      width="100%"
    >
      <ArmorControls
        angle={angle}
        autoRange={autoRange}
        detectedMax={detectedMax}
        detectedMin={detectedMin}
        maxMm={maxMm}
        minMm={minMm}
        onAngleChange={setAngle}
        onAutoRangeChange={setAutoRange}
        onMaxChange={setMaxMm}
        onMinChange={setMinMm}
        onPaletteChange={setPalette}
        onSave={handleSave}
        onSelectVehicle={handleSelectVehicle}
        palette={palette}
        selectedSlug={vehicleSlug}
        vehicles={vehicleList}
      />

      <Box
        height={{ base: '70svh', md: 'auto' }}
        minHeight="0"
        overflow="hidden"
      >
        <ArmorCanvas
          canvas={canvas}
          error={error}
          loading={loading}
          maxMm={effectiveMax}
          minMm={effectiveMin}
          onSaveRef={saveRef}
          palette={palette}
          thicknessAt={thicknessAt}
        />
      </Box>
    </Box>
  );
}
