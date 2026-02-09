import { Box, Heading, HStack, Span } from '@chakra-ui/react';
import React from 'react';
import { MdOutlineOpenInFull } from 'react-icons/md';
import { SiFandom } from 'react-icons/si';
import slug from 'slug';

import IconLink from '@/components/common/buttonIconLink';
import ButtonMarkdownLink from '@/components/common/buttonMarkdownLink';
import EditPagePopover from '@/components/common/editPagePopover';
import FakeDescription from '@/components/common/fakeDescription';
import VehicleImage from '@/components/features/vehicles/vehicleImage';
import TeamIcon from '@/components/icons/teams';
import { env } from '@/env';
import { useVehicle } from '@/hooks/providers/vehicle';
import { getVehicleImage } from '@/utils/getVehicleImage';

export default function VehicleHeader() {
  const vehicle = useVehicle();

  return (
    <Box
      borderBottomWidth="1px"
      borderLeftWidth={{
        base: 0,
        md: '1px',
      }}
      borderRightWidth={{
        base: 0,
        md: '1px',
      }}
      borderTopWidth={{
        base: 0,
        md: '1px',
      }}
      width="100%"
    >
      <Box aspectRatio="3/1" backgroundColor="bg.panel" position="relative">
        <VehicleImage
          name={vehicle.info.name}
          slug={vehicle.info.slug}
          type="perspective_banner"
          fetchPriority="high"
          fill
          preload
          sizes="(min-width: 80rem) 1000px, (min-width: 60rem) 800px, 600px"
        />

        <HStack
          bottom={2}
          css={{
            '& > *': {
              height: 9,
              width: 9,
            },
          }}
          flexDirection="row-reverse"
          position="absolute"
          right={2}
          role="toolbar"
        >
          <IconLink
            href={getVehicleImage(
              vehicle.info.slug,
              'perspective_banner',
              false,
            )}
            linkProps={{
              target: '_blank',
            }}
            rel="nofollow"
            size="sm"
            title="Open full image"
            variant="surface"
          >
            <MdOutlineOpenInFull />
          </IconLink>

          <ButtonMarkdownLink />

          {vehicle.content && !env.NEXT_PUBLIC_STACKBLITZ && (
            <EditPagePopover
              filePath={`content/vehicles/${slug(vehicle.info.gameId)}.md`}
            />
          )}

          {vehicle.info.externalLinks.Fandom && (
            <IconLink
              href={vehicle.info.externalLinks.Fandom}
              linkProps={{
                target: '_blank',
              }}
              rel="nofollow"
              size="sm"
              title="Fandom"
              variant="surface"
            >
              <SiFandom />
            </IconLink>
          )}
        </HStack>
      </Box>

      <Box as="section" backgroundColor="bg.subtle" padding={6}>
        <HStack>
          <TeamIcon team={vehicle.info.team} />
          <FakeDescription name="Team">
            <Span fontSize="sm" lineHeight="short">
              {vehicle.info.team}
            </Span>
          </FakeDescription>
        </HStack>

        <Heading
          size="2xl"
          aria-label="Vehicle name"
          as="h1"
          id="vehicle-page-title"
        >
          {vehicle.info.name}
        </Heading>

        <FakeDescription name="Role">
          <Span color="gray.100">{vehicle.info.role}</Span>
        </FakeDescription>
      </Box>
    </Box>
  );
}
