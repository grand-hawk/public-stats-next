import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import { AngleSection } from '@/components/features/tools/armor/controls/angleSection';
import { ControlsFooter } from '@/components/features/tools/armor/controls/footer';
import { MobileHeader } from '@/components/features/tools/armor/controls/mobileHeader';
import { ModulesSection } from '@/components/features/tools/armor/controls/modulesSection';
import { PaletteSection } from '@/components/features/tools/armor/controls/paletteSection';
import { RangeSection } from '@/components/features/tools/armor/controls/rangeSection';
import {
  DepthSection,
  RicochetSection,
} from '@/components/features/tools/armor/controls/sliderSections';
import {
  DESKTOP_MEDIA,
  MOBILE_MEDIA,
} from '@/components/features/tools/armor/controls/styles';
import { VehiclePicker } from '@/components/features/tools/armor/controls/vehiclePicker';

import type { VehicleOption } from '@/components/features/tools/armor/controls/vehiclePicker';
import type { DamageModule } from '@/components/features/tools/armor/mtca';
import type { Palette } from '@/components/features/tools/armor/palettes';
import type { ArmorAngle } from '@/utils/getVehicleImage';

interface ArmorControlsProps {
  angle: ArmorAngle;
  autoRange: boolean;
  detectedMax: number;
  detectedMaxDepth: number;
  detectedMin: number;
  hiddenModules: ReadonlySet<number>;
  maxDepth: number;
  maxMm: number;
  minDepth: number;
  minMm: number;
  modules: DamageModule[];
  usedModuleIndices: ReadonlySet<number>;
  onAngleChange: (angle: ArmorAngle) => void;
  onAutoRangeChange: (v: boolean) => void;
  onClearUpload: () => void;
  onClearVehicle: () => void;
  onMaxChange: (v: number) => void;
  onMaxDepthChange: (v: number) => void;
  onMinChange: (v: number) => void;
  onMinDepthChange: (v: number) => void;
  onOpenTour: () => void;
  onPaletteChange: (p: Palette) => void;
  onRicochetAngleChange: (v: number) => void;
  onSave: () => void;
  onSelectVehicle: (slug: string) => void;
  onToggleModule: (moduleIndices: number[]) => void;
  onUploadFile: (file: File) => void;
  overrideFileName: string | null;
  palette: Palette;
  ricochetAngle: number;
  selectedSlug: string | null;
  uploadError: string | null;
  vehicles: VehicleOption[];
  version: number | null;
}

export default function ArmorControls({
  angle,
  autoRange,
  detectedMax,
  detectedMaxDepth,
  detectedMin,
  hiddenModules,
  maxDepth,
  maxMm,
  minDepth,
  minMm,
  modules,
  onAngleChange,
  onAutoRangeChange,
  onClearUpload,
  onClearVehicle,
  onMaxChange,
  onMaxDepthChange,
  onMinChange,
  onMinDepthChange,
  onOpenTour,
  onPaletteChange,
  onRicochetAngleChange,
  onSave,
  onSelectVehicle,
  onToggleModule,
  onUploadFile,
  overrideFileName,
  palette,
  ricochetAngle,
  selectedSlug,
  uploadError,
  usedModuleIndices,
  vehicles,
  version,
}: ArmorControlsProps) {
  const [mobileExpanded, setMobileExpanded] = React.useState(true);

  const selectedName = React.useMemo(
    () => vehicles.find((v) => v.slug === selectedSlug)?.name ?? '',
    [vehicles, selectedSlug],
  );

  return (
    <Flex
      as="aside"
      direction="column"
      height={{ base: 'auto', md: '100%' }}
      minHeight="0"
      css={{
        backgroundColor: 'var(--color-surface-0)',
        [DESKTOP_MEDIA]: {
          borderInlineEnd: '1px solid var(--border-color-base)',
        },
        [MOBILE_MEDIA]: {
          borderBottom: '1px solid var(--border-color-base)',
        },
      }}
    >
      <MobileHeader
        angle={angle}
        expanded={mobileExpanded}
        selectedName={selectedName}
        selectedSlug={selectedSlug}
        onToggle={() => setMobileExpanded((v) => !v)}
      />

      <Box
        display={{ base: 'grid', md: 'flex' }}
        flex={{ md: 1 }}
        minHeight="0"
        overflow="hidden"
        style={{
          gridTemplateRows: mobileExpanded ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.2s ease-out',
        }}
      >
        <Flex
          direction="column"
          flex={{ md: 1 }}
          minHeight="0"
          overflow="hidden"
        >
          <VehiclePicker
            overrideFileName={overrideFileName}
            selectedName={selectedName}
            selectedSlug={selectedSlug}
            uploadError={uploadError}
            vehicles={vehicles}
            version={version}
            onClearUpload={onClearUpload}
            onClearVehicle={onClearVehicle}
            onSelectVehicle={onSelectVehicle}
            onUploadFile={onUploadFile}
          />

          <Flex
            direction="column"
            flex={1}
            minHeight="0"
            overflowY={{ base: 'hidden', md: 'auto' }}
            css={{ paddingInline: '12px' }}
          >
            <AngleSection angle={angle} onAngleChange={onAngleChange} />

            {usedModuleIndices.size > 0 && (
              <ModulesSection
                hiddenModules={hiddenModules}
                modules={modules}
                palette={palette}
                usedModuleIndices={usedModuleIndices}
                onToggleModule={onToggleModule}
              />
            )}

            <RicochetSection
              ricochetAngle={ricochetAngle}
              onRicochetAngleChange={onRicochetAngleChange}
            />

            <DepthSection
              detectedMaxDepth={detectedMaxDepth}
              maxDepth={maxDepth}
              minDepth={minDepth}
              onMaxDepthChange={onMaxDepthChange}
              onMinDepthChange={onMinDepthChange}
            />

            <RangeSection
              autoRange={autoRange}
              detectedMax={detectedMax}
              detectedMin={detectedMin}
              maxMm={maxMm}
              minMm={minMm}
              onAutoRangeChange={onAutoRangeChange}
              onMaxChange={onMaxChange}
              onMinChange={onMinChange}
            />

            <PaletteSection
              palette={palette}
              onPaletteChange={onPaletteChange}
            />

            <ControlsFooter onOpenTour={onOpenTour} onSave={onSave} />
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
}
