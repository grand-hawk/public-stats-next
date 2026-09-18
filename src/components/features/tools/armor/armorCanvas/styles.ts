import { FOCUS_RING_CSS } from '@/components/ui/styles';

import type { SystemStyleObject } from '@chakra-ui/react';

export const OVERLAY_CARD_CSS: SystemStyleObject = {
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'var(--border-color-base)',
  borderRadius: '8px',
  backgroundColor:
    'color-mix(in oklch, var(--color-surface-1) 90%, transparent)',
  backdropFilter: 'blur(8px)',
};

export const RESET_BUTTON_CSS: SystemStyleObject = {
  ...OVERLAY_CARD_CSS,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  height: '32px',
  paddingInline: '12px',
  borderRadius: '4px',
  color: 'fg.muted',
  fontSize: '0.875rem',
  fontWeight: 500,
  lineHeight: '1.375rem',
  transition:
    'background-color 100ms var(--transition-timing-function-ease, ease),' +
    ' color 100ms var(--transition-timing-function-ease, ease)',
  '& svg': { width: '14px', height: '14px', flex: 'none' },
  '&:hover': {
    color: 'var(--color-base)',
    backgroundColor: 'var(--color-surface-2)',
  },
  '&:focus-visible': FOCUS_RING_CSS,
};
