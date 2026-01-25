import { Box, Heading, HStack, Stack } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import ButtonMarkdownLink from '@/components/buttonMarkdownLink';
import {
  BreadcrumbCurrentLink,
  BreadcrumbLink,
  BreadcrumbRoot,
} from '@/components/ui/breadcrumb';

interface LoadoutHeaderProps {
  initials: string;
  name: string;
}

export default function LoadoutHeader({ initials, name }: LoadoutHeaderProps) {
  return (
    <Box
      borderBottomWidth="1px"
      borderLeftWidth={{ base: 0, md: '1px' }}
      borderRightWidth={{ base: 0, md: '1px' }}
      borderTopWidth={{ base: 0, md: '1px' }}
      width="100%"
    >
      <Stack
        as="section"
        backgroundColor="bg.subtle"
        gap={3}
        padding={6}
        position="relative"
      >
        <HStack position="absolute" right={2} role="toolbar" top={2}>
          <ButtonMarkdownLink />
        </HStack>

        <BreadcrumbRoot separator="/" size="sm">
          <BreadcrumbLink asChild>
            <NextLink href={`/${initials}/loadouts`}>Loadouts</NextLink>
          </BreadcrumbLink>
          <BreadcrumbCurrentLink>{name}</BreadcrumbCurrentLink>
        </BreadcrumbRoot>

        <Heading as="h1" size="2xl">
          {name}
        </Heading>
      </Stack>
    </Box>
  );
}
