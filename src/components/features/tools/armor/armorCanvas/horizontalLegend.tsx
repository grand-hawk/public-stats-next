import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import { samplePalette } from '../palettes';

import type { Palette } from '../palettes';

const LEGEND_WIDTH = 256;

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

    for (let x = 0; x < LEGEND_WIDTH; x++) {
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
    <Flex alignItems="center" flex={1} gap={1} minWidth={0} position="relative">
      <Text color="fg.muted" flexShrink={0} fontSize="2xs">
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
          }}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        />
        {hoverInfo && (
          <Text
            background="bg.panel"
            borderColor="border.muted"
            borderWidth="1px"
            fontSize="2xs"
            left={`${hoverInfo.x}px`}
            paddingX={1}
            pointerEvents="none"
            position="absolute"
            top="calc(100% + 4px)"
            transform="translateX(-50%)"
            whiteSpace="nowrap"
            zIndex={10}
          >
            {hoverInfo.value}
          </Text>
        )}
      </Box>

      <Text color="fg.muted" flexShrink={0} fontSize="2xs">
        {maxMm} mm
      </Text>
    </Flex>
  );
}
