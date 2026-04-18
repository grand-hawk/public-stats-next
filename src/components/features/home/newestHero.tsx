import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import NextImage from 'next/image';
import NextLink from 'next/link';
import React from 'react';

import { getVehicleImage } from '@/utils/getVehicleImage';

export default function NewestHero({
  initials,
  name,
  role,
  slug,
}: {
  slug: string;
  name: string;
  role: string;
  initials: string;
}) {
  return (
    <Box
      asChild
      position="relative"
      overflow="hidden"
      backgroundColor="bg.subtle"
      borderWidth="1px"
      borderColor="whiteAlpha.100"
      minHeight="260px"
      _hover={{ '& .f-img': { transform: 'scale(1.03)' } }}
    >
      <NextLink href={`/${initials}/vehicles/${slug}`}>
        <Box
          className="f-img"
          position="absolute"
          inset={0}
          transition="transform 0.6s ease"
        >
          <NextImage
            fill
            alt=""
            src={getVehicleImage(slug, 'perspective')}
            sizes="(max-width: 1024px) 100vw, 1100px"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </Box>

        <Box
          position="absolute"
          inset={0}
          background="linear-gradient(90deg, rgba(21,19,15,0.95) 0%, rgba(21,19,15,0.55) 55%, rgba(21,19,15,0.1) 100%)"
        />

        <Flex
          position="relative"
          direction="column"
          height="100%"
          padding={{ base: 5, md: 7 }}
          justifyContent="flex-end"
          gap={2}
        >
          <Text
            fontSize="xs"
            color="orange.300"
            fontWeight="semibold"
            textTransform="uppercase"
            letterSpacing="0.1em"
          >
            Newest addition
          </Text>

          <Heading
            size={{ base: 'xl', md: '2xl' }}
            fontWeight="semibold"
            letterSpacing="-0.01em"
          >
            {name}
          </Heading>

          <Text color="fg.muted" fontSize="sm">
            {role}
          </Text>
        </Flex>
      </NextLink>
    </Box>
  );
}
