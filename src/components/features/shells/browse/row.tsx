import { Box, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import ShellIcon from '@/components/features/shells/shellIcon';
import { getShellIcon } from '@/components/icons/shells';
import { NARROW_MEDIA } from '@/components/layout/shell/constants';

export const HEADING_HEIGHT = 56;
export const ROW_HEIGHT = 40;

interface ShellRowProps {
  damage: number;
  displayType: string;
  href: string;
  isLast: boolean;
  maxPenetration: number;
  name: string;
  velocity: number;
}

const GRID_CSS = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) 128px 104px 104px 96px',
  alignItems: 'center',
  height: `${ROW_HEIGHT}px`,
  borderInlineWidth: '1px',
  borderInlineStyle: 'solid',
  borderColor: 'border',
  backgroundColor: 'var(--color-surface-1)',
  fontSize: '0.875rem',
  lineHeight: '1.375rem',
  [NARROW_MEDIA]: {
    gridTemplateColumns: 'minmax(0, 1fr) 76px 84px 68px',
  },
} as const;

const CELL_CSS = {
  minWidth: 0,
  padding: '0 12px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  [NARROW_MEDIA]: { padding: '0 8px' },
} as const;

const NUMBER_CELL_CSS = {
  ...CELL_CSS,
  textAlign: 'end',
  fontVariantNumeric: 'tabular-nums',
} as const;

const TYPE_CELL_CSS = {
  ...CELL_CSS,
  color: 'fg.muted',
  [NARROW_MEDIA]: { display: 'none' },
} as const;

const UNIT_CSS = {
  marginInlineStart: '4px',
  color: 'fg.muted',
  fontSize: '12px',
} as const;

const HEADER_ROW_CSS = {
  ...GRID_CSS,
  borderWidth: '1px',
  borderStyle: 'solid',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
  backgroundColor: 'var(--color-surface-2)',
  color: 'fg.emphasized',
  fontWeight: 600,
} as const;

const LEAD_CSS = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  minWidth: 0,
  padding: '0 12px',
  [NARROW_MEDIA]: { padding: '0 8px', gap: '8px' },
} as const;

export function ShellColumnsRow() {
  return (
    <Box aria-hidden css={HEADER_ROW_CSS}>
      <Box css={CELL_CSS}>Shell</Box>
      <Box css={{ ...TYPE_CELL_CSS, color: 'fg.emphasized' }}>Type</Box>
      <Box css={NUMBER_CELL_CSS}>Penetration</Box>
      <Box css={NUMBER_CELL_CSS}>Velocity</Box>
      <Box css={NUMBER_CELL_CSS}>Damage</Box>
    </Box>
  );
}

export default React.memo(function ShellRow({
  damage,
  displayType,
  href,
  isLast,
  maxPenetration,
  name,
  velocity,
}: ShellRowProps) {
  const shellIcon = getShellIcon(displayType);

  return (
    <Box
      asChild
      css={{
        ...GRID_CSS,
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: isLast
          ? 'var(--border-color-base)'
          : 'var(--border-color-subtle)',
        borderBottomLeftRadius: isLast ? '8px' : 0,
        borderBottomRightRadius: isLast ? '8px' : 0,
        color: 'fg',
        '&:hover': {
          backgroundColor: 'var(--color-surface-1--hover)',
          textDecoration: 'none',
        },
      }}
    >
      <NextLink href={href} prefetch={false}>
        <Box css={LEAD_CSS}>
          {shellIcon && (
            <Box flexShrink={0}>
              <ShellIcon alt="" size={24} src={shellIcon} />
            </Box>
          )}
          <Text
            as="span"
            color="fg.emphasized"
            css={{
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontWeight: 500,
            }}
          >
            {name}
          </Text>
        </Box>

        <Box css={TYPE_CELL_CSS}>{displayType}</Box>

        <Box css={NUMBER_CELL_CSS}>
          {maxPenetration}
          <Box as="span" css={UNIT_CSS}>
            mm
          </Box>
        </Box>

        <Box css={NUMBER_CELL_CSS}>
          {velocity}
          <Box as="span" css={UNIT_CSS}>
            m/s
          </Box>
        </Box>

        <Box css={NUMBER_CELL_CSS}>
          {damage}
          <Box as="span" css={UNIT_CSS}>
            dmg
          </Box>
        </Box>
      </NextLink>
    </Box>
  );
});
