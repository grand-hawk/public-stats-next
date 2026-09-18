import type { SystemStyleObject } from '@chakra-ui/react';

export const FOCUS_RING_CSS: SystemStyleObject = {
  outline: '1px solid transparent',
  boxShadow: 'inset 0 0 0 1px var(--color-progressive)',
};

export const QUIET_HOVER_CSS: SystemStyleObject = {
  backgroundColor: 'quiet.hover',
};

export const QUIET_ACTIVE_CSS: SystemStyleObject = {
  backgroundColor: 'quiet.active',
};

export const QUIET_INTERACTIVE_CSS: SystemStyleObject = {
  '&:hover': QUIET_HOVER_CSS,
  '&:active': QUIET_ACTIVE_CSS,
};

export const QUIET_ROW_CSS: SystemStyleObject = {
  display: 'flex',
  alignItems: 'center',
  minHeight: '2.25rem',
  borderRadius: '4px',
  fontSize: '0.875rem',
  fontWeight: 500,
  lineHeight: '1.375rem',
};

export const RAISED_FRAME_CSS: SystemStyleObject = {
  backgroundColor: 'var(--color-surface-1)',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'var(--border-color-base)',
  borderRadius: '8px',
};

export const GLASS_SURFACE_CSS = {
  backgroundColor:
    'color-mix(in oklch, var(--color-surface-1) calc(var(--opacity-glass) * 100%), transparent)',
  backdropFilter: 'blur(8px) saturate(140%)',
  WebkitBackdropFilter: 'blur(8px) saturate(140%)',
} as const;

export const TRUNCATE_CSS: SystemStyleObject = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};
