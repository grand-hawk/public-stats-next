import { Box, Icon, Text, chakra } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { LuSlidersHorizontal, LuX } from 'react-icons/lu';

import { useDismiss } from '@/components/layout/rail/useDismiss';
import { DESKTOP_MEDIA } from '@/components/layout/shell/constants';
import {
  FOCUS_RING_CSS,
  GLASS_SURFACE_CSS,
  QUIET_INTERACTIVE_CSS,
} from '@/components/ui/styles';
import {
  useWipe,
  wipeBackdropCss,
  wipeCardCss,
  wipeContentCss,
} from '@/components/ui/wipeCard';

export interface FilterSheetProps {
  activeCount: number;
  children: React.ReactNode;
  resultLabel: string;
}

const BAR_CSS = {
  position: 'sticky',
  top: 0,
  zIndex: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  minHeight: '52px',
  marginBlockEnd: '12px',
  marginInline: '-16px',
  paddingInline: '16px',
  backgroundColor: 'var(--color-surface-0)',
  borderBlockEndWidth: '1px',
  borderBlockEndStyle: 'solid',
  borderBlockEndColor: 'var(--border-color-subtle)',
  color: 'fg.muted',
  fontSize: '0.875rem',
  lineHeight: '1.375rem',
  fontVariantNumeric: 'tabular-nums',
  '@media (min-width: 640px)': {
    marginInline: '-24px',
    paddingInline: '24px',
  },
} as const;

const TRIGGER_CSS = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  flexShrink: 0,
  height: '36px',
  paddingInline: '12px',
  backgroundColor: 'var(--color-surface-2)',
  borderRadius: '4px',
  color: 'fg.emphasized',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: 500,
  lineHeight: '1.375rem',
  '&:hover': { backgroundColor: 'var(--color-surface-3)' },
  '&:active': { backgroundColor: 'var(--color-surface-4)' },
  '&:focus-visible': { ...FOCUS_RING_CSS, outline: 'none' },
} as const;

const BADGE_CSS = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '20px',
  height: '20px',
  paddingInline: '4px',
  backgroundColor: 'var(--background-color-progressive)',
  borderRadius: '9999px',
  color: 'var(--color-inverted-primary)',
  fontSize: '12px',
  fontWeight: 500,
  fontVariantNumeric: 'tabular-nums',
  lineHeight: 1,
} as const;

const HEADER_CSS = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px',
  color: 'fg.emphasized',
  fontSize: '0.875rem',
  fontWeight: 500,
  lineHeight: '1.375rem',
} as const;

const CLOSE_CSS = {
  display: 'grid',
  placeItems: 'center',
  marginInlineStart: 'auto',
  width: '32px',
  height: '32px',
  borderRadius: '4px',
  color: 'fg.muted',
  cursor: 'pointer',
  ...QUIET_INTERACTIVE_CSS,
} as const;

export default function FilterSheet({
  activeCount,
  children,
  resultLabel,
}: FilterSheetProps) {
  const router = useRouter();
  const cardRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [open, setOpen] = React.useState(false);
  const wipe = useWipe(open);

  useDismiss({
    cardRef,
    onDismiss: () => setOpen(false),
    open,
    triggerRef,
  });

  React.useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    router.events.on('routeChangeStart', close);
    return () => router.events.off('routeChangeStart', close);
  }, [open, router.events]);

  React.useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <Box css={{ display: 'contents', [DESKTOP_MEDIA]: { display: 'none' } }}>
      <Box css={BAR_CSS}>
        <Text as="span">{resultLabel}</Text>
        <chakra.button
          ref={triggerRef}
          aria-expanded={open}
          css={TRIGGER_CSS}
          type="button"
          onClick={() => setOpen((previous) => !previous)}
        >
          <Icon as={LuSlidersHorizontal} boxSize="16px" />
          <Text as="span">Filters</Text>
          {activeCount > 0 && (
            <Box as="span" css={BADGE_CSS}>
              {activeCount}
            </Box>
          )}
        </chakra.button>
      </Box>

      <Box aria-hidden css={wipeBackdropCss(wipe)} />

      <Box
        ref={cardRef}
        aria-label="Filters"
        role="dialog"
        css={{
          ...GLASS_SURFACE_CSS,
          ...wipeCardCss(wipe, 'up'),
          left: '8px',
          right: '8px',
          bottom: '65px',
          zIndex: 340,
          maxHeight: 'calc(100dvh - 57px - 96px)',
          boxShadow: 'var(--box-shadow-large)',
          '@media (prefers-reduced-transparency: reduce)': {
            backgroundColor: 'var(--color-surface-1)',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
          },
        }}
      >
        <Box css={{ ...wipeContentCss(wipe), maxHeight: 'inherit' }}>
          <Box css={HEADER_CSS}>
            <Text as="span">Filters</Text>
            <chakra.button
              aria-label="Close filters"
              css={CLOSE_CSS}
              type="button"
              onClick={() => setOpen(false)}
            >
              <Icon as={LuX} boxSize="16px" />
            </chakra.button>
          </Box>

          <Box padding="0 8px 8px">{children}</Box>
        </Box>
      </Box>
    </Box>
  );
}
