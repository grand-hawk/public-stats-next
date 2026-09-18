import { Box } from '@chakra-ui/react';
import { useQueryState } from 'nuqs';
import React from 'react';

import ArmorCanvas from '@/components/features/tools/armor/armorCanvas';
import ArmorTour from '@/components/features/tools/armor/armorTour';
import ArmorControls from '@/components/features/tools/armor/controls';
import { palettes } from '@/components/features/tools/armor/palettes';
import { useArmorDebugBridge } from '@/components/features/tools/armor/useArmorDebugBridge';
import { useArmorProcessor } from '@/components/features/tools/armor/useArmorProcessor';
import { useArmorTour } from '@/components/features/tools/armor/useArmorTour';
import { useArmorUpload } from '@/components/features/tools/armor/useArmorUpload';
import { useFrontArmorDepth } from '@/components/features/tools/armor/useFrontArmorDepth';
import { useHiddenModules } from '@/components/features/tools/armor/useHiddenModules';
import { IS_DEV } from '@/env';
import { useSuspenseConfig } from '@/hooks/useSuspenseConfig';
import { useArmorStore } from '@/stores/armor';
import { getNameFromInitials, getPlaceFromName } from '@/utils/placeUtils';
import { trpc } from '@/utils/trpc';

import type { ArmorAngle } from '@/utils/getVehicleImage';

function depthFractionFor(angle: ArmorAngle, frontFraction: number) {
  switch (angle) {
    case 'front':
      return frontFraction;
    case 'left':
    case 'right':
    case 'back':
      return 0.5;
    case 'front_30':
    case 'front_-30':
      return 0.75;
    default:
      return 1;
  }
}

export default function ArmorVisualizer() {
  const config = useSuspenseConfig();
  const rvName = getNameFromInitials(config, 'rv')!;
  const rvPlace = getPlaceFromName(config, rvName);

  const [vehicleList] = trpc.vehicles.list.useSuspenseQuery({
    placeId: rvPlace.placeId,
  });

  const [vehicleSlug, setVehicleSlug] = useQueryState('vehicle');
  const angle = useArmorStore((s) => s.angle);
  const setAngle = useArmorStore((s) => s.setAngle);
  const maxDepth = useArmorStore((s) => s.maxDepth);
  const setMaxDepth = useArmorStore((s) => s.setMaxDepth);
  const minDepth = useArmorStore((s) => s.minDepth);
  const setMinDepth = useArmorStore((s) => s.setMinDepth);
  const [minMm, setMinMm] = React.useState(0);
  const [maxMm, setMaxMm] = React.useState(1000);
  const [autoRange, setAutoRange] = React.useState(true);
  const [palette, setPalette] = React.useState(palettes[0]);
  const [ricochetAngle, setRicochetAngle] = React.useState(82.5);

  const saveRef = React.useRef<(() => void) | null>(null);

  const tour = useArmorTour();

  const {
    applyDefaults: applyModuleDefaults,
    hiddenModules,
    reset: resetHiddenModules,
    toggle: toggleModules,
  } = useHiddenModules(vehicleSlug);

  const {
    clear: clearUpload,
    data: overrideData,
    error: uploadError,
    fileName: overrideFileName,
    upload: uploadFile,
  } = useArmorUpload(resetHiddenModules);

  const {
    canvas,
    detectedMax,
    detectedMaxDepth,
    detectedMin,
    downloadProgress,
    error,
    loading,
    modules,
    thicknessAt,
    usedModuleIndices,
    version,
  } = useArmorProcessor({
    angle,
    autoRange,
    hiddenModules,
    maxDepth,
    maxMm,
    minDepth,
    minMm,
    overrideData,
    palette,
    ricochetAngle,
    slug: vehicleSlug,
  });

  React.useEffect(() => {
    applyModuleDefaults(modules);
  }, [applyModuleDefaults, modules]);

  const { frontArmorDepth, setFrontArmorDepth } = useFrontArmorDepth(
    rvPlace.placeId,
    vehicleSlug,
    IS_DEV && !overrideData,
  );

  React.useEffect(() => {
    setMinDepth(0);
    if (!detectedMaxDepth) {
      setMaxDepth(Infinity);
      return;
    }
    setMaxDepth(
      detectedMaxDepth *
        depthFractionFor(
          angle,
          frontArmorDepth != null ? frontArmorDepth / 100 : 0.5,
        ),
    );
  }, [detectedMaxDepth, angle, frontArmorDepth, setMaxDepth, setMinDepth]);

  const handleSelectVehicle = React.useCallback(
    (slug: string) => {
      clearUpload();
      void setVehicleSlug(slug);
    },
    [clearUpload, setVehicleSlug],
  );

  const handleClearVehicle = React.useCallback(() => {
    void setVehicleSlug(null);
  }, [setVehicleSlug]);

  const handleSave = React.useCallback(() => {
    saveRef.current?.();
  }, []);

  useArmorDebugBridge({
    detectedMaxDepth,
    slug: vehicleSlug,
    vehicles: vehicleList,
    onSelectVehicle: handleSelectVehicle,
    onSetFrontArmorDepth: setFrontArmorDepth,
  });

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: '1fr', md: '300px 1fr' }}
      gridTemplateRows={{ md: '1fr' }}
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
        hiddenModules={hiddenModules}
        maxDepth={maxDepth}
        maxMm={maxMm}
        minDepth={minDepth}
        minMm={minMm}
        modules={modules}
        overrideFileName={overrideFileName}
        palette={palette}
        ricochetAngle={ricochetAngle}
        selectedSlug={vehicleSlug}
        uploadError={uploadError}
        usedModuleIndices={usedModuleIndices}
        vehicles={vehicleList}
        version={version}
        onAngleChange={setAngle}
        onAutoRangeChange={setAutoRange}
        onClearUpload={clearUpload}
        onClearVehicle={handleClearVehicle}
        onMaxChange={setMaxMm}
        onMaxDepthChange={setMaxDepth}
        onMinChange={setMinMm}
        onMinDepthChange={setMinDepth}
        onOpenTour={tour.openTour}
        onPaletteChange={setPalette}
        onRicochetAngleChange={setRicochetAngle}
        onSave={handleSave}
        onSelectVehicle={handleSelectVehicle}
        onToggleModule={toggleModules}
        onUploadFile={uploadFile}
      />

      <ArmorTour
        hasVehicle={vehicleSlug != null}
        open={tour.open}
        onOpenChange={tour.onOpenChange}
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
          maxMm={autoRange ? detectedMax : maxMm}
          minDepth={minDepth}
          minMm={autoRange ? detectedMin : minMm}
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
