import { Box, Text } from '@chakra-ui/react';
import React from 'react';

import UpdateMediaView from '@/components/features/updates/media';

import type { UpdateGalleryItem } from '@/server/utils/updates/types';

const ROW_HEIGHT = '260px';

export default function UpdateGallery({
  items,
}: {
  items: UpdateGalleryItem[];
}) {
  return (
    <Box
      css={{
        alignItems: 'flex-start',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        '& > figure': { flex: '0 1 auto', minWidth: 0 },
        '& img, & video': {
          height: ROW_HEIGHT,
          maxWidth: '100%',
          width: 'auto',
        },
        '@media (max-width: 640px)': {
          '& img, & video': { height: 'auto', width: '100%' },
        },
      }}
    >
      {items.map((item, index) => (
        <Box as="figure" key={index}>
          <UpdateMediaView media={item.media} />

          {item.caption ? (
            <Text
              as="figcaption"
              color="fg.subtle"
              fontSize="0.875rem"
              marginBlockStart="8px"
            >
              {item.caption}
            </Text>
          ) : null}
        </Box>
      ))}
    </Box>
  );
}
