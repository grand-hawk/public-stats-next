import { Box, Span } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import TeamIcon from '@/components/icons/teams';
import { DURATION_BASE, EASE } from '@/components/layout/shell/constants';
import {
  FOCUS_RING_CSS,
  RAISED_FRAME_CSS,
  TRUNCATE_CSS,
} from '@/components/ui/styles';
import { loadoutDisplayName } from '@/utils/loadoutDisplayName';

import type { SystemStyleObject } from '@chakra-ui/react';

const CARD_CSS: SystemStyleObject = {
  ...RAISED_FRAME_CSS,
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  overflow: 'hidden',
  transitionProperty: 'border-color, background-color',
  transitionDuration: DURATION_BASE,
  transitionTimingFunction: EASE,
  '&:hover': {
    backgroundColor: 'surface.hover',
    borderColor: 'border.emphasized',
    textDecoration: 'none',
  },
  '&:focus-visible': { ...FOCUS_RING_CSS, outline: 'none' },
  '@media (prefers-reduced-motion: reduce)': { transitionDuration: '0ms' },
};

const ROW_CSS: SystemStyleObject = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  minWidth: 0,
  height: '40px',
  paddingInline: '10px',
  borderRadius: '4px',
  color: 'fg.emphasized',
  fontSize: '0.875rem',
  fontWeight: 500,
  lineHeight: '1.375rem',
  transitionProperty: 'background-color',
  transitionDuration: DURATION_BASE,
  transitionTimingFunction: EASE,
  '&:hover': { backgroundColor: 'quiet.hover', textDecoration: 'none' },
  '&:focus-visible': { ...FOCUS_RING_CSS, outline: 'none' },
  '@media (prefers-reduced-motion: reduce)': { transitionDuration: '0ms' },
};

const NAME_CSS: SystemStyleObject = {
  ...TRUNCATE_CSS,
  display: 'block',
  fontSize: '1rem',
  fontWeight: 500,
  lineHeight: '1.625rem',
};

const LOADOUTS_CSS: SystemStyleObject = {
  ...TRUNCATE_CSS,
  display: 'block',
  fontSize: '0.875rem',
  lineHeight: '1.375rem',
};

export function TeamCard({
  href,
  loadouts,
  name,
}: {
  href: string;
  loadouts: string[];
  name: string;
}) {
  return (
    <Box asChild css={CARD_CSS}>
      <NextLink href={href} prefetch={false}>
        <Box
          css={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            minWidth: 0,
            padding: '16px',
          }}
        >
          <TeamIcon size="32px" team={name} />

          <Box minWidth={0}>
            <Span color="fg.emphasized" css={NAME_CSS}>
              {name}
            </Span>

            <Span color="fg.muted" css={LOADOUTS_CSS}>
              {loadouts.length > 0
                ? loadouts.map(loadoutDisplayName).join(' · ')
                : 'No loadouts'}
            </Span>
          </Box>
        </Box>
      </NextLink>
    </Box>
  );
}

export function LoreTeamRow({ href, name }: { href: string; name: string }) {
  return (
    <Box asChild css={ROW_CSS}>
      <NextLink href={href} prefetch={false}>
        <TeamIcon size="20px" team={name} />

        <Span css={{ ...TRUNCATE_CSS, minWidth: 0 }}>{name}</Span>
      </NextLink>
    </Box>
  );
}
