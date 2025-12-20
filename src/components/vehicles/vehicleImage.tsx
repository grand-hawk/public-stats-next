import { Center, Text, Box } from '@chakra-ui/react';
import NextImage from 'next/image';
import React from 'react';

import type { ImageProps as NextImageProps } from 'next/image';

interface VehicleImageProps extends Omit<NextImageProps, 'src' | 'alt'> {
  image: string | null;
  name: string;
  slug: string;
  fallbackText?: string;
  aspectRatio?: string | number;
}

export default function VehicleImage({
  fallbackText = 'NO IMAGE',
  image,
  name,
  slug,
  style,
  ...props
}: VehicleImageProps) {
  const [hasError, setHasError] = React.useState(false);

  if (!image || hasError)
    return (
      <Center
        height="100%"
        width="100%"
        backgroundColor="blackAlpha.200"
        userSelect="none"
      >
        <Text color="whiteAlpha.400" fontSize="2xs" fontWeight="bold">
          {fallbackText}
        </Text>
      </Center>
    );

  return (
    <Box asChild objectFit="cover" width="100%" height="100%" userSelect="none">
      <NextImage
        key={slug}
        alt={`Image of the "${name}" in Multicrew Tank Combat on Roblox`}
        src={image}
        style={{
          objectFit: 'cover',
          ...style,
        }}
        onError={() => setHasError(true)}
        {...props}
      />
    </Box>
  );
}
