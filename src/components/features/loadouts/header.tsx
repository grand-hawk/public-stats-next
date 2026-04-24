import { Flex, Heading, HStack } from '@chakra-ui/react';
import React from 'react';

import ButtonMarkdownLink from '@/components/common/buttonMarkdownLink';
import EditPagePopover from '@/components/common/editPagePopover';
import { env } from '@/env';
import { loadoutDisplayName } from '@/utils/loadoutDisplayName';

interface LoadoutHeaderProps {
  name: string;
  slug: string;
}

export default function LoadoutHeader({ name, slug }: LoadoutHeaderProps) {
  return (
    <Flex
      as="header"
      alignItems="center"
      gap={3}
      justifyContent="space-between"
    >
      <Heading as="h1" id="loadout-page-title" minWidth={0} size="2xl">
        {loadoutDisplayName(name)}
      </Heading>

      <HStack flexShrink={0} role="toolbar">
        {!env.NEXT_PUBLIC_STACKBLITZ && (
          <EditPagePopover filePath={`content/loadouts/${slug}.md`} />
        )}
        <ButtonMarkdownLink />
      </HStack>
    </Flex>
  );
}
