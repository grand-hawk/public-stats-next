export const RAIL_WIDTH = '57px';
export const MEASURE = '1080px';

export const DESKTOP_MEDIA = '@media (min-width: 1120px)';
export const MOBILE_MEDIA = '@media (max-width: 1119.98px)';
export const NARROW_MEDIA = '@media (max-width: 639px)';
export const MIDDLE_MEDIA =
  '@media (min-width: 640px) and (max-width: 899.98px)';
export const SUB900_MEDIA = '@media (max-width: 899.98px)';
export const GROUND_MEDIA = '@media (max-width: 1279.98px)';

export const EASE = 'cubic-bezier(0.2, 0, 0, 1)';
export const EASE_IN = 'cubic-bezier(0.3, 0, 0.8, 0.15)';
export const EASE_OUT = 'cubic-bezier(0.05, 0.7, 0.1, 1)';
export const DURATION_BASE = '100ms';
export const DURATION_MEDIUM = '250ms';

export const GUTTER_CSS = {
  paddingInline: '16px',
  '@media (min-width: 640px)': { paddingInline: '24px' },
  '@media (min-width: 1120px)': { paddingInline: '32px' },
} as const;

export const SIDEBAR_WIDTH = '240px';
export const SIDEBAR_GAP = '20px';
export const PAGE_WIDE = '1340px';

export const FOOTER_PUSH_MIN_HEIGHT =
  'calc(100svh + var(--site-footer-height, 440px))';
