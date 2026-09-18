import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import { samplePalette } from '@/components/features/tools/armor/palettes';

import type { Palette } from '@/components/features/tools/armor/palettes';
import type { SystemStyleObject } from '@chakra-ui/react';

const LEGEND_WIDTH = 256;

const LABEL_CSS: SystemStyleObject = {
  flexShrink: 0,
  color: 'fg.muted',
  fontSize: '0.75rem',
  lineHeight: '1.25rem',
  fontVariantNumeric: 'tabular-nums',
};

export default function HorizontalLegend({
  maxMm,
  minMm,
  palette,
}: {
  maxMm: number;
  minMm: number;
  palette: Palette;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [hoverInfo, setHoverInfo] = React.useState<{
    value: string;
    x: number;
  } | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = LEGEND_WIDTH;
    canvas.height = 1;

    const ctx = canvas.getContext('2d')!;

    for (let x = 0; x < LEGEND_WIDTH; x += 1) {
      const t = x / (LEGEND_WIDTH - 1);
      const c = samplePalette(palette, t);
      ctx.fillStyle = `rgb(${c.r},${c.g},${c.b})`;
      ctx.fillRect(x, 0, 1, 1);
    }
  }, [palette]);

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const t = x / rect.width;
      const mm = Math.round(minMm + t * (maxMm - minMm));

      setHoverInfo({ value: `${mm} mm`, x });
    },
    [minMm, maxMm],
  );

  const handleMouseLeave = React.useCallback(() => setHoverInfo(null), []);

  return (
    <Flex
      alignItems="center"
      flex={1}
      gap="8px"
      minWidth={0}
      position="relative"
    >
      <Text as="span" css={LABEL_CSS}>
        {minMm} mm
      </Text>

      <Box flex={1} minWidth={0} position="relative">
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '12px',
            imageRendering: 'pixelated',
            display: 'block',
            borderRadius: '4px',
          }}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        />
        {hoverInfo && (
          <Text
            left={`${hoverInfo.x}px`}
            pointerEvents="none"
            position="absolute"
            top="calc(100% + 6px)"
            transform="translateX(-50%)"
            whiteSpace="nowrap"
            zIndex={10}
            css={{
              paddingBlock: '2px',
              paddingInline: '8px',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--border-color-base)',
              borderRadius: '4px',
              backgroundColor: 'var(--color-surface-2)',
              color: 'fg.emphasized',
              fontSize: '0.75rem',
              lineHeight: '1.25rem',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {hoverInfo.value}
          </Text>
        )}
      </Box>

      <Text as="span" css={LABEL_CSS}>
        {maxMm} mm
      </Text>
    </Flex>
  );
}
