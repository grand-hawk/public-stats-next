import { Box, Flex, Heading, Span, Stack } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import PageIcon from '@/components/common/pageIcon';

import type { RelatedPageItem } from '@/server/utils/relatedPages';

interface RelatedPagesProps {
  items: RelatedPageItem[];
}

export default function RelatedPages({ items }: RelatedPagesProps) {
  if (items.length === 0) return null;

  return (
    <Stack as="section" gap={2} data-md-ignore>
      <Heading
        as="h2"
        color="fg.muted"
        fontSize="sm"
        fontWeight="medium"
        letterSpacing="0.02em"
      >
        Related pages
      </Heading>
      <Box
        display="grid"
        gap={2}
        gridTemplateColumns={{
          base: '1fr',
          md: 'repeat(2, minmax(0, 1fr))',
          xl: 'repeat(3, minmax(0, 1fr))',
        }}
      >
        {items.map((item) => (
          <Box
            key={item.href}
            asChild
            backgroundColor={{ base: 'bg.subtle', _hover: 'bg.muted' }}
            borderColor="border.muted"
            borderWidth="1px"
            overflow="hidden"
            transition="background-color 0.15s"
          >
            <NextLink href={item.href} prefetch={false}>
              <Flex alignItems="center" gap={3}>
                <PageIcon page={item.page} variant="thumbnail" />
                <Stack flex="1" gap={0} minWidth={0} paddingRight={3}>
                  <Span fontSize="sm" fontWeight="semibold" truncate>
                    {item.title}
                  </Span>
                  {item.subtitle && (
                    <Span color="fg.muted" fontSize="xs" truncate>
                      {item.subtitle}
                    </Span>
                  )}
                </Stack>
              </Flex>
            </NextLink>
          </Box>
        ))}
      </Box>
    </Stack>
  );
}
