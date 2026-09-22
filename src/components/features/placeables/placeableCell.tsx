import { Box, Span } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import PlaceableImage from '@/components/features/placeables/placeableImage';
import { DURATION_BASE, EASE } from '@/components/layout/shell/constants';
import { FOCUS_RING_CSS, TRUNCATE_CSS } from '@/components/ui/styles';
import { PLACEABLES_PATH, placeableDisplayName } from '@/utils/placeables';

import type { SystemStyleObject } from '@chakra-ui/react';

const TILE_CSS: SystemStyleObject = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  width: '100%',
  backgroundColor: 'var(--color-surface-2)',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'border.subtle',
  borderRadius: '4px',
  overflow: 'hidden',
  transitionProperty: 'border-color, background-color',
  transitionDuration: DURATION_BASE,
  transitionTimingFunction: EASE,
  '&:hover': {
    backgroundColor: 'var(--color-surface-3)',
    borderColor: 'border.emphasized',
    textDecoration: 'none',
  },
  '&:hover img': { transform: 'scale(1.03)' },
  '&:focus-visible': { ...FOCUS_RING_CSS, outline: 'none' },
  '@media (prefers-reduced-motion: reduce)': {
    transitionDuration: '0ms',
    '&:hover img': { transform: 'none' },
  },
};

// the renders are transparent and vary in shape, so contain them rather than crop
const MEDIA_CSS: SystemStyleObject = {
  position: 'relative',
  aspectRatio: '4 / 3',
  overflow: 'hidden',
  backgroundColor: 'var(--color-surface-3)',
  '& img': {
    transitionProperty: 'transform',
    transitionDuration: DURATION_BASE,
    transitionTimingFunction: EASE,
  },
};

const NAME_CSS: SystemStyleObject = {
  ...TRUNCATE_CSS,
  display: 'block',
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: '16px',
};

export default function PlaceableCell({
  initials,
  name,
  slug,
}: {
  initials: string;
  name: string;
  slug: string;
}) {
  const label = placeableDisplayName(name);

  return (
    <Box asChild css={TILE_CSS}>
      <NextLink
        href={`/${initials}${PLACEABLES_PATH}/${slug}`}
        prefetch={false}
      >
        <Box css={MEDIA_CSS}>
          <PlaceableImage
            fill
            name={label}
            placeholder="empty"
            sizes="200px"
            slug={slug}
          />
        </Box>

        <Box padding="5px 8px 6px" width="100%">
          <Span color="fg.emphasized" css={NAME_CSS} title={label}>
            {label}
          </Span>
        </Box>
      </NextLink>
    </Box>
  );
}
