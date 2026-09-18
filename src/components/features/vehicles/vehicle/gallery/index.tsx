import { Box, HStack, Separator, Stack, Switch } from '@chakra-ui/react';
import React from 'react';

import ImageExpandGlyph, {
  IMAGE_EXPAND_REVEAL_CSS,
} from '@/components/common/imageExpandGlyph';
import GalleryThumbnails from '@/components/features/vehicles/vehicle/gallery/thumbnails';
import { IMAGE_VIEWS } from '@/components/features/vehicles/vehicle/gallery/views';
import VehicleImage from '@/components/features/vehicles/vehicleImage';
import { RAISED_FRAME_CSS } from '@/components/ui/styles';
import TitledCard from '@/components/wiki/titledCard';
import { useVehicle } from '@/hooks/providers/vehicle';
import { getVehicleImage } from '@/utils/getVehicleImage';

import type { GalleryImageType } from '@/components/features/vehicles/vehicle/gallery/views';
import type { VehicleImageType } from '@/utils/getVehicleImage';

export default function VehicleGallery() {
  const vehicle = useVehicle();
  const [selectedView, setSelectedView] =
    React.useState<GalleryImageType>('perspective');
  const [isTransparent, setIsTransparent] = React.useState(false);
  const [showOverlay, setShowOverlay] = React.useState(false);

  const currentImageType: VehicleImageType = isTransparent
    ? `${selectedView}_transparent`
    : selectedView;

  const currentLabel = IMAGE_VIEWS.find((v) => v.type === selectedView)?.label;

  React.useEffect(() => {
    setShowOverlay(true);
    const timeout = setTimeout(() => setShowOverlay(false), 2000);
    return () => clearTimeout(timeout);
  }, [selectedView]);

  React.useEffect(() => {
    setSelectedView('perspective');
    setIsTransparent(false);
    setShowOverlay(false);
  }, [vehicle.info.slug]);

  const transparentSwitch = (
    <HStack gap={2}>
      <Box fontSize="xs" color="fg.muted">
        <label htmlFor="gallery-transparent">Transparent</label>
      </Box>
      <Switch.Root
        id="gallery-transparent"
        checked={isTransparent}
        onCheckedChange={(e) => setIsTransparent(e.checked)}
        size="sm"
      >
        <Switch.HiddenInput />
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
      </Switch.Root>
    </HStack>
  );

  return (
    <TitledCard
      title="Gallery"
      withAnchor="gallery"
      endAddon={transparentSwitch}
    >
      <Stack gap={0} overflow="hidden" css={RAISED_FRAME_CSS} data-md-ignore>
        <Box
          aspectRatio="16/9"
          backgroundColor={isTransparent ? 'bg.muted' : undefined}
          overflow="hidden"
          padding={isTransparent ? 4 : 0}
          position="relative"
          transition="padding 0.2s"
          css={{
            '&:hover .gallery-overlay, &:focus-within .gallery-overlay, & .gallery-overlay[data-visible="true"]':
              {
                opacity: '1 !important',
              },
            ...IMAGE_EXPAND_REVEAL_CSS,
          }}
        >
          <VehicleImage
            key={currentImageType}
            name={vehicle.info.name}
            slug={vehicle.info.slug}
            type={currentImageType}
            fetchPriority="high"
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            style={{ objectFit: isTransparent ? 'contain' : 'cover' }}
          />

          <ImageExpandGlyph
            href={getVehicleImage(vehicle.info.slug, currentImageType, false)}
          />

          <Box
            bottom={0}
            className="gallery-overlay"
            data-visible={showOverlay}
            left={0}
            opacity={0}
            paddingX={3}
            paddingY={2}
            pointerEvents="none"
            position="absolute"
            right={0}
            transition="opacity 0.3s"
            css={{
              background:
                'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
            }}
          >
            <Box color="white" fontSize="sm" fontWeight="medium">
              {currentLabel}
            </Box>
          </Box>
        </Box>

        <Separator />

        <GalleryThumbnails
          isTransparent={isTransparent}
          onSelect={setSelectedView}
          selectedView={selectedView}
        />
      </Stack>

      <div data-md-show style={{ display: 'none' }}>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>URL</th>
            </tr>
          </thead>
          <tbody>
            {IMAGE_VIEWS.map(({ label, type }) => (
              <tr key={type}>
                <td>{label}</td>
                <td>{getVehicleImage(vehicle.info.slug, type, false)}</td>
              </tr>
            ))}
            <tr>
              <td>Armor</td>
              <td>
                {getVehicleImage(vehicle.info.slug, 'armor_thumbnail', false)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </TitledCard>
  );
}
