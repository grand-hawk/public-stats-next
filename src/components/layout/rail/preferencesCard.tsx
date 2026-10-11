import { Box, ClientOnly } from '@chakra-ui/react';
import React from 'react';

import BranchSelect from '@/components/layout/rail/branchSelect';
import PreferencesSection from '@/components/layout/rail/preferencesSection';
import ThemePicker from '@/components/layout/rail/themePicker';
import { useDismiss } from '@/components/layout/rail/useDismiss';
import { usePlaceSwitch } from '@/components/layout/rail/usePlaceSwitch';
import { DESKTOP_MEDIA } from '@/components/layout/shell/constants';
import { RAISED_FRAME_CSS } from '@/components/ui/styles';
import {
  useWipe,
  wipeBackdropCss,
  wipeCardCss,
  wipeContentCss,
  wipeDirectionCss,
} from '@/components/ui/wipeCard';
import { usePreferencesStore } from '@/stores/preferences';

export default function PreferencesCard({
  triggerRef,
}: {
  triggerRef: React.RefObject<HTMLElement | null>;
}) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const open = usePreferencesStore((s) => s.open);
  const close = usePreferencesStore((s) => s.close);
  const wipe = useWipe(open);
  const hasBranches = usePlaceSwitch().places.length > 1;

  useDismiss({ cardRef, onDismiss: close, open, triggerRef });

  return (
    <>
      <Box
        aria-hidden
        css={{ ...wipeBackdropCss(wipe), [DESKTOP_MEDIA]: { display: 'none' } }}
      />

      <Box
        ref={cardRef}
        aria-label="Preferences"
        id="citizen-preferences-card"
        role="dialog"
        css={{
          ...RAISED_FRAME_CSS,
          ...wipeCardCss(wipe, 'up'),
          right: '8px',
          bottom: '65px',
          width: '20rem',
          maxWidth: 'calc(100vw - 16px)',
          maxHeight: 'calc(100dvh - 57px - 16px)',
          zIndex: 350,
          [DESKTOP_MEDIA]: {
            left: '64px',
            right: 'unset',
            bottom: '8px',
            maxHeight: 'calc(100dvh - 16px)',
            zIndex: 50,
            ...wipeDirectionCss(wipe, 'right'),
          },
        }}
      >
        <Box
          css={{
            ...wipeContentCss(wipe),
            maxWidth: 'inherit',
            maxHeight: 'inherit',
            display: 'flex',
            flexDirection: 'column',
            gap: '28px',
            paddingBlock: '16px',
          }}
        >
          <PreferencesSection label="Appearance">
            <ClientOnly fallback={<Box height="74px" />}>
              <ThemePicker />
            </ClientOnly>
          </PreferencesSection>

          {hasBranches && (
            <PreferencesSection label="Game data">
              <BranchSelect />
            </PreferencesSection>
          )}
        </Box>
      </Box>
    </>
  );
}
