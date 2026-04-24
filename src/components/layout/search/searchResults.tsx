import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import PageIcon, { PAGE_TYPE_LABELS } from '@/components/common/pageIcon';

import type { SiteSearchController } from '@/components/layout/search/useSiteSearch';
import type { SearchResult } from '@/server/api/trpc/routers/search';

interface SearchResultsProps {
  controller: SiteSearchController;
  maxHeight?: string;
}

export default function SearchResults({
  controller,
  maxHeight = '60vh',
}: SearchResultsProps) {
  const {
    activeIndex,
    enabled,
    isFetching,
    navigate,
    results,
    setActiveIndex,
    trimmed,
  } = controller;

  if (!enabled) {
    return (
      <Text color="fg.subtle" fontSize="xs" padding={4}>
        Type at least 2 characters.
      </Text>
    );
  }

  if (results.length === 0 && !isFetching) {
    return (
      <Text color="fg.subtle" fontSize="sm" padding={4}>
        No matches for &ldquo;{trimmed}&rdquo;
      </Text>
    );
  }

  return (
    <Box maxHeight={maxHeight} overflowY="auto">
      {results.map((result, index) => (
        <ResultRow
          key={`${result.type}-${result.href}`}
          active={index === activeIndex}
          onClick={() => navigate(result)}
          onMouseEnter={() => setActiveIndex(index)}
          result={result}
        />
      ))}
    </Box>
  );
}

function ResultRow({
  active,
  onClick,
  onMouseEnter,
  result,
}: {
  active: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  result: SearchResult;
}) {
  return (
    <Flex
      alignItems="center"
      as="button"
      backgroundColor={active ? 'bg.emphasized' : 'transparent'}
      cursor="pointer"
      gap={3}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      paddingX={4}
      paddingY={2.5}
      textAlign="left"
      width="100%"
    >
      <Flex
        alignItems="center"
        color="fg.muted"
        flexShrink={0}
        fontSize="lg"
        height={6}
        justifyContent="center"
        width={6}
      >
        <PageIcon iconSize={24} page={result.page} variant="icon" />
      </Flex>
      <Flex direction="column" flex={1} minWidth={0}>
        <Text fontSize="sm" fontWeight="semibold" truncate>
          {result.title}
        </Text>
        {result.subtitle && (
          <Text color="fg.muted" fontSize="xs" truncate>
            {result.subtitle}
          </Text>
        )}
      </Flex>
      <Text color="fg.subtle" flexShrink={0} fontSize="xs">
        {PAGE_TYPE_LABELS[result.type]}
      </Text>
    </Flex>
  );
}
