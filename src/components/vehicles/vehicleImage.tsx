import { Center, Text, Box } from '@chakra-ui/react';
import NextImage from 'next/image';
import React from 'react';

import { getVehicleImage } from '@/utils/getVehicleImage';

import type { VehicleImageType } from '@/utils/getVehicleImage';
import type { ImageProps as NextImageProps } from 'next/image';

interface VehicleImageProps extends Omit<NextImageProps, 'src' | 'alt'> {
  name: string;
  slug: string;
  type?: VehicleImageType;
  fallbackText?: string;
  aspectRatio?: string | number;
}

const NORMAL_BLUR =
  'data:image/webp;base64,UklGRvAAAABXRUJQVlA4WAoAAAAAAAAAOAAAHwAAVlA4INIAAADQBgCdASo5ACAAPtVapUyoJaOiM/maqQAaiWVjPlnhIy6iqza9tCiwWBGZi5boL03bP6SPbUn9KW00MWkhoAAA/tLnLPsvnTDAj3Umyd6X+DZIRnmngt3M6fapHf49tN0PHNfxuTihBx6Bpz8Z9yfVvWW+Zdj9sVdpoLqudr5MvQMJQxeO9VTgsluWrgYfJ36gM+HnKyI4MpenFjvD6KCLUl8q1T3yNKYqA6kbxzSZc2HqLUDfKixqY+EDskbR65PO3FSDGCtdTKASxmWI0WVVwAA=';
const BANNER_BLUR =
  'data:image/webp;base64,UklGRg4BAABXRUJQVlA4WAoAAAAAAAAAXwAAHwAAVlA4IPAAAAAQBwCdASpgACAAPuFcqU2opSQmNVn6ARAcCWUAzFhLb+CAc09IxPQFJeKw5Sjv8G8G81yKWqDIA+Q2nz7wZaafMAD+0s03TtHkTVFFH/4NkcKisUlVazGjCMW5RYuXdc8Cp7whzLyEfGc/OUCwFjvSSK2VizrJ8czkVXbExwKCSJ2gnpIGX6ITESbHz5NxfM/SAC1ISe167EZBDrZKp3GO8fWQ8fIGzJTs4P0Gq8+5EUdtceguPJI85wD0VL4DNfy6+jhzS2oC96VErAduZaMmNKeDPVWvtigbsDhj1Q0wd82Hin5TbN+GmH9yqCTFQAA=';

export default function VehicleImage({
  fallbackText = 'NO IMAGE',
  name,
  slug,
  style,
  type,
  ...props
}: VehicleImageProps) {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setHasError(false);
  }, [slug]);

  if (hasError)
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
        blurDataURL={type === 'perspective_banner' ? BANNER_BLUR : NORMAL_BLUR}
        placeholder="blur"
        alt={`Image of the "${name}" in Multicrew Tank Combat`}
        src={getVehicleImage(slug, type)}
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
