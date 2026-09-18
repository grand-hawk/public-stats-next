import { FOCUS_RING_CSS, QUIET_INTERACTIVE_CSS } from '@/components/ui/styles';

import type { SystemStyleObject } from '@chakra-ui/react';

export const DESKTOP_MEDIA = '@media (min-width: 48em)';
export const MOBILE_MEDIA = '@media (max-width: 47.99em)';

export const SECTION_CSS: SystemStyleObject = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  paddingBlock: '12px',
  borderBottom: '1px solid var(--border-color-subtle)',
};

export const LABEL_ROW_CSS: SystemStyleObject = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  minHeight: '22px',
};

export const LABEL_CSS: SystemStyleObject = {
  color: 'fg.muted',
  fontSize: '0.875rem',
  fontWeight: 500,
  lineHeight: '1.375rem',
  letterSpacing: 'normal',
  textTransform: 'none',
};

export const ROW_CSS: SystemStyleObject = {
  display: 'flex',
  alignItems: 'center',
  paddingInline: '8px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.875rem',
  lineHeight: '1.375rem',
  textAlign: 'start',
  '&:hover': { backgroundColor: 'quiet.hover' },
  '&:focus-visible': FOCUS_RING_CSS,
};

export const QUIET_TEXT_BUTTON_CSS: SystemStyleObject = {
  display: 'inline-flex',
  alignItems: 'center',
  marginInlineStart: 'auto',
  minHeight: '24px',
  paddingInline: '8px',
  borderRadius: '4px',
  color: 'var(--color-progressive)',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: 500,
  lineHeight: '1.375rem',
  whiteSpace: 'nowrap',
  ...QUIET_INTERACTIVE_CSS,
  '&:focus-visible': FOCUS_RING_CSS,
};

export const ICON_BUTTON_CSS: SystemStyleObject = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 'none',
  width: '36px',
  height: '36px',
  borderRadius: '4px',
  color: 'fg.muted',
  cursor: 'pointer',
  transition:
    'background-color 100ms var(--transition-timing-function-ease, ease),' +
    ' color 100ms var(--transition-timing-function-ease, ease)',
  '& svg': { width: '16px', height: '16px' },
  '&:hover': { color: 'var(--color-base)', backgroundColor: 'quiet.hover' },
  '&:active': { backgroundColor: 'quiet.active' },
  '&:focus-visible': FOCUS_RING_CSS,
};
