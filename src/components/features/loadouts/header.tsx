import { Box, Span, Stack } from '@chakra-ui/react';
import NextImage from 'next/image';
import React from 'react';

import { NARROW_MEDIA } from '@/components/layout/shell/constants';
import ArticleTitle from '@/components/wiki/articleTitle';
import { loadoutDisplayName } from '@/utils/loadoutDisplayName';

interface LoadoutHeaderProps {
  name: string;
  tagline?: string;
  thumbnail: string;
}

export default function LoadoutHeader({
  name,
  tagline,
  thumbnail,
}: LoadoutHeaderProps) {
  return (
    <Stack gap="16px">
      <ArticleTitle
        id="loadout-page-title"
        meta={tagline ? <Span>{tagline}</Span> : undefined}
        title={loadoutDisplayName(name)}
        titleLabel="Loadout name"
      />

      <Box
        backgroundColor="var(--color-surface-1)"
        borderColor="border"
        borderRadius="8px"
        borderWidth="1px"
        data-md-ignore
        overflow="hidden"
        width="100%"
      >
        <Box
          css={{
            position: 'relative',
            aspectRatio: '3 / 1',
            [NARROW_MEDIA]: { aspectRatio: '16 / 9' },
          }}
        >
          <NextImage
            alt=""
            fetchPriority="high"
            fill
            sizes="(max-width: 1119px) 100vw, 1080px"
            src={thumbnail}
            style={{ objectFit: 'cover' }}
          />
        </Box>
      </Box>
    </Stack>
  );
}
