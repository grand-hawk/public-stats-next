import { Box, Stack, Text } from '@chakra-ui/react';
import React from 'react';

import UpdateGallery from '@/components/features/updates/gallery';
import UpdateMediaView from '@/components/features/updates/media';
import UpdateProse from '@/components/features/updates/prose';

import type { UpdateBlock } from '@/server/utils/updates/types';

function Block({ block }: { block: UpdateBlock }) {
  if (block.kind === 'prose') return <UpdateProse>{block.text}</UpdateProse>;

  if (block.kind === 'gallery') return <UpdateGallery items={block.items} />;

  return (
    <Box as="figure">
      <UpdateMediaView loop={block.loop} media={block.media} />

      {block.caption ? (
        <Text
          as="figcaption"
          color="fg.subtle"
          fontSize="0.875rem"
          marginBlockStart="8px"
        >
          {block.caption}
        </Text>
      ) : null}
    </Box>
  );
}

export default function UpdateBlocks({ blocks }: { blocks: UpdateBlock[] }) {
  return (
    <Stack gap="20px">
      {blocks.map((block, index) => (
        <Block block={block} key={index} />
      ))}
    </Stack>
  );
}
