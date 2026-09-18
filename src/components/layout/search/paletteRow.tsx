import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import PageIcon, { PAGE_TYPE_LABELS } from '@/components/common/pageIcon';
import { optionId } from '@/components/layout/search/useSiteSearch';

import type { SearchResult } from '@/server/api/trpc/routers/search';

interface PaletteRowProps {
  active: boolean;
  index: number;
  onMouseEnter: () => void;
  onSelect: () => void;
  query: string;
  result: SearchResult;
}

export default function PaletteRow({
  active,
  index,
  onMouseEnter,
  onSelect,
  query,
  result,
}: PaletteRowProps) {
  return (
    <Box
      aria-selected={active}
      id={optionId(index)}
      role="option"
      css={{
        marginInline: '8px',
        borderRadius: 0,
        backgroundColor: active
          ? 'var(--background-color-interactive-subtle--hover)'
          : 'transparent',
        '&:active': {
          backgroundColor: 'var(--background-color-interactive-subtle--active)',
        },
      }}
      onMouseDown={(event) => event.preventDefault()}
    >
      <Flex
        alignItems="center"
        as="button"
        columnGap="12px"
        cursor="pointer"
        onClick={onSelect}
        onMouseEnter={onMouseEnter}
        padding="12px 16px"
        tabIndex={-1}
        textAlign="left"
        width="100%"
      >
        <Flex
          alignItems="center"
          backgroundColor="bg.muted"
          borderColor="border"
          borderRadius="4px"
          borderWidth="1px"
          color="fg.muted"
          flexShrink={0}
          height="40px"
          justifyContent="center"
          overflow="hidden"
          width="40px"
        >
          <PageIcon iconSize={20} page={result.page} variant="icon" />
        </Flex>

        <Box flex={1} minWidth={0} overflow="hidden">
          <Box
            color="fg.emphasized"
            fontSize="16px"
            fontWeight={600}
            lineHeight="26px"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            <MatchedTitle query={query} title={result.title} />
          </Box>
          {result.subtitle && (
            <Box
              color="fg.muted"
              fontSize="14px"
              fontWeight={400}
              lineHeight="18px"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              {result.subtitle}
            </Box>
          )}
        </Box>

        <Flex
          color="fg.muted"
          flexShrink={0}
          gap="4px"
          maxWidth="40%"
          minWidth={0}
          overflow="hidden"
        >
          <Box
            backgroundColor="bg.muted"
            borderColor="border.subtle"
            borderRadius="4px"
            borderWidth="1px"
            lineHeight="22px"
            minWidth={0}
            overflow="hidden"
            padding="2px 8px"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            {PAGE_TYPE_LABELS[result.type]}
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}

function MatchedTitle({ query, title }: { query: string; title: string }) {
  const trimmed = query.trim();
  const index = trimmed
    ? title.toLowerCase().indexOf(trimmed.toLowerCase())
    : -1;
  if (index < 0) return <>{title}</>;
  return (
    <>
      {title.slice(0, index)}
      <Box as="span" color="fg.muted" fontWeight={400}>
        {title.slice(index, index + trimmed.length)}
      </Box>
      {title.slice(index + trimmed.length)}
    </>
  );
}
