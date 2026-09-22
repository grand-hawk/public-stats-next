import { Box, Center, Text } from '@chakra-ui/react';
import NextImage from 'next/image';
import React from 'react';

import { MEDIA_PREFIX } from '@/env';

import type { ImageProps as NextImageProps } from 'next/image';

interface PlaceableImageProps extends Omit<NextImageProps, 'src' | 'alt'> {
  /** Display name, used for the alt text */
  name: string;
  /** Placeable slug, which is also the render file name */
  slug: string;
  fallbackText?: string;
}

export default function PlaceableImage({
  fallbackText = 'NO IMAGE',
  name,
  slug,
  style,
  ...props
}: PlaceableImageProps) {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setHasError(false);
  }, [slug]);

  if (hasError) {
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
  }

  return (
    <Box asChild width="100%" height="100%" userSelect="none">
      <NextImage
        key={slug}
        alt={`${name} in Multicrew Tank Combat`}
        src={`${MEDIA_PREFIX}/assets/placeables/${slug}.png`}
        style={{ objectFit: 'contain', ...style }}
        onError={() => setHasError(true)}
        {...props}
      />
    </Box>
  );
}
