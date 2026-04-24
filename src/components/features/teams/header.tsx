import { Flex, Heading, HStack } from '@chakra-ui/react';
import React from 'react';

import ButtonMarkdownLink from '@/components/common/buttonMarkdownLink';
import EditPagePopover from '@/components/common/editPagePopover';
import TeamIcon from '@/components/icons/teams';
import { env } from '@/env';

interface TeamHeaderProps {
  name: string;
  slug: string;
}

export default function TeamHeader({ name, slug }: TeamHeaderProps) {
  return (
    <Flex
      as="header"
      alignItems="center"
      gap={3}
      justifyContent="space-between"
    >
      <HStack minWidth={0}>
        <TeamIcon team={name} />
        <Heading as="h1" id="team-page-title" size="2xl">
          {name}
        </Heading>
      </HStack>

      <HStack flexShrink={0} role="toolbar">
        {!env.NEXT_PUBLIC_STACKBLITZ && (
          <EditPagePopover filePath={`content/teams/${slug}.md`} />
        )}
        <ButtonMarkdownLink />
      </HStack>
    </Flex>
  );
}
