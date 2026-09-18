import { Box, Text, chakra } from '@chakra-ui/react';
import React from 'react';
import { LuChevronDown, LuChevronUp } from 'react-icons/lu';

import { ANGLES } from '@/components/features/tools/armor/controls/angles';
import { MOBILE_MEDIA } from '@/components/features/tools/armor/controls/styles';
import VehicleIcon from '@/components/features/vehicles/vehicleIcon';
import { FOCUS_RING_CSS } from '@/components/ui/styles';

import type { ArmorAngle } from '@/utils/getVehicleImage';
import type { SystemStyleObject } from '@chakra-ui/react';

const MOBILE_HEADER_CSS: SystemStyleObject = {
  display: 'none',
  alignItems: 'center',
  gap: '8px',
  minHeight: '48px',
  paddingInline: '12px',
  cursor: 'pointer',
  '&:hover': { backgroundColor: 'quiet.hover' },
  '&:focus-visible': FOCUS_RING_CSS,
  [MOBILE_MEDIA]: { display: 'flex' },
};

interface MobileHeaderProps {
  angle: ArmorAngle;
  expanded: boolean;
  onToggle: () => void;
  selectedName: string;
  selectedSlug: string | null;
}

export function MobileHeader({
  angle,
  expanded,
  onToggle,
  selectedName,
  selectedSlug,
}: MobileHeaderProps) {
  return (
    <chakra.button
      css={{
        ...MOBILE_HEADER_CSS,
        borderBottom: expanded
          ? '1px solid var(--border-color-subtle)'
          : 'none',
      }}
      type="button"
      onClick={onToggle}
    >
      {selectedSlug && (
        <VehicleIcon flexShrink={0} size={20} slug={selectedSlug} />
      )}
      <Text
        as="span"
        color="fg.emphasized"
        fontSize="0.875rem"
        fontWeight={500}
        lineHeight="1.375rem"
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
        {selectedName || 'Settings'}
      </Text>
      <Text as="span" color="fg.muted" fontSize="0.75rem" lineHeight="1.25rem">
        {ANGLES.find((a) => a.value === angle)?.label}
      </Text>
      <Box as="span" color="fg.muted" marginInlineStart="auto">
        {expanded ? <LuChevronUp size={16} /> : <LuChevronDown size={16} />}
      </Box>
    </chakra.button>
  );
}
