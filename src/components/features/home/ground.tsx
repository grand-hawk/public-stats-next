import { Box } from '@chakra-ui/react';
import React from 'react';

import {
  GROUND_DOT,
  GROUND_MAJOR,
  GROUND_MINOR,
} from '@/components/features/home/palette';
import { GROUND_MEDIA } from '@/components/layout/shell/constants';

import type { SystemStyleObject } from '@chakra-ui/react';

const DOT =
  'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cmVjdCB4PSI4IiB5PSI4IiB3aWR0aD0iMSIgaGVpZ2h0PSIxIi8+PC9zdmc+")';

const SKY_BAND: SystemStyleObject = {
  position: 'absolute',
  insetBlock: 0,
  inlineSize: 'calc(50% - 588px)',
  backgroundColor: GROUND_DOT,
  maskImage: DOT,
  maskSize: '16px 16px',
  maskRepeat: 'repeat',
  WebkitMaskImage: DOT,
  WebkitMaskSize: '16px 16px',
  WebkitMaskRepeat: 'repeat',
};

const TAPE_BAND: SystemStyleObject = {
  position: 'absolute',
  insetBlock: 0,
  inlineSize: '16px',
  backgroundImage:
    'repeating-linear-gradient(to bottom, var(--home-minor), var(--home-minor) 1px, transparent 1px, transparent 12px), repeating-linear-gradient(to bottom, var(--home-major), var(--home-major) 1px, transparent 1px, transparent 60px)',
  backgroundSize: '8px 100%, 16px 100%',
  backgroundRepeat: 'repeat-y',
};

export default function Ground() {
  return (
    <>
      <Box
        aria-hidden
        css={{
          position: 'absolute',
          inset: 0,
          zIndex: -2,
          pointerEvents: 'none',
          [GROUND_MEDIA]: { display: 'none' },
        }}
        data-ground="sky"
      >
        <Box
          css={{
            ...SKY_BAND,
            left: 0,
            maskPosition: 'right top',
            WebkitMaskPosition: 'right top',
          }}
          data-ground="sky-left"
        />
        <Box
          css={{
            ...SKY_BAND,
            right: 0,
            maskPosition: 'left top',
            WebkitMaskPosition: 'left top',
          }}
          data-ground="sky-right"
        />
      </Box>

      <Box
        aria-hidden
        css={{
          '--home-minor': GROUND_MINOR,
          '--home-major': GROUND_MAJOR,
          '--home-tape-left': 'calc(50% - 565px)',
          '--home-tape-right': 'calc(50% + 595px)',
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          pointerEvents: 'none',
          [GROUND_MEDIA]: { display: 'none' },
        }}
        data-ground="tape"
      >
        <Box
          css={{
            ...TAPE_BAND,
            left: 'var(--home-tape-left)',
            backgroundPosition: 'left top, left top',
          }}
          data-ground="tape-left"
        />
        <Box
          css={{
            ...TAPE_BAND,
            left: 'var(--home-tape-right)',
            backgroundPosition: 'right top, right top',
          }}
          data-ground="tape-right"
        />
      </Box>
    </>
  );
}
