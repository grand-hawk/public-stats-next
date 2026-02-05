import { Image } from '@chakra-ui/react';
import NextImage from 'next/image';
import React from 'react';

import { getVehicleImage } from '@/utils/getVehicleImage';

import type { ImageProps } from '@chakra-ui/react';

interface VehicleIconProps extends Omit<ImageProps, 'alt' | 'src'> {
  slug: string;
  size?: number;
}

export default React.memo(function VehicleIcon({
  size = 24,
  slug,
  ...props
}: VehicleIconProps) {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setHasError(false);
  }, [slug]);

  if (hasError) return null;

  return (
    <Image asChild {...props}>
      <NextImage
        alt=""
        height={size}
        src={getVehicleImage(slug, 'icon')}
        width={size}
        onError={() => setHasError(true)}
      />
    </Image>
  );
});
