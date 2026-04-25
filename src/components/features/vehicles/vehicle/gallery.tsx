import { Box, Flex, HStack, Separator, Stack, Switch } from '@chakra-ui/react';
import React from 'react';
import { MdOutlineOpenInFull } from 'react-icons/md';

import IconLink from '@/components/common/buttonIconLink';
import VehicleImage from '@/components/features/vehicles/vehicleImage';
import TitledCard from '@/components/wiki/titledCard';
import { useVehicle } from '@/hooks/providers/vehicle';
import { getVehicleImage } from '@/utils/getVehicleImage';

import type {
  BaseVehicleImageType,
  VehicleImageType,
} from '@/utils/getVehicleImage';

type GalleryImageType = Exclude<BaseVehicleImageType, 'perspective_banner'>;

const IMAGE_VIEWS: { type: GalleryImageType; label: string }[] = [
  { type: 'perspective', label: 'Thumbnail' },
  { type: 'front', label: 'Front' },
  { type: 'back', label: 'Back' },
  { type: 'left', label: 'Left' },
  { type: 'right', label: 'Right' },
  { type: 'top', label: 'Top' },
];

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
      <Box fontSize="xs" color="fg.subtle">
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
      innerPadding={0}
      endAddon={transparentSwitch}
    >
      <Stack gap={0} data-md-ignore>
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

          <Box position="absolute" right={2} top={2}>
            <IconLink
              href={getVehicleImage(vehicle.info.slug, currentImageType, false)}
              linkProps={{ target: '_blank' }}
              rel="nofollow"
              size="xs"
              title="Open full image"
              variant="surface"
            >
              <MdOutlineOpenInFull />
            </IconLink>
          </Box>

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

        <Box
          backgroundColor="bg.subtle/50"
          overflowX="auto"
          overflowY="hidden"
          _scrollbar={{ height: '2px' }}
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
                  cursor="pointer"
                  flexShrink={0}
                  onClick={() => setSelectedView(type)}
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
