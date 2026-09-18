import { Box, Flex, Portal } from '@chakra-ui/react';
import React from 'react';

import { exportArmorImage } from '@/components/features/tools/armor/armorCanvas/exportImage';
import { CanvasOverlays } from '@/components/features/tools/armor/armorCanvas/overlays';
import {
  CanvasEmptyState,
  CanvasErrorState,
  CanvasLoadingState,
} from '@/components/features/tools/armor/armorCanvas/states';
import { OVERLAY_CARD_CSS } from '@/components/features/tools/armor/armorCanvas/styles';
import { useCanvasRenderer } from '@/components/features/tools/armor/armorCanvas/useCanvasRenderer';
import { useCanvasTooltip } from '@/components/features/tools/armor/armorCanvas/useCanvasTooltip';
import { usePanZoom } from '@/components/features/tools/armor/armorCanvas/usePanZoom';

import type { Palette } from '@/components/features/tools/armor/palettes';
import type { PixelTooltipData } from '@/components/features/tools/armor/useArmorProcessor';
import type { ArmorAngle } from '@/utils/getVehicleImage';

interface ArmorCanvasProps {
  angle: ArmorAngle;
  canvas: HTMLCanvasElement | null;
  compact?: boolean;
  detectedMaxDepth: number;
  disablePanZoom?: boolean;
  downloadProgress: number | null;
  error: string | null;
  loading: boolean;
  maxDepth: number;
  maxMm: number;
  minDepth: number;
  minMm: number;
  onSaveRef: React.MutableRefObject<(() => void) | null>;
  palette: Palette;
  ricochetAngle: number;
  slug: string | null;
  thicknessAt: (x: number, y: number) => PixelTooltipData | 'ricochet' | null;
}

export default function ArmorCanvas({
  angle,
  canvas,
  compact,
  detectedMaxDepth,
  disablePanZoom,
  downloadProgress,
  error,
  loading,
  maxDepth,
  maxMm,
  minDepth,
  minMm,
  onSaveRef,
  palette,
  ricochetAngle,
  slug,
  thicknessAt,
}: ArmorCanvasProps) {
  const displayRef = React.useRef<HTMLCanvasElement>(null);
  const minimapRef = React.useRef<HTMLCanvasElement>(null);
  const viewportRef = React.useRef<HTMLDivElement>(null);

  useCanvasRenderer(canvas, displayRef, viewportRef);

  const {
    hide: hideTooltip,
    showAt: showTooltipAt,
    tooltipRef,
  } = useCanvasTooltip({ canvas, displayRef, thicknessAt });

  const {
    dragging,
    handleMouseDown,
    handleMouseLeave,
    handleMouseMove,
    handleMouseUp,
    handleTouchEnd,
    isZoomed,
    pan,
    resetView,
    zoom,
  } = usePanZoom({
    disabled: disablePanZoom,
    displayRef,
    hideTooltip,
    resetKey: canvas ? `${canvas.width}x${canvas.height}` : '',
    showTooltipAt,
    viewportRef,
  });

  const handleSave = React.useCallback(() => {
    if (!canvas) return;

    exportArmorImage({
      angle,
      canvas,
      maxMm,
      minMm,
      minimap: minimapRef.current,
      palette,
      ricochetAngle,
      slug,
    });
  }, [canvas, palette, minMm, maxMm, ricochetAngle, slug, angle]);

  React.useEffect(() => {
    onSaveRef.current = handleSave;
    return () => {
      onSaveRef.current = null;
    };
  }, [handleSave, onSaveRef]);

  if (loading) return <CanvasLoadingState progress={downloadProgress} />;
  if (error) return <CanvasErrorState error={error} />;
  if (!canvas) return <CanvasEmptyState />;

  return (
    <Flex direction="column" height="100%" minHeight="0">
      <CanvasOverlays
        angle={angle}
        compact={compact}
        detectedMaxDepth={detectedMaxDepth}
        disablePanZoom={disablePanZoom}
        isZoomed={isZoomed}
        maxDepth={maxDepth}
        maxMm={maxMm}
        minDepth={minDepth}
        minMm={minMm}
        minimapRef={minimapRef}
        palette={palette}
        ricochetAngle={ricochetAngle}
        slug={slug}
        onResetView={resetView}
      />

      <Box
        ref={viewportRef}
        cursor={disablePanZoom ? 'default' : dragging ? 'grabbing' : 'grab'}
        flex={1}
        minHeight="0"
        overflow="hidden"
        position="relative"
        css={{ touchAction: disablePanZoom ? 'auto' : 'none' }}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleTouchEnd}
      >
        <Flex
          alignItems="center"
          height="100%"
          justifyContent="center"
          pointerEvents="none"
          width="100%"
        >
          <Box
            position="relative"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
            }}
          >
            <canvas
              ref={displayRef}
              style={{ display: 'block', imageRendering: 'pixelated' }}
            />
          </Box>
        </Flex>
      </Box>

      <Portal>
        <Box
          ref={tooltipRef}
          display="none"
          pointerEvents="none"
          position="fixed"
          whiteSpace="nowrap"
          zIndex={9999}
          css={{
            ...OVERLAY_CARD_CSS,
            paddingBlock: '4px',
            paddingInline: '10px',
            boxShadow: 'var(--box-shadow-medium)',
            color: 'fg.emphasized',
            fontSize: '0.75rem',
            lineHeight: '1.25rem',
            fontVariantNumeric: 'tabular-nums',
          }}
        />
      </Portal>
    </Flex>
  );
}
