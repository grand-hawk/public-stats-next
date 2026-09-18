import { Box, Icon } from '@chakra-ui/react';
import React from 'react';
import { MdArrowDownward } from 'react-icons/md';

import {
  CELL_CSS,
  COUNT_CELL_CSS,
  gridCss,
  NUMBER_CELL_CSS,
} from '@/components/features/kdr/table/row';
import {
  DURATION_BASE,
  EASE,
  NARROW_MEDIA,
} from '@/components/layout/shell/constants';
import { FOCUS_RING_CSS, QUIET_HOVER_CSS } from '@/components/ui/styles';

import type { DetailedKdrItem } from '@/server/api/trpc/routers/kdr';
import type { SystemStyleObject } from '@chakra-ui/react';
import type { Header, SortingState } from '@tanstack/react-table';

const HEADER_CELL_CSS: Record<string, Record<string, unknown>> = {
  vehicle: { ...CELL_CSS, paddingInline: 0 },
  kdr: { ...NUMBER_CELL_CSS, paddingInline: 0 },
  kills: { ...COUNT_CELL_CSS, paddingInline: 0, color: 'fg.emphasized' },
  deaths: { ...COUNT_CELL_CSS, paddingInline: 0, color: 'fg.emphasized' },
};

const ROW_CSS = {
  position: 'sticky',
  insetBlockStart: 0,
  zIndex: 1,
  borderBottom: '1px solid var(--border-color-base)',
  borderTopLeftRadius: '8px',
  borderTopRightRadius: '8px',
  overflow: 'hidden',
  backgroundColor: 'var(--color-surface-2)',
  color: 'fg.emphasized',
  fontSize: '0.875rem',
  fontWeight: 600,
  lineHeight: '1.375rem',
} as const;

const SORT_BUTTON_CSS: SystemStyleObject = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  height: '40px',
  width: '100%',
  minWidth: 0,
  paddingInline: '12px',
  color: 'inherit',
  transitionProperty: 'background-color',
  transitionDuration: DURATION_BASE,
  transitionTimingFunction: EASE,
  '&:hover': QUIET_HOVER_CSS,
  '&:focus-visible': FOCUS_RING_CSS,
  '@media (prefers-reduced-motion: reduce)': { transitionDuration: '0ms' },
  [NARROW_MEDIA]: { paddingInline: '8px' },
};

const ARIA_SORT = {
  asc: 'ascending',
  desc: 'descending',
} as const;

export default function KdrTableHeader({
  headers,
  showRank,
  sorting,
}: {
  headers: Header<DetailedKdrItem, unknown>[];
  showRank: boolean;
  sorting: SortingState;
}) {
  return (
    <Box role="row" css={{ ...gridCss(showRank), ...ROW_CSS }}>
      {showRank && <Box aria-label="Rank" role="columnheader" />}

      {headers.map((header) => {
        const columnSort = sorting.find((entry) => entry.id === header.id);
        const sorted = columnSort ? (columnSort.desc ? 'desc' : 'asc') : false;

        return (
          <Box
            key={header.id}
            aria-sort={sorted ? ARIA_SORT[sorted] : 'none'}
            css={HEADER_CELL_CSS[header.id]}
            role="columnheader"
          >
            <Box
              asChild
              css={{
                ...SORT_BUTTON_CSS,
                justifyContent:
                  header.id === 'vehicle' ? 'flex-start' : 'flex-end',
              }}
            >
              <button
                type="button"
                onClick={header.column.getToggleSortingHandler()}
              >
                <Box as="span" overflow="hidden" textOverflow="ellipsis">
                  {String(header.column.columnDef.header)}
                </Box>

                <Icon
                  aria-hidden
                  color={sorted ? 'var(--color-progressive)' : 'fg.muted'}
                  flexShrink={0}
                  height="14px"
                  width="14px"
                  css={{
                    transform:
                      (sorted || header.column.getFirstSortDir()) === 'asc'
                        ? 'rotate(180deg)'
                        : undefined,
                  }}
                >
                  <MdArrowDownward />
                </Icon>
              </button>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
