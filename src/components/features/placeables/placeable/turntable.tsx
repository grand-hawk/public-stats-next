import { Box } from '@chakra-ui/react';
import React from 'react';

import Figure from '@/components/article/figure';
import { MEDIA_PREFIX } from '@/env';
import { usePlaceable } from '@/hooks/providers/placeable';

export default function PlaceableTurntable() {
  const placeable = usePlaceable();
  const video = React.useRef<HTMLVideoElement>(null);
  const image = placeable.image;

  if (!image) return null;

  if (!image.turntable) {
    return (
      <Figure
        alt={image.alt}
        caption={image.caption}
        src={{
          height: image.height,
          src: `${MEDIA_PREFIX}${image.path}`,
          width: image.width,
        }}
      />
    );
  }

  return (
    <Box
      as="figure"
      css={{ marginBlock: 0, marginInline: 0, maxWidth: '100%' }}
      onPointerEnter={() => video.current?.pause()}
      onPointerLeave={() => void video.current?.play()}
    >
      <Box asChild css={{ borderRadius: '8px', display: 'block', width: '100%' }}>
        { }
        <video
          ref={video}
          autoPlay
          loop
          muted
          playsInline
          aria-label={image.alt}
          height={image.height}
          poster={`${MEDIA_PREFIX}${image.path}`}
          src={`${MEDIA_PREFIX}${image.turntable}`}
          width={image.width}
        />
      </Box>
    </Box>
  );
}
