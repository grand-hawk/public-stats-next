import { Box, chakra } from '@chakra-ui/react';
import React from 'react';
import { LuCheck } from 'react-icons/lu';

import { ControlSection } from '@/components/features/tools/armor/controls/section';
import { ROW_CSS } from '@/components/features/tools/armor/controls/styles';
import { palettes } from '@/components/features/tools/armor/palettes';

import type { Palette } from '@/components/features/tools/armor/palettes';
import type { SystemStyleObject } from '@chakra-ui/react';

const PALETTE_ROW_CSS: SystemStyleObject = {
  ...ROW_CSS,
  gap: '12px',
  width: '100%',
  height: '36px',
  color: 'fg.muted',
};

const PALETTE_ROW_SELECTED_CSS: SystemStyleObject = {
  ...PALETTE_ROW_CSS,
  color: 'fg.emphasized',
  backgroundColor: 'quiet.active',
  '&:hover': { backgroundColor: 'quiet.active' },
};

function gradientFor(palette: Palette) {
  const stops = palette.stops.map(
    (s, i) =>
      `rgb(${s.r},${s.g},${s.b}) ${(i / (palette.stops.length - 1)) * 100}%`,
  );
  return `linear-gradient(to right, ${stops.join(', ')})`;
}

interface PaletteSectionProps {
  onPaletteChange: (p: Palette) => void;
  palette: Palette;
}

export function PaletteSection({
  onPaletteChange,
  palette,
}: PaletteSectionProps) {
  return (
    <ControlSection label="Palette">
      <Box>
        {palettes.map((p) => {
          const isActive = palette.name === p.name;

          return (
            <chakra.button
              key={p.name}
              aria-pressed={isActive}
              css={isActive ? PALETTE_ROW_SELECTED_CSS : PALETTE_ROW_CSS}
              type="button"
              onClick={() => onPaletteChange(p)}
            >
              <Box
                flexShrink={0}
                height="16px"
                width="48px"
                css={{ borderRadius: '4px' }}
                style={{ background: gradientFor(p) }}
              />
              <Box as="span">{p.name}</Box>
              {isActive && (
                <Box
                  as="span"
                  color="var(--color-progressive)"
                  display="flex"
                  marginInlineStart="auto"
                >
                  <LuCheck size={16} />
                </Box>
              )}
            </chakra.button>
          );
        })}
      </Box>
    </ControlSection>
  );
}
