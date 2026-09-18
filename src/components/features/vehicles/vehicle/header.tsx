import { Box, HStack, Span, Stack } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import slug from 'slug';

import FakeDescription from '@/components/common/fakeDescription';
import ImageExpandGlyph, {
  IMAGE_EXPAND_REVEAL_CSS,
} from '@/components/common/imageExpandGlyph';
import PageActions from '@/components/common/pageActions';
import VehicleHeaderActions from '@/components/features/vehicles/vehicle/headerActions';
import VehicleImage, {
  VEHICLE_BANNER_SIZES,
} from '@/components/features/vehicles/vehicleImage';
import TeamIcon from '@/components/icons/teams';
import { RAISED_FRAME_CSS } from '@/components/ui/styles';
import ArticleTitle from '@/components/wiki/articleTitle';
import { useVehicle } from '@/hooks/providers/vehicle';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';
import { getVehicleImage } from '@/utils/getVehicleImage';

export default function VehicleHeader() {
  const vehicle = useVehicle();
  const initials = usePlaceInitials();
  return (
    <Stack gap={4}>
      <ArticleTitle
        id="vehicle-page-title"
        title={vehicle.info.name}
        titleLabel="Vehicle name"
        actions={
          <PageActions>
            <VehicleHeaderActions vehicle={vehicle} />
          </PageActions>
        }
        meta={
          <>
            <HStack gap={2}>
              <TeamIcon size="16px" team={vehicle.info.team} />
              <FakeDescription name="Team">
                <Box
                  asChild
                  css={{
                    color: 'var(--color-progressive)',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  <NextLink
                    href={`/${initials}/teams/${slug(vehicle.info.team)}`}
                    prefetch={false}
                  >
                    {vehicle.info.team}
                  </NextLink>
                </Box>
              </FakeDescription>
            </HStack>

            <FakeDescription name="Role">
              <Span>{vehicle.info.role}</Span>
            </FakeDescription>
          </>
        }
      />

      <Box css={RAISED_FRAME_CSS} overflow="hidden" width="100%">
        <Box
          aspectRatio="3/1"
          backgroundColor="var(--color-surface-1)"
          css={IMAGE_EXPAND_REVEAL_CSS}
          position="relative"
        >
          <VehicleImage
            name={vehicle.info.name}
            slug={vehicle.info.slug}
            type="perspective_banner"
            fetchPriority="high"
            fill
            preload
            sizes={VEHICLE_BANNER_SIZES}
          />

          <ImageExpandGlyph
            href={getVehicleImage(
              vehicle.info.slug,
              'perspective_banner',
              false,
            )}
          />
        </Box>
      </Box>
    </Stack>
  );
}
