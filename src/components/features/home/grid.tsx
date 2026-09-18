import { Box } from '@chakra-ui/react';
import React from 'react';

import {
  GUTTER_CSS,
  MEASURE,
  MIDDLE_MEDIA,
  NARROW_MEDIA,
} from '@/components/layout/shell/constants';

import type { BoxProps, SystemStyleObject } from '@chakra-ui/react';

interface BandProps extends Omit<BoxProps, 'css'> {
  css?: SystemStyleObject;
}

export function Band({ css, ...props }: BandProps) {
  return (
    <Box
      position="relative"
      width="100%"
      {...props}
      css={{ ...GUTTER_CSS, ...css }}
    />
  );
}

export function BandInner({ css, ...props }: BandProps) {
  return (
    <Box
      marginInline="auto"
      maxWidth={MEASURE}
      width="100%"
      {...props}
      css={css}
    />
  );
}

export function BandGrid({ css, ...props }: BandProps) {
  return (
    <Box
      alignItems="stretch"
      display="grid"
      gap="16px"
      gridTemplateColumns="repeat(12, minmax(0, 1fr))"
      width="100%"
      {...props}
      css={{ [NARROW_MEDIA]: { gridTemplateColumns: '1fr' }, ...css }}
    />
  );
}

export const spanRead = {
  gridColumn: 'span 8',
  [MIDDLE_MEDIA]: { gridColumn: 'span 6' },
  [NARROW_MEDIA]: { gridColumn: 'auto' },
} as const;

export const spanAside = {
  gridColumn: 'span 4',
  [MIDDLE_MEDIA]: { gridColumn: 'span 6' },
  [NARROW_MEDIA]: { gridColumn: 'auto' },
} as const;

export const spanFull = {
  gridColumn: 'span 12',
  [NARROW_MEDIA]: { gridColumn: 'auto' },
} as const;
