import { Box, Stack, Text } from '@chakra-ui/react';
import React from 'react';

import UpdateMediaView from '@/components/features/updates/media';
import UpdateProse from '@/components/features/updates/prose';

import type { UpdateBlock } from '@/server/utils/updates/types';

export default function UpdateBlocks({ blocks }: { blocks: UpdateBlock[] }) {
  return (
    <Stack gap="20px">
      {blocks.map((block, index) =>
        block.kind === 'prose' ? (
          <UpdateProse key={index}>{block.text}</UpdateProse>
        ) : (
          <Box as="figure" key={index}>
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
        ),
      )}
    </Stack>
  );
}
