import { Box } from '@chakra-ui/react';
import React from 'react';

import { isVideo, videoAttributes } from '@/utils/updateMedia';

import type { UpdateMedia } from '@/server/utils/updates/types';

const BLOCK_MAX_HEIGHT = '420px';

const FRAME_CSS = {
  backgroundColor: 'bg.subtle',
  borderRadius: '8px',
  display: 'block',
  maxWidth: '100%',
  overflow: 'hidden',
} as const;

export type MediaFit = 'width' | 'cover';

function fitCss(fit: MediaFit) {
  if (fit === 'cover') {
    return {
      ...FRAME_CSS,
      height: '100%',
      objectFit: 'cover' as const,
      width: '100%',
    };
  }

  return {
    ...FRAME_CSS,
    height: 'auto',
    maxHeight: BLOCK_MAX_HEIGHT,
    width: 'auto',
  };
}

export default function UpdateMediaView({
  fit = 'width',
  loop = false,
  media,
}: {
  fit?: MediaFit;
  loop?: boolean;
  media: UpdateMedia;
}) {
  const css = fitCss(fit);

  if (isVideo(media)) {
    return (
      <Box asChild css={css}>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          aria-hidden={loop || undefined}
          src={media.url}
          poster={media.poster}
          playsInline
          {...videoAttributes(loop)}
        />
      </Box>
    );
  }

  return (
    <Box asChild css={css}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={media.url}
        alt={media.alt}
        height={media.height}
        width={media.width}
        loading="lazy"
      />
    </Box>
  );
}
