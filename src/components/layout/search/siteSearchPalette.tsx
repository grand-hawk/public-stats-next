import { Box, Flex, Portal } from '@chakra-ui/react';
import React from 'react';

import KeyboardHint from '@/components/layout/search/keyboardHint';
import PaletteInput from '@/components/layout/search/paletteInput';
import PaletteResults from '@/components/layout/search/paletteResults';
import { useSiteSearch } from '@/components/layout/search/useSiteSearch';
import {
  DESKTOP_MEDIA,
  DURATION_BASE,
  DURATION_MEDIUM,
  EASE_IN,
  EASE_OUT,
} from '@/components/layout/shell/constants';
import { GLASS_SURFACE_CSS } from '@/components/ui/styles';
import { closeSiteSearch, useSearchStore } from '@/stores/search';

const FINE_POINTER_MEDIA = '@media (hover: hover) and (pointer: fine)';

function useDelayedUnmount(open: boolean, delay: number) {
  const [mounted, setMounted] = React.useState(open);
  React.useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    const id = window.setTimeout(() => setMounted(false), delay);
    return () => window.clearTimeout(id);
  }, [delay, open]);
  return mounted;
}

export default function SiteSearchPalette() {
  const open = useSearchStore((s) => s.open);
  const mounted = useDelayedUnmount(open, 100);
  const [session, setSession] = React.useState(0);

  React.useEffect(() => {
    if (open) setSession((value) => value + 1);
  }, [open]);

  if (!mounted) return null;

  return <PaletteCard key={session} open={open} />;
}

function PaletteCard({ open }: { open: boolean }) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const search = useSiteSearch({
    onClose: closeSiteSearch,
    onSelect: closeSiteSearch,
  });

  React.useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
  }, [open]);

  const duration = open ? DURATION_MEDIUM : DURATION_BASE;
  const timing = open ? EASE_OUT : EASE_IN;

  return (
    <Portal>
      <Box
        aria-hidden
        onClick={closeSiteSearch}
        css={{
          position: 'fixed',
          inset: 0,
          zIndex: 400,
          background: 'var(--background-color-backdrop-light)',
          animationName: open ? 'citizen-fade-in' : 'citizen-fade-out',
          animationDuration: duration,
          animationTimingFunction: timing,
          animationFillMode: 'forwards',
        }}
      />

      <Flex
        aria-label="Search the MTC wiki"
        direction="column"
        role="search"
        css={{
          position: 'fixed',
          zIndex: 405,
          left: '8px',
          right: '8px',
          top: '8px',
          marginInline: 'auto',
          maxWidth: '56rem',
          maxHeight: 'calc(100vh - 16px)',
          overflow: 'hidden',
          fontSize: '14px',
          lineHeight: '22px',
          color: 'var(--color-base)',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'var(--border-color-base)',
          borderRadius: '8px',
          boxShadow: 'var(--box-shadow-large)',
          ...GLASS_SURFACE_CSS,
          animationName: open ? 'citizen-palette-in' : 'citizen-palette-out',
          animationDuration: duration,
          animationTimingFunction: timing,
          animationFillMode: 'forwards',
          [DESKTOP_MEDIA]: {
            top: '48px',
            maxHeight: 'calc(100vh - 96px)',
          },
        }}
      >
        <PaletteInput inputRef={inputRef} search={search} />

        <Box
          borderTopColor="border.subtle"
          borderTopStyle="solid"
          borderTopWidth="1px"
          minHeight={0}
          overflow="hidden"
        >
          <PaletteResults search={search} />
        </Box>

        <Flex
          borderTopColor="border.subtle"
          borderTopStyle="solid"
          borderTopWidth="1px"
          color="fg.muted"
          gap="12px"
          justifyContent="flex-end"
          css={{
            display: 'none',
            padding: '12px 16px',
            fontSize: '14px',
            lineHeight: '22px',
            [FINE_POINTER_MEDIA]: { display: 'flex' },
          }}
        >
          <KeyboardHint keys={['↵']} label="Select" />
          <KeyboardHint keys={['↑', '↓']} label="Navigate" />
          <KeyboardHint keys={['esc']} label="Close" />
        </Flex>
      </Flex>
    </Portal>
  );
}
