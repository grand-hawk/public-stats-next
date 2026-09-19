import { Box, Text } from '@chakra-ui/react';
import React from 'react';

import HomeRowLink from '@/components/features/home/rowLink';
import {
  DURATION_BASE,
  EASE,
  NARROW_MEDIA,
} from '@/components/layout/shell/constants';

const HAIRLINE = {
  borderBlockStartWidth: '1px',
  borderBlockStartStyle: 'solid',
  borderBlockStartColor: 'var(--border-color-subtle)',
} as const;

export function LinkRowGrid({
  children,
  columns = 2,
}: {
  children: React.ReactNode;
  columns?: 1 | 2;
}) {
  return (
    <Box
      css={{
        display: 'grid',
        flexGrow: 1,
        gridAutoRows: 'minmax(min-content, 1fr)',
        gridTemplateColumns: columns === 2 ? '1fr 1fr' : '1fr',
        gap: '0 16px',
        '& > *:nth-child(n + 2)': columns === 1 ? HAIRLINE : undefined,
        '& > *:nth-child(n + 3)': columns === 2 ? HAIRLINE : undefined,
        [NARROW_MEDIA]: {
          gridTemplateColumns: '1fr',
          '& > *:nth-child(n + 2)': HAIRLINE,
        },
      }}
    >
      {children}
    </Box>
  );
}

export function LinkRow({
  blurb,
  href,
  icon,
  label,
}: {
  blurb: string;
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Box css={{ display: 'flex', minWidth: 0, paddingBlock: '2px' }}>
      <HomeRowLink
        css={{
          paddingBlock: '6px',
          '& svg': {
            color: 'var(--color-subtle)',
            transitionProperty: 'color',
            transitionDuration: DURATION_BASE,
            transitionTimingFunction: EASE,
          },
          '&:hover svg': { color: 'var(--color-base)' },
        }}
        href={href}
      >
        <Box css={{ flex: 'none' }}>{icon}</Box>
        <Box minWidth={0}>
          <Text
            color="fg.emphasized"
            css={{ fontSize: '14px', fontWeight: 500 }}
            lineHeight="22px"
          >
            {label}
          </Text>
          <Text
            color="fg.muted"
            css={{ fontSize: '12px', lineHeight: '20px' }}
            lineClamp={1}
          >
            {blurb}
          </Text>
        </Box>
      </HomeRowLink>
    </Box>
  );
}
