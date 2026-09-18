import { Box, Flex, Span } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import PageIcon from '@/components/common/pageIcon';
import {
  DURATION_BASE,
  EASE,
  NARROW_MEDIA,
  SUB900_MEDIA,
} from '@/components/layout/shell/constants';
import TitledCard from '@/components/wiki/titledCard';

import type { RelatedPageItem } from '@/server/utils/relatedPages';
import type { SystemStyleObject } from '@chakra-ui/react';

interface RelatedPagesProps {
  items: RelatedPageItem[];
}

const GRID_CSS: SystemStyleObject = {
  display: 'grid',
  gap: '12px',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  [SUB900_MEDIA]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
  [NARROW_MEDIA]: { gridTemplateColumns: 'minmax(0, 1fr)' },
};

const CARD_CSS: SystemStyleObject = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  minWidth: 0,
  backgroundColor: 'var(--color-surface-1)',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'border',
  borderRadius: '8px',
  overflow: 'hidden',
  transitionProperty: 'border-color, background-color',
  transitionDuration: DURATION_BASE,
  transitionTimingFunction: EASE,
  '&:hover': {
    backgroundColor: 'surface.hover',
    borderColor: 'border.emphasized',
    textDecoration: 'none',
  },
  '&:hover .related-title': { textDecoration: 'underline' },
  '&:focus-visible': {
    outline: 'none',
    boxShadow: 'inset 0 0 0 1px var(--color-progressive)',
  },
  '@media (prefers-reduced-motion: reduce)': { transitionDuration: '0ms' },
};

export default function RelatedPages({ items }: RelatedPagesProps) {
  if (items.length === 0) return null;

  return (
    <TitledCard as="section" data-md-ignore title="Related pages">
      <Box css={GRID_CSS}>
        {items.map((item) => (
          <Box asChild css={CARD_CSS} key={item.href}>
            <NextLink href={item.href} prefetch={false}>
              <PageIcon page={item.page} variant="thumbnail" />
              <Flex flex="1" minWidth={0} paddingRight={3}>
                <Span
                  className="related-title"
                  color="fg.emphasized"
                  fontSize="sm"
                  fontWeight="medium"
                  truncate
                >
                  {item.title}
                </Span>
              </Flex>
            </NextLink>
          </Box>
        ))}
      </Box>
    </TitledCard>
  );
}
