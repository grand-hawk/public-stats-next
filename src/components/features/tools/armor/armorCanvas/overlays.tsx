import { Box, Flex, Text, chakra } from '@chakra-ui/react';
import React from 'react';
import { LuRotateCcw } from 'react-icons/lu';

import DepthMinimap from '@/components/features/tools/armor/armorCanvas/depthMinimap';
import HorizontalLegend from '@/components/features/tools/armor/armorCanvas/horizontalLegend';
import RicochetSwatch from '@/components/features/tools/armor/armorCanvas/ricochetSwatch';
import {
  OVERLAY_CARD_CSS,
  RESET_BUTTON_CSS,
} from '@/components/features/tools/armor/armorCanvas/styles';

import type { Palette } from '@/components/features/tools/armor/palettes';
import type { ArmorAngle } from '@/utils/getVehicleImage';

interface CanvasOverlaysProps {
  angle: ArmorAngle;
  compact?: boolean;
  detectedMaxDepth: number;
  disablePanZoom?: boolean;
  isZoomed: boolean;
  maxDepth: number;
  maxMm: number;
  minDepth: number;
  minMm: number;
  minimapRef: React.RefObject<HTMLCanvasElement | null>;
  onResetView: () => void;
  palette: Palette;
  ricochetAngle: number;
  slug: string | null;
}

export function CanvasOverlays({
  angle,
  compact,
  detectedMaxDepth,
  disablePanZoom,
  isZoomed,
  maxDepth,
  maxMm,
  minDepth,
  minMm,
  minimapRef,
  onResetView,
  palette,
  ricochetAngle,
  slug,
}: CanvasOverlaysProps) {
  if (compact && disablePanZoom) return null;

  return (
    <Flex
      alignItems="flex-start"
      direction="column"
      flexShrink={0}
      gap={2}
      paddingBottom={2}
      paddingTop={compact ? 1 : { base: 3, md: 6 }}
      paddingX={{ base: 3, md: 6 }}
    >
      {!compact && (
        <Text
          color="fg.emphasized"
          fontSize="1rem"
          fontWeight={500}
          letterSpacing="normal"
          lineHeight="1.625rem"
          textTransform="none"
        >
          KE effective thickness at LOS
        </Text>
      )}

      {!compact && (
        <Flex
          alignItems="center"
          gap="12px"
          maxWidth="420px"
          width="100%"
          css={{ ...OVERLAY_CARD_CSS, padding: '10px 12px' }}
        >
          <HorizontalLegend maxMm={maxMm} minMm={minMm} palette={palette} />

          <Flex alignItems="center" flexShrink={0} gap="6px">
            <RicochetSwatch />
            <Text
              color="fg.muted"
              fontSize="0.75rem"
              fontVariantNumeric="tabular-nums"
              lineHeight="1.25rem"
              whiteSpace="nowrap"
            >
              Ricochet (≥{ricochetAngle}°)
            </Text>
          </Flex>
        </Flex>
      )}

      {!compact && slug && (
        <Box
          css={{
            ...OVERLAY_CARD_CSS,
            padding: '8px',
            '&:empty': { display: 'none' },
          }}
        >
          <DepthMinimap
            ref={minimapRef}
            angle={angle}
            detectedMaxDepth={detectedMaxDepth}
            maxDepth={maxDepth}
            minDepth={minDepth}
            slug={slug}
          />
        </Box>
      )}

      {!disablePanZoom && (
        <Box minHeight="32px">
          <chakra.button
            css={RESET_BUTTON_CSS}
            cursor={isZoomed ? 'pointer' : 'default'}
            opacity={isZoomed ? 1 : 0}
            pointerEvents={isZoomed ? 'auto' : 'none'}
            type="button"
            visibility={isZoomed ? 'visible' : 'hidden'}
            onClick={onResetView}
          >
            <LuRotateCcw aria-hidden />
            Reset view
          </chakra.button>
        </Box>
      )}
    </Flex>
  );
}
