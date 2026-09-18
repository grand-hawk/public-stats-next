import { Box, FormatNumber } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import TeamIcon from '@/components/icons/teams';
import { NARROW_MEDIA } from '@/components/layout/shell/constants';
import { FOCUS_RING_CSS, TRUNCATE_CSS } from '@/components/ui/styles';

const ROW_HEIGHT = 40;

export function gridCss(showRank: boolean) {
  return {
    display: 'grid',
    alignItems: 'center',
    height: `${ROW_HEIGHT}px`,
    gridTemplateColumns: showRank
      ? '48px minmax(0, 1fr) 88px 120px 120px'
      : 'minmax(0, 1fr) 88px 120px 120px',
    [NARROW_MEDIA]: {
      gridTemplateColumns: showRank
        ? '40px minmax(0, 1fr) 88px 104px 104px'
        : 'minmax(0, 1fr) 88px 104px 104px',
    },
  } as const;
}

export const CELL_CSS = {
  ...TRUNCATE_CSS,
  minWidth: 0,
  paddingInline: '12px',
  [NARROW_MEDIA]: { paddingInline: '8px' },
} as const;

export const NUMBER_CELL_CSS = {
  ...CELL_CSS,
  textAlign: 'end',
  fontVariantNumeric: 'tabular-nums',
} as const;

export const COUNT_CELL_CSS = {
  ...NUMBER_CELL_CSS,
  color: 'fg.muted',
} as const;

const RANK_CELL_CSS = {
  ...NUMBER_CELL_CSS,
  color: 'fg.muted',
  paddingInline: '12px 8px',
  [NARROW_MEDIA]: { paddingInline: '8px 4px' },
} as const;

const LEAD_CSS = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  minWidth: 0,
  paddingInline: '12px',
  [NARROW_MEDIA]: { paddingInline: '8px' },
} as const;

const NAME_CSS = {
  ...TRUNCATE_CSS,
  minWidth: 0,
  color: 'fg',
  textDecoration: 'none',
  '&:hover': { color: 'var(--color-progressive)' },
  '&:focus-visible': FOCUS_RING_CSS,
} as const;

const KDR_CELL_CSS = {
  ...NUMBER_CELL_CSS,
  color: 'fg.emphasized',
  fontWeight: 500,
} as const;

export default React.memo(function KdrTableRow({
  deaths,
  href,
  isLast,
  kdr,
  kills,
  rank,
  showRank,
  team,
  vehicle,
}: {
  deaths: number;
  href: string;
  isLast: boolean;
  kdr: number;
  kills: number;
  rank: number;
  showRank: boolean;
  team: string;
  vehicle: string;
}) {
  return (
    <Box
      role="row"
      css={{
        ...gridCss(showRank),
        contentVisibility: 'auto',
        containIntrinsicSize: `auto ${ROW_HEIGHT}px`,
        borderBottomWidth: isLast ? 0 : '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'var(--border-color-subtle)',
        borderBottomLeftRadius: isLast ? '8px' : 0,
        borderBottomRightRadius: isLast ? '8px' : 0,
        fontSize: '0.875rem',
        lineHeight: '1.375rem',
        '&:hover': { backgroundColor: 'var(--color-surface-1--hover)' },
      }}
    >
      {showRank && (
        <Box css={RANK_CELL_CSS} role="cell">
          {rank}
        </Box>
      )}

      <Box css={LEAD_CSS} role="cell">
        <Box flexShrink={0} lineHeight={0}>
          <TeamIcon size="16px" team={team} />
        </Box>

        <Box asChild css={NAME_CSS}>
          <NextLink href={href} prefetch={false}>
            {vehicle}
          </NextLink>
        </Box>
      </Box>

      <Box css={KDR_CELL_CSS} role="cell">
        <FormatNumber
          maximumFractionDigits={2}
          minimumFractionDigits={2}
          value={kdr}
        />
      </Box>

      <Box css={COUNT_CELL_CSS} role="cell">
        <FormatNumber value={kills} />
      </Box>

      <Box css={COUNT_CELL_CSS} role="cell">
        <FormatNumber value={deaths} />
      </Box>
    </Box>
  );
});
