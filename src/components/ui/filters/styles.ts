import { QUIET_INTERACTIVE_CSS } from '@/components/ui/styles';

export const CLEAR_BUTTON_CSS = {
  marginInlineStart: 'auto',
  paddingInline: '8px',
  borderRadius: '4px',
  color: 'var(--color-progressive)',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: 500,
  ...QUIET_INTERACTIVE_CSS,
} as const;
