import { Box } from '@chakra-ui/react';
import { useQueryState } from 'nuqs';
import React from 'react';

import { usePersistStoreIsHydrated } from '@/hooks/usePersistStoreIsHydrated';
import { useSuspenseConfig } from '@/hooks/useSuspenseConfig';
import { useArmorStore } from '@/stores/armor';
import { getNameFromInitials, getPlaceFromName } from '@/utils/placeUtils';
import { trpc } from '@/utils/trpc';

import ArmorCanvas from './armorCanvas';
import ArmorTour from './armorTour';
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
  const [ricochetAngle, setRicochetAngle] = React.useState(82.5);
  const [minDepth, setMinDepth] = React.useState(0);
  const [maxDepth, setMaxDepth] = React.useState(Infinity);

  const saveRef = React.useRef<(() => void) | null>(null);

  const { setTourSeen, tourSeen } = useArmorStore();
  const hydrated = usePersistStoreIsHydrated(useArmorStore);
  const [tourOpen, setTourOpen] = React.useState(false);

  React.useEffect(() => {
    if (hydrated && !tourSeen) {
      setTourOpen(true);
    }
  }, [hydrated, tourSeen]);

  const handleTourOpenChange = React.useCallback(
    (open: boolean) => {
      setTourOpen(open);
      if (!open) setTourSeen(true);
    },
    [setTourSeen],
  );

  const handleOpenTour = React.useCallback(() => {
    setTourOpen(true);
  }, []);

  const {
    canvas,
    detectedMax,
    detectedMaxDepth,
    detectedMin,
    downloadProgress,
    error,
    loading,
    thicknessAt,
  } = useArmorProcessor({
    angle,
    autoRange,
    maxDepth,
    maxMm,
    minDepth,
    minMm,
    palette,
    ricochetAngle,
    slug: vehicleSlug,
  });

  // when data loads or angle changes, reset depth range
  React.useEffect(() => {
    setMinDepth(0);
    if (!detectedMaxDepth) {
      setMaxDepth(Infinity);
      return;
    }
    const fraction =
      angle === 'front'
        ? 0.5
        : angle === 'front_30' || angle === 'front_-30'
          ? 0.75
          : 1;
    setMaxDepth(detectedMaxDepth * fraction);
  }, [detectedMaxDepth, angle]);

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
        detectedMaxDepth={detectedMaxDepth}
        detectedMin={detectedMin}
        maxDepth={maxDepth}
        maxMm={maxMm}
        minDepth={minDepth}
        minMm={minMm}
        onAngleChange={setAngle}
        onAutoRangeChange={setAutoRange}
        onMaxChange={setMaxMm}
        onMaxDepthChange={setMaxDepth}
        onMinChange={setMinMm}
        onMinDepthChange={setMinDepth}
        onOpenTour={handleOpenTour}
        onPaletteChange={setPalette}
        onRicochetAngleChange={setRicochetAngle}
        onSave={handleSave}
        onSelectVehicle={handleSelectVehicle}
        palette={palette}
        ricochetAngle={ricochetAngle}
        selectedSlug={vehicleSlug}
        vehicles={vehicleList}
      />

      <ArmorTour
        hasVehicle={vehicleSlug != null}
        open={tourOpen}
        onOpenChange={handleTourOpenChange}
      />

      <Box
        height={{ base: '70svh', md: 'auto' }}
        minHeight="0"
        overflow="hidden"
      >
        <ArmorCanvas
          angle={angle}
          canvas={canvas}
          detectedMaxDepth={detectedMaxDepth}
          downloadProgress={downloadProgress}
          error={error}
          loading={loading}
          maxDepth={maxDepth}
          maxMm={effectiveMax}
          minDepth={minDepth}
          minMm={effectiveMin}
          onSaveRef={saveRef}
          palette={palette}
          ricochetAngle={ricochetAngle}
          slug={vehicleSlug}
          thicknessAt={thicknessAt}
        />
      </Box>
    </Box>
  );
}
