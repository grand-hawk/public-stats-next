import { Box, Flex, Span } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import PremiumIcon from '@/components/features/vehicles/premiumIcon';
import VehicleImage from '@/components/features/vehicles/vehicleImage';
import { DURATION_BASE, EASE } from '@/components/layout/shell/constants';
import { FOCUS_RING_CSS, TRUNCATE_CSS } from '@/components/ui/styles';

import type { PremiumType } from '@/components/features/vehicles/premiumIcon';
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

const MEDIA_CSS: SystemStyleObject = {
  position: 'relative',
  aspectRatio: '2 / 1',
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

const ROLE_CSS: SystemStyleObject = {
  ...TRUNCATE_CSS,
  display: 'block',
  fontSize: '11px',
  lineHeight: '15px',
};

export default function VehicleCell({
  initials,
  name,
  premium,
  role,
  slug,
}: {
  initials: string;
  name: string;
  premium?: PremiumType;
  role?: string;
  slug: string;
}) {
  return (
    <Box asChild css={TILE_CSS}>
      <NextLink href={`/${initials}/vehicles/${slug}`} prefetch={false}>
        <Box css={MEDIA_CSS}>
          <VehicleImage
            fill
            name={name}
            placeholder="empty"
            sizes="200px"
            slug={slug}
          />
        </Box>

        {premium && (
          <Flex
            alignItems="center"
            justifyContent="center"
            css={{
              position: 'absolute',
              insetBlockStart: '4px',
              insetInlineEnd: '4px',
              width: '20px',
              height: '20px',
              borderRadius: '4px',
              backgroundColor: 'rgba(11, 11, 11, 0.65)',
            }}
          >
            <PremiumIcon premium={premium} />
          </Flex>
        )}

        <Box padding="5px 8px 6px" width="100%">
          <Span color="fg.emphasized" css={NAME_CSS} title={name}>
            {name}
          </Span>

          {role && (
            <Span color="fg.muted" css={ROLE_CSS}>
              {role}
            </Span>
          )}
        </Box>
      </NextLink>
    </Box>
  );
}
