import { Box, Heading, HStack, Quote, Span, Stack } from '@chakra-ui/react';
import React from 'react';
import { MdOutlineOpenInFull } from 'react-icons/md';
import { SiFandom } from 'react-icons/si';

import IconLink from '@/components/buttonIconLink';
import ButtonMarkdownLink from '@/components/buttonMarkdownLink';
import TeamIcon from '@/components/icons/teams';
import VehicleImage from '@/components/vehicles/vehicleImage';
import { useVehicle } from '@/hooks/providers/vehicle';

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
      divideY={!vehicle.info.image ? '1px' : undefined}
      width="100%"
    >
      <Box
        backgroundColor="bg.panel"
        height={
          !vehicle.info.image ? 'calc(var(--chakra-sizes-3xs) - 1px)' : '3xs'
        }
        position="relative"
      >
        <VehicleImage
          image={vehicle.info.image}
          name={vehicle.info.name}
          slug={vehicle.info.slug}
          fallbackText="Coming soon"
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
            disabled={!vehicle.info.image}
            href={vehicle.info.image || ''}
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

      <Stack as="section" backgroundColor="bg.subtle" gap={4} padding={6}>
        <div>
          <HStack data-md-ignore>
            <TeamIcon team={vehicle.info.team} />
            <Span aria-label="Team" fontSize="sm" lineHeight="short">
              {vehicle.info.team}
            </Span>
          </HStack>

          <Heading aria-label="Vehicle name" as="h1" id="vehicle-page-title">
            {vehicle.info.name}
          </Heading>

          <Span aria-label="Role" color="gray.100">
            {vehicle.info.role}
          </Span>
        </div>

        <Quote
          aria-label="Description"
          fontSize="sm"
          fontWeight="light"
          id="vehicle-page-description"
        >
          {vehicle.info.description}
        </Quote>
      </Stack>
    </Box>
  );
}
