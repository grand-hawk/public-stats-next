import { Box, Text, chakra } from '@chakra-ui/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import React from 'react';

import { ROW_CSS } from '@/components/features/tools/armor/controls/styles';
import VehicleIcon from '@/components/features/vehicles/vehicleIcon';
import { RAISED_FRAME_CSS } from '@/components/ui/styles';
import { simplifyString } from '@/utils/simplifyString';

import type { VehicleOption } from '@/components/features/tools/armor/controls/vehiclePicker';
import type { SystemStyleObject } from '@chakra-ui/react';

const ITEM_HEIGHT = 36;

const DROPDOWN_CSS: SystemStyleObject = {
  ...RAISED_FRAME_CSS,
  position: 'absolute',
  insetInline: 0,
  top: 'calc(100% + 4px)',
  zIndex: 50,
  maxHeight: '288px',
  overflowY: 'auto',
  padding: '4px',
  boxShadow: 'var(--box-shadow-large)',
};

const DROPDOWN_ROW_CSS: SystemStyleObject = {
  ...ROW_CSS,
  gap: '8px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
};

const VehicleListItem = React.memo(function VehicleListItem({
  isSelected,
  name,
  onClick,
  slug,
  style,
}: {
  isSelected: boolean;
  name: string;
  onClick: () => void;
  slug: string;
  style: React.CSSProperties;
}) {
  return (
    <chakra.button
      left={0}
      position="absolute"
      right={0}
      style={style}
      top={0}
      type="button"
      css={{
        ...DROPDOWN_ROW_CSS,
        color: isSelected ? 'fg.emphasized' : 'fg',
        backgroundColor: isSelected ? 'quiet.active' : 'transparent',
        fontWeight: isSelected ? 500 : 400,
      }}
      onClick={onClick}
    >
      <VehicleIcon
        flexShrink={0}
        height="20px"
        objectFit="contain"
        size={40}
        slug={slug}
        width="40px"
      />
      <Box as="span" overflow="hidden" textOverflow="ellipsis">
        {name}
      </Box>
    </chakra.button>
  );
});

interface VehicleDropdownProps {
  onSelect: (slug: string) => void;
  query: string;
  selectedSlug: string | null;
  vehicles: VehicleOption[];
}

export function VehicleDropdown({
  onSelect,
  query,
  selectedSlug,
  vehicles,
}: VehicleDropdownProps) {
  const listRef = React.useRef<HTMLDivElement>(null);

  const filtered = React.useMemo(() => {
    if (!query) return vehicles;
    const simplified = simplifyString(query);
    return vehicles.filter((v) => simplifyString(v.name).includes(simplified));
  }, [vehicles, query]);

  const rowVirtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => ITEM_HEIGHT,
    overscan: 8,
  });

  return (
    <Box ref={listRef} css={DROPDOWN_CSS}>
      {filtered.length === 0 ? (
        <Text color="fg.muted" fontSize="0.875rem" padding="8px">
          No vehicles found
        </Text>
      ) : (
        <Box
          position="relative"
          style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const v = filtered[virtualItem.index];
            return (
              <VehicleListItem
                key={v.slug}
                isSelected={v.slug === selectedSlug}
                name={v.name}
                slug={v.slug}
                style={{
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
                onClick={() => onSelect(v.slug)}
              />
            );
          })}
        </Box>
      )}
    </Box>
  );
}
