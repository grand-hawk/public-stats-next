import { Box, Text, chakra } from '@chakra-ui/react';
import React from 'react';
import { LuX } from 'react-icons/lu';

import { ICON_BUTTON_CSS } from '@/components/features/tools/armor/controls/styles';
import VehicleIcon from '@/components/features/vehicles/vehicleIcon';
import { FOCUS_RING_CSS, RAISED_FRAME_CSS } from '@/components/ui/styles';

import type { SystemStyleObject } from '@chakra-ui/react';

const SELECTED_ROW_CSS: SystemStyleObject = {
  ...RAISED_FRAME_CSS,
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  paddingInline: '8px',
  borderRadius: '4px',
  cursor: 'pointer',
  textAlign: 'start',
  transition:
    'background-color 100ms var(--transition-timing-function-ease, ease)',
  '&:hover': { backgroundColor: 'var(--color-surface-1--hover)' },
  '&:focus-visible': FOCUS_RING_CSS,
};

const CLEAR_BUTTON_CSS: SystemStyleObject = {
  ...ICON_BUTTON_CSS,
  position: 'relative',
  marginInlineStart: 'auto',
  width: '24px',
  height: '24px',
  '& svg': { width: '14px', height: '14px' },
};

interface SelectedVehicleRowProps {
  name: string;
  onClear: () => void;
  onOpen: () => void;
  slug: string;
}

export function SelectedVehicleRow({
  name,
  onClear,
  onOpen,
  slug,
}: SelectedVehicleRowProps) {
  return (
    <Box css={SELECTED_ROW_CSS}>
      <chakra.button
        aria-label={`Change vehicle, currently ${name}`}
        type="button"
        css={{
          position: 'absolute',
          inset: 0,
          borderRadius: '4px',
          cursor: 'pointer',
          '&:focus-visible': FOCUS_RING_CSS,
        }}
        onClick={onOpen}
      />
      <VehicleIcon
        flexShrink={0}
        height="20px"
        objectFit="contain"
        size={40}
        slug={slug}
        width="40px"
      />
      <Text
        as="span"
        color="fg.emphasized"
        fontSize="0.875rem"
        fontWeight={500}
        lineHeight="1.375rem"
        minWidth={0}
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
        {name}
      </Text>
      <chakra.button
        aria-label="Clear vehicle"
        css={CLEAR_BUTTON_CSS}
        type="button"
        onClick={onClear}
      >
        <LuX />
      </chakra.button>
    </Box>
  );
}
