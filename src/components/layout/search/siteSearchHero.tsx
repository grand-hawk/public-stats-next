import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import { LuSearch } from 'react-icons/lu';

import { NARROW_MEDIA } from '@/components/layout/shell/constants';
import { openSiteSearch } from '@/stores/search';

export default function SiteSearchHero({
  label = 'Search the MTC wiki',
}: {
  label?: string;
}) {
  return (
    <Flex
      alignItems="center"
      className="citizen-search-trigger"
      gap="16px"
      marginX="auto"
      role="button"
      tabIndex={0}
      onClick={openSiteSearch}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        openSiteSearch();
      }}
      css={{
        width: '100%',
        maxWidth: '820px',
        height: '4rem',
        paddingInline: '24px',
        fontSize: '1.125rem',
        borderRadius: '12px',
        cursor: 'pointer',
        color: '#adadad',
        backgroundColor: '#171717',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: '#373737',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
        '&:hover, &:focus-visible': {
          outline: 'none',
          borderColor: 'var(--color-progressive)',
          boxShadow:
            '0 0 0 3px color-mix(in oklch, var(--color-progressive) 16%, transparent)',
        },
        [NARROW_MEDIA]: {
          height: '3rem',
          paddingInline: '16px',
          fontSize: '0.875rem',
          borderRadius: '8px',
        },
      }}
    >
      <Box asChild flexShrink={0} opacity={0.9}>
        <LuSearch size={16} />
      </Box>
      <Box minWidth={0} overflow="hidden" textOverflow="ellipsis" truncate>
        {label}
      </Box>
      <Box
        as="kbd"
        css={{
          display: 'inline-block',
          marginLeft: 'auto',
          padding: '4px 8px',
          fontFamily: 'var(--font-family-monospace)',
          fontSize: '12px',
          lineHeight: 1,
          color: '#9b9b9b',
          background: 'none',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'rgba(173, 173, 173, 0.4)',
          borderRadius: '4px',
          [NARROW_MEDIA]: { display: 'none' },
        }}
      >
        /
      </Box>
    </Flex>
  );
}
