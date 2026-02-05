import { Image } from '@chakra-ui/react';
import NextImage from 'next/image';
import React from 'react';

import type { ImageProps } from '@chakra-ui/react';

interface ShellIconProps extends Omit<ImageProps, 'alt' | 'src'> {
  alt: string;
  src: string;
  size?: number;
}

export default React.memo(function ShellIcon({
  alt,
  size = 24,
  src,
  ...props
}: ShellIconProps) {
  return (
    <Image asChild {...props}>
      <NextImage alt={alt} height={size} src={src} width={size} />
    </Image>
  );
});
