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
import { parseMtca } from './mtca';
import { palettes } from './palettes';
import { useArmorProcessor } from './useArmorProcessor';

import type { RawArmorData } from './mtca';
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
  const [hiddenModules, setHiddenModules] = React.useState<ReadonlySet<number>>(
    () => new Set(),
  );
  const [overrideData, setOverrideData] = React.useState<RawArmorData | null>(
    null,
  );
  const [overrideFileName, setOverrideFileName] = React.useState<string | null>(
    null,
  );
  const [uploadError, setUploadError] = React.useState<string | null>(null);

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

  React.useEffect(() => {
    setHiddenModules(new Set());
  }, [vehicleSlug]);

  const handleToggleModule = React.useCallback((moduleIndices: number[]) => {
    setHiddenModules((prev) => {
      const next = new Set(prev);
      const allHidden = moduleIndices.every((i) => next.has(i));
      for (const i of moduleIndices) {
        if (allHidden) next.delete(i);
        else next.add(i);
      }
      return next;
    });
  }, []);

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

  // when data loads or angle changes, reset depth range
  React.useEffect(() => {
    setMinDepth(0);
    if (!detectedMaxDepth) {
      setMaxDepth(Infinity);
      return;
    }
    const fraction =
      angle === 'front' ||
      angle === 'left' ||
      angle === 'right' ||
      angle === 'back'
        ? 0.5
        : angle === 'front_30' || angle === 'front_-30'
          ? 0.75
          : 1;
    setMaxDepth(detectedMaxDepth * fraction);
  }, [detectedMaxDepth, angle]);

  const effectiveMin = autoRange ? detectedMin : minMm;
  const effectiveMax = autoRange ? detectedMax : maxMm;

  const handleSelectVehicle = React.useCallback(
    (slug: string) => {
      setOverrideData(null);
      setOverrideFileName(null);
      setUploadError(null);
      void setVehicleSlug(slug);
    },
    [setVehicleSlug],
  );

  const handleUploadFile = React.useCallback(async (file: File) => {
    try {
      const buffer = await file.arrayBuffer();
      const view = new DataView(buffer);
      const data = parseMtca(view);
      setOverrideData(data);
      setOverrideFileName(file.name);
      setUploadError(null);
      setHiddenModules(new Set());
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : 'Failed to parse file',
      );
      setOverrideData(null);
      setOverrideFileName(null);
    }
  }, []);

  const handleClearUpload = React.useCallback(() => {
    setOverrideData(null);
    setOverrideFileName(null);
    setUploadError(null);
  }, []);

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
        hiddenModules={hiddenModules}
        maxDepth={maxDepth}
        maxMm={maxMm}
        minDepth={minDepth}
        minMm={minMm}
        modules={modules}
        onAngleChange={setAngle}
        onAutoRangeChange={setAutoRange}
        onClearUpload={handleClearUpload}
        onMaxChange={setMaxMm}
        onMaxDepthChange={setMaxDepth}
        onMinChange={setMinMm}
        onMinDepthChange={setMinDepth}
        onOpenTour={handleOpenTour}
        onPaletteChange={setPalette}
        onRicochetAngleChange={setRicochetAngle}
        onSave={handleSave}
        onSelectVehicle={handleSelectVehicle}
        onToggleModule={handleToggleModule}
        onUploadFile={handleUploadFile}
        overrideFileName={overrideFileName}
        palette={palette}
        ricochetAngle={ricochetAngle}
        selectedSlug={vehicleSlug}
        uploadError={uploadError}
        vehicles={vehicleList}
        version={version}
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
