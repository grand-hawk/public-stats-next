import { Box } from '@chakra-ui/react';
import NextImage from 'next/image';
import React from 'react';

import { ARTICLE_BLOCK_GAP } from '@/components/article/prose';
import ImageExpandGlyph, {
  IMAGE_EXPAND_REVEAL_CSS,
} from '@/components/common/imageExpandGlyph';
import { NARROW_MEDIA } from '@/components/layout/shell/constants';

import type { StaticImageData } from 'next/image';

export default function Figure({
  alt,
  caption,
  float,
  floatWidth = 220,
  src,
  wide = false,
}: {
  alt: string;
  caption?: React.ReactNode;
  float?: 'right';
  floatWidth?: number;
  src: StaticImageData;
  wide?: boolean;
}) {
  return (
    <Box
      as="figure"
      css={{
        marginBlock: ARTICLE_BLOCK_GAP,
        marginInline: 0,
        maxWidth: wide ? '100%' : '720px',
        ...(float && {
          float,
          width: `${floatWidth}px`,
          maxWidth: '40%',
          marginBlock: '4px 16px',
          marginInlineStart: '24px',
          [NARROW_MEDIA]: {
            float: 'none',
            width: '100%',
            maxWidth: '100%',
            marginBlock: ARTICLE_BLOCK_GAP,
            marginInlineStart: 0,
          },
        }),
      }}
    >
      <Box
        css={{
          position: 'relative',
          overflow: 'hidden',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'var(--border-color-base)',
          borderRadius: '8px',
          backgroundColor: 'var(--color-surface-1)',
          lineHeight: 0,
          ...IMAGE_EXPAND_REVEAL_CSS,
        }}
      >
        <NextImage
          alt={alt}
          placeholder={src.blurDataURL ? 'blur' : 'empty'}
          sizes={
            float
              ? `(max-width: 639px) 100vw, ${floatWidth}px`
              : wide
                ? '(max-width: 1120px) 100vw, 1080px'
                : '720px'
          }
          src={src}
          style={{ width: '100%', height: 'auto' }}
        />

        <ImageExpandGlyph href={src.src} />
      </Box>

      {caption && (
        <Box
          as="figcaption"
          css={{
            marginBlockStart: '8px',
            color: 'fg.muted',
            fontSize: '0.875rem',
            lineHeight: '1.375rem',
          }}
        >
          {caption}
        </Box>
      )}
    </Box>
  );
}
