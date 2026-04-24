import { Box, Heading, Text } from '@chakra-ui/react';
import NextImage from 'next/image';
import NextLink from 'next/link';
import React from 'react';

export default function ClassStrip({
  accent,
  count,
  href,
  icon: Icon,
  image,
  label,
}: {
  label: string;
  accent: string;
  count: number;
  href: string;
  image?: string;
  icon?: React.ComponentType<{ size?: number }>;
}) {
  return (
    <Box
      asChild
      position="relative"
      overflow="hidden"
      flex={{ base: '0 0 60%', sm: '0 0 240px', md: '1 0 160px' }}
      height="100%"
      colorPalette={accent}
      backgroundColor="bg.subtle"
      borderWidth="1px"
      borderColor="whiteAlpha.100"
      _hover={{
        '& .cs-image': { transform: 'scale(1.05)' },
        '& .cs-label': { color: 'white' },
      }}
    >
      <NextLink href={href} prefetch={false}>
        {image ? (
          <Box
            className="cs-image"
            position="absolute"
            inset={0}
            transition="transform 0.5s ease"
          >
            <NextImage
              fill
              alt=""
              priority
              src={image}
              sizes="(max-width: 768px) 100vw, 300px"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          </Box>
        ) : (
          <>
            <Box
              position="absolute"
              inset={0}
              backgroundColor="colorPalette.900"
              opacity={0.5}
            />

            {Icon && (
              <Box
                position="absolute"
                right={-3}
                bottom={-3}
                color="colorPalette.500"
                opacity={0.2}
              >
                <Icon size={180} />
              </Box>
            )}
          </>
        )}

        <Box
          position="absolute"
          inset={0}
          background="linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0.9) 100%)"
        />

        <Box
          position="absolute"
          bottom={2.5}
          right={2.5}
          paddingX={2}
          paddingY={0.5}
          backgroundColor="blackAlpha.700"
          backdropFilter="blur(4px)"
        >
          <Text fontSize="xs" color="fg.muted" fontWeight="semibold">
            {count}
          </Text>
        </Box>

        <Box
          position="absolute"
          left={0}
          bottom={0}
          top={0}
          display={{ base: 'none', md: 'flex' }}
          alignItems="flex-end"
          paddingBottom={4}
          paddingLeft={3}
        >
          <Heading
            className="cs-label"
            as="h3"
            fontSize="lg"
            fontWeight="semibold"
            letterSpacing="-0.005em"
            color="whiteAlpha.900"
            transition="color 0.2s"
            lineHeight="1"
            whiteSpace="nowrap"
            css={{
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
            }}
          >
            {label}
          </Heading>
        </Box>

        <Box
          display={{ base: 'block', md: 'none' }}
          position="absolute"
          left={3}
          bottom={2.5}
          right={3}
        >
          <Heading
            as="h3"
            fontSize="md"
            fontWeight="semibold"
            color="whiteAlpha.900"
            lineHeight="1"
          >
            {label}
          </Heading>
        </Box>
      </NextLink>
    </Box>
  );
}
