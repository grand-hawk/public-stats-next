import { NARROW_MEDIA } from '@/components/layout/shell/constants';

import type { SystemStyleObject } from '@chakra-ui/react';

const QUIET_HOVER = 'var(--background-color-button-quiet--hover)';

export const COLUMN_MIN_PX = 220;
export const COLUMN_MAX_PX = 300;

export const FRAME_CSS: SystemStyleObject = {
  '--compare-label-width': '220px',
  width: '100%',
  backgroundColor: 'var(--color-surface-1)',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'var(--border-color-base)',
  borderRadius: '8px',
  overflow: 'auto hidden',
  [NARROW_MEDIA]: { '--compare-label-width': '120px' },
};

export const TABLE_CSS: SystemStyleObject = {
  width: '100%',
  tableLayout: 'fixed',
  borderCollapse: 'separate',
  borderSpacing: 0,
  fontSize: '0.875rem',
  lineHeight: '1.375rem',
  '& th, & td': {
    padding: '8px 12px',
    borderWidth: 0,
    fontWeight: 400,
    textAlign: 'start',
    verticalAlign: 'middle',
  },
  '& thead th': {
    padding: '8px',
    backgroundColor: 'var(--color-surface-2)',
    verticalAlign: 'top',
  },
  '& thead th[data-add]': {
    backgroundColor: 'var(--color-surface-1)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--border-color-subtle)',
    textAlign: 'center',
    verticalAlign: 'middle',
  },
  '& thead th:first-of-type': {
    position: 'sticky',
    insetInlineStart: 0,
    zIndex: 2,
    borderInlineEndWidth: '1px',
    borderInlineEndStyle: 'solid',
    borderInlineEndColor: 'var(--border-color-subtle)',
  },
  '& tbody td': {
    height: '40px',
    color: 'fg',
    fontVariantNumeric: 'tabular-nums',
    borderBlockStartWidth: '1px',
    borderBlockStartStyle: 'solid',
    borderBlockStartColor: 'var(--border-color-subtle)',
  },
  '& tbody tr:first-of-type td': {
    borderBlockStartColor: 'var(--border-color-base)',
  },
  '& tbody td:first-of-type': {
    position: 'sticky',
    insetInlineStart: 0,
    zIndex: 1,
    backgroundColor: 'var(--color-surface-1)',
    color: 'fg.muted',
    borderInlineEndWidth: '1px',
    borderInlineEndStyle: 'solid',
    borderInlineEndColor: 'var(--border-color-subtle)',
  },
  '& tbody tr[data-group] td': {
    height: '36px',
    backgroundColor: 'var(--color-surface-2)',
    color: 'fg.emphasized',
    fontWeight: 600,
  },
  '& tbody tr:not([data-group]):hover td': { backgroundColor: 'quiet.hover' },
  '& tbody tr:not([data-group]):hover td:first-of-type': {
    backgroundColor: 'var(--color-surface-1)',
    backgroundImage: `linear-gradient(${QUIET_HOVER}, ${QUIET_HOVER})`,
  },
  '& a': {
    color: 'var(--color-progressive)',
    textDecoration: 'none',
    '&:hover': { textDecoration: 'underline' },
  },
};

export const EMPTY_CSS: SystemStyleObject = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
  padding: '48px 24px',
  textAlign: 'center',
};
