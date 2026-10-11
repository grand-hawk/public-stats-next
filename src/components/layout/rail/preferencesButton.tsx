import { Box } from '@chakra-ui/react';
import React from 'react';
import { LuSettings } from 'react-icons/lu';

import RailButton from '@/components/layout/rail/railButton';
import { usePlaceSwitch } from '@/components/layout/rail/usePlaceSwitch';
import { usePreferencesStore } from '@/stores/preferences';

export default function PreferencesButton({
  triggerRef,
}: {
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const open = usePreferencesStore((s) => s.open);
  const toggle = usePreferencesStore((s) => s.toggle);
  const { current, isStaging } = usePlaceSwitch();

  return (
    <RailButton
      ref={triggerRef}
      active={open}
      aria-controls="citizen-preferences-card"
      aria-expanded={open}
      label={
        isStaging
          ? `Toggle preferences menu (on ${current.placeName})`
          : 'Toggle preferences menu'
      }
      position="relative"
      onClick={toggle}
    >
      <LuSettings />
      {isStaging && (
        <Box
          aria-hidden
          backgroundColor="var(--color-warning)"
          borderRadius="full"
          boxShadow="0 0 0 2px var(--color-surface-0)"
          height="8px"
          position="absolute"
          right="7px"
          top="7px"
          width="8px"
        />
      )}
    </RailButton>
  );
}
