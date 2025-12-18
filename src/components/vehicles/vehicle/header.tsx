import {
  Box,
  Center,
  Heading,
  HStack,
  Icon,
  Quote,
  Span,
  Stack,
  Text,
} from '@chakra-ui/react';
import NextImage from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { MdOutlineOpenInFull } from 'react-icons/md';
import { SiFandom } from 'react-icons/si';
import { VscMarkdown } from 'react-icons/vsc';

import IconLink from '@/components/buttonIconLink';
import TeamIcon from '@/components/icons/teams';
import { useVehicle } from '@/hooks/providers/vehicle';
import { setExtension } from '@/utils/extensions';

export default function VehicleHeader() {
  const router = useRouter();
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
        {!vehicle.info.image ? (
          <Center height="100%" data-md-ignore>
            <Text fontWeight="medium" userSelect="none">
              Resource not found
            </Text>
          </Center>
        ) : (
          <Box asChild objectFit="cover">
            <NextImage
              key={vehicle.info.slug}
              alt={`Image of the "${vehicle.info.name}" in Multicrew Tank Combat on Roblox`}
              blurDataURL="data:image/webp;base64,UklGRooAAABXRUJQVlA4WAoAAAAAAAAAHwAAHwAAVlA4IGwAAACwBACdASogACAAPok2lUglIyIhN+gAoBEJZwDIXHmzSajWQrznMxbR+dwOHsqOAPAZsP004crt8WSSX8AoxpEFm2bGOnGFvmyW0fypFOzSYuYnEYiece44qIIOawb6sV0s9LBRAZlOhQUJwAA="
              fetchPriority="high"
              fill
              placeholder="blur"
              priority
              sizes="(min-width: 80rem) 1000px, (min-width: 60rem) 800px, 600px"
              src={vehicle.info.image}
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

          <IconLink
            linkProps={{
              target: '_blank',
            }}
            href={setExtension(`/md${router.asPath}`, 'md')}
            rel="nofollow"
            size="sm"
            title="View as markdown"
            variant="surface"
          >
            <Icon size="md">
              <VscMarkdown />
            </Icon>
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
