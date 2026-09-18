import { Box, HStack, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import PremiumIcon from '@/components/features/vehicles/premiumIcon';
import VehicleImage from '@/components/features/vehicles/vehicleImage';
import TeamIcon from '@/components/icons/teams';
import { DURATION_BASE, EASE } from '@/components/layout/shell/constants';

import type { PremiumType } from '@/components/features/vehicles/premiumIcon';

const CARD_HEIGHT = 182;

interface VehicleCardProps {
  href: string;
  isNew?: boolean;
  name: string;
  premium?: PremiumType;
  role: string;
  slug: string;
  team: string;
}

const CARD_CSS = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  overflow: 'clip',
  backgroundColor: 'var(--color-surface-1)',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'border',
  borderRadius: '8px',
  boxShadow: 'none',
  contentVisibility: 'auto',
  containIntrinsicSize: `auto ${CARD_HEIGHT}px`,
  transitionProperty: 'border-color, background-color',
  transitionDuration: DURATION_BASE,
  transitionTimingFunction: EASE,
  '&:hover': {
    borderColor: 'border.emphasized',
    backgroundColor: 'var(--color-surface-2)',
    textDecoration: 'none',
  },
  '&:hover img': { transform: 'var(--transform-image-hover)' },
  '@media (prefers-reduced-motion: reduce)': {
    transitionDuration: '0ms',
    '&:hover img': { transform: 'none' },
  },
} as const;

const MEDIA_CSS = {
  position: 'relative',
  aspectRatio: '16 / 9',
  overflow: 'hidden',
  backgroundColor: 'var(--color-surface-2)',
  '& img': {
    transitionProperty: 'transform',
    transitionDuration: '200ms',
    transitionTimingFunction: EASE,
  },
} as const;

const BADGE_CSS = {
  position: 'absolute',
  top: '8px',
  left: '8px',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 8px',
  backgroundColor: 'var(--color-surface-1)',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'border.subtle',
  borderRadius: '4px',
  color: 'fg.emphasized',
  fontSize: '0.875rem',
  fontWeight: 500,
  lineHeight: 1,
  whiteSpace: 'nowrap',
} as const;

export default React.memo(function VehicleCard({
  href,
  isNew,
  name,
  premium,
  role,
  slug,
  team,
}: VehicleCardProps) {
  return (
    <Box asChild css={CARD_CSS}>
      <NextLink href={href} prefetch={false}>
        <Box css={MEDIA_CSS}>
          <VehicleImage
            fill
            name={name}
            sizes="(max-width: 639px) 100vw, 360px"
            slug={slug}
            type="perspective"
          />
          {isNew && <Box css={BADGE_CSS}>New</Box>}
        </Box>

        <Box
          css={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0px',
            padding: '8px 12px 10px',
          }}
        >
          <HStack gap="8px">
            <Text
              color="fg.emphasized"
              css={{
                flex: 1,
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: '20px',
              }}
              lineClamp={1}
            >
              {name}
            </Text>
            <HStack flexShrink={0} gap="4px">
              <PremiumIcon boxSize="16px" premium={premium} />
              <TeamIcon size="16px" team={team} />
            </HStack>
          </HStack>
          <Text
            color="fg.muted"
            css={{ fontSize: '12px', lineHeight: '18px' }}
            lineClamp={1}
          >
            {role}
          </Text>
        </Box>
      </NextLink>
    </Box>
  );
});
