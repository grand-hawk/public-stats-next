import {
  Box,
  Center,
  Heading,
  HStack,
  Quote,
  Span,
  Stack,
  Text,
} from '@chakra-ui/react';
import NextImage from 'next/image';
import React from 'react';
import { MdOutlineOpenInFull } from 'react-icons/md';
import { SiFandom } from 'react-icons/si';

import IconLink from '@/components/buttonIconLink';
import TeamIcon from '@/components/icons/teams';

import type { NamedVehicle } from '@/server/api/trpc/routers/vehicles';

export default function VehicleHeader({ vehicle }: { vehicle: NamedVehicle }) {
  const [imageErrored, setImageErrored] = React.useState(false);

  const imageUrl = `/assets/vehicles/${vehicle.info.slug}.png`;
  const vehicleDescription = vehicle.info.description.trim();

  React.useEffect(() => {
    setImageErrored(false);
  }, [vehicle.info.slug]);

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
      divideY="1px"
      width="100%"
    >
      <Box backgroundColor="bg.panel" height="3xs" position="relative">
        {imageErrored ? (
          <Center height="100%">
            <Text fontWeight="medium">Resource not found</Text>
          </Center>
        ) : (
          <Box asChild objectFit="cover">
            <NextImage
              key={vehicle.info.slug}
              alt={`Image of the "${vehicle.info.name}" in Multicrew Tank Combat on Roblox`}
              blurDataURL="data:image/webp;base64,UklGRooAAABXRUJQVlA4WAoAAAAAAAAAHwAAHwAAVlA4IGwAAACwBACdASogACAAPok2lUglIyIhN+gAoBEJZwDIXHmzSajWQrznMxbR+dwOHsqOAPAZsP004crt8WSSX8AoxpEFm2bGOnGFvmyW0fypFOzSYuYnEYiece44qIIOawb6sV0s9LBRAZlOhQUJwAA="
              fill
              placeholder="blur"
              priority
              sizes="(min-width: 80rem) 1000px, (min-width: 60rem) 800px, 600px"
              src={imageUrl}
              onError={() => setImageErrored(true)}
              onLoad={() => setImageErrored(false)}
            />
          </Box>
        )}

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
        >
          <IconLink
            href={imageUrl}
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
          <HStack>
            <TeamIcon team={vehicle.info.team} />
            <Span aria-label="Team" fontSize="sm" lineHeight="short">
              {vehicle.info.team}
            </Span>
          </HStack>

          <Heading>{vehicle.info.name}</Heading>

          <Span aria-label="Role" color="gray.100">
            {vehicle.info.role}
          </Span>
        </div>

        {vehicleDescription !== '' && (
          <Quote aria-label="Description" fontSize="sm" fontWeight="light">
            {vehicleDescription}
          </Quote>
        )}
      </Stack>
    </Box>
  );
}
