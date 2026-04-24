import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import NextImage from 'next/image';
import NextLink from 'next/link';
import React from 'react';

export default function LoadoutSmall({
  description,
  href,
  name,
  thumbnail,
}: {
  name: string;
  description: string;
  thumbnail: string;
  href: string;
}) {
  return (
    <Box
      asChild
      position="relative"
      overflow="hidden"
      backgroundColor="bg.subtle"
      borderWidth="1px"
      borderColor="whiteAlpha.100"
      flex={1}
      minHeight="110px"
      transition="border-color 0.2s"
      _hover={{
        borderColor: 'whiteAlpha.300',
      }}
    >
      <NextLink href={href} prefetch={false}>
        <Box className="e-img" position="absolute" inset={0}>
          <NextImage
            fill
            alt=""
            priority
            src={thumbnail}
            sizes="(max-width: 768px) 100vw, 300px"
            style={{ objectFit: 'cover' }}
          />
        </Box>

        <Box
          position="absolute"
          inset={0}
          background="linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%)"
        />

        <Flex
          position="relative"
          direction="column"
          height="100%"
          padding={3}
          justifyContent="flex-end"
          gap={0.5}
        >
          <Heading as="h3" size="sm" fontWeight="semibold">
            {name}
          </Heading>

          <Text color="fg.muted" fontSize="xs" lineClamp={1}>
            {description}
          </Text>
        </Flex>
      </NextLink>
    </Box>
  );
}
