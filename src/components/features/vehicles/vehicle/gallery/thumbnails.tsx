import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import { IMAGE_VIEWS } from '@/components/features/vehicles/vehicle/gallery/views';
import VehicleImage from '@/components/features/vehicles/vehicleImage';
import { useVehicle } from '@/hooks/providers/vehicle';

import type { GalleryImageType } from '@/components/features/vehicles/vehicle/gallery/views';
import type { VehicleImageType } from '@/utils/getVehicleImage';

export default function GalleryThumbnails({
  isTransparent,
  onSelect,
  selectedView,
}: {
  isTransparent: boolean;
  onSelect: (type: GalleryImageType) => void;
  selectedView: GalleryImageType;
}) {
  const vehicle = useVehicle();

  return (
    <Box
      backgroundColor="var(--color-surface-2)"
      overflowX="auto"
      overflowY="hidden"
      _scrollbar={{ height: '2px' }}
      _scrollbarThumb={{ borderWidth: 0 }}
    >
      <Flex gap={1} padding={1} width="max-content">
        {IMAGE_VIEWS.map(({ label, type }) => {
          const isSelected = selectedView === type;
          const thumbnailType: VehicleImageType = isTransparent
            ? `${type}_transparent`
            : type;

          return (
            <Box
              key={type}
              aria-label={`View ${label}`}
              aria-pressed={isSelected}
              as="button"
              borderWidth="2px"
              borderColor={isSelected ? 'colorPalette.600' : 'transparent'}
              borderRadius="4px"
              cursor="pointer"
              flexShrink={0}
              onClick={() => onSelect(type)}
              overflow="hidden"
              title={label}
              transition="border-color 0.15s"
              _hover={{
                borderColor: isSelected
                  ? 'colorPalette.600'
                  : 'border/emphasized',
              }}
            >
              <Box
                aspectRatio="16/9"
                backgroundColor={isTransparent ? 'bg.muted' : 'bg.subtle'}
                height="40px"
                padding={isTransparent ? 1 : 0}
                transition="padding 0.2s"
              >
                <VehicleImage
                  name={vehicle.info.name}
                  slug={vehicle.info.slug}
                  type={thumbnailType}
                  width={71}
                  height={40}
                  style={{ objectFit: isTransparent ? 'contain' : 'cover' }}
                />
              </Box>
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
}
