import { Box, Table } from '@chakra-ui/react';
import React from 'react';

import type {
  BoxProps,
  SystemStyleObject,
  TableRootProps,
} from '@chakra-ui/react';

export const WIKITABLE_CSS: SystemStyleObject = {
  width: '100%',
  fontSize: '0.875rem',
  lineHeight: '1.375rem',
  '& tr': {
    background: 'none',
  },
  '& thead tr, & tbody tr:has(td[data-title])': {
    background: 'var(--color-surface-2)',
  },
  '& tbody tr': {
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderColor: 'var(--border-color-subtle)',
  },
  '& tbody tr:first-of-type': {
    borderTopWidth: 0,
  },
  '& thead + tbody tr:first-of-type': {
    borderTopWidth: '1px',
    borderColor: 'var(--border-color-base)',
  },
  '& tbody tr:not(:has(td[data-title])):hover': {
    background: 'var(--background-color-button-quiet--hover)',
  },
  '& td, & th': {
    height: '40px',
    padding: '8px 12px',
    borderWidth: 0,
    color: 'fg',
    fontWeight: 400,
    textAlign: 'start',
  },
  '& th': {
    color: 'fg.emphasized',
    fontWeight: 600,
  },
  '& td:not(:first-of-type), & th:not(:first-of-type)': {
    fontVariantNumeric: 'tabular-nums',
    textAlign: 'end',
  },
  '& td[data-title]': {
    color: 'fg.emphasized',
    fontWeight: 600,
  },
  '& tbody tr:not(:first-of-type).with-padding-top': {
    borderColor: 'var(--border-color-base)',
  },
  '& a': {
    color: 'var(--color-progressive)',
    textDecoration: 'none',
    '&:hover': { textDecoration: 'underline' },
  },
};

export interface WikiTableFrameProps extends BoxProps {
  flush?: boolean;
}

export function WikiTableFrame({ flush, ...props }: WikiTableFrameProps) {
  return (
    <Box
      className={flush ? undefined : 'mtc-frame'}
      backgroundColor={flush ? undefined : 'var(--color-surface-1)'}
      borderColor="border"
      borderRadius={flush ? undefined : '8px'}
      borderWidth={flush ? 0 : '1px'}
      overflow="auto hidden"
      width="100%"
      {...props}
    />
  );
}

export interface StatsRootProps extends TableRootProps {
  children?: React.ReactNode;
  flush?: boolean;
  frameProps?: WikiTableFrameProps;
}

export function StatsRoot({
  children,
  css,
  flush,
  frameProps,
  ...props
}: StatsRootProps) {
  return (
    <WikiTableFrame flush={flush} {...frameProps}>
      <Table.Root
        background="none"
        size="sm"
        {...props}
        css={{ ...WIKITABLE_CSS, ...css }}
      >
        <Table.Body>{children}</Table.Body>
      </Table.Root>
    </WikiTableFrame>
  );
}
