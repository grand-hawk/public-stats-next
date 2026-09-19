import { Box } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import { STAT_ARTICLES } from '@/content/statLinks';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';

import type { StatArticleKey } from '@/content/statLinks';

const LINK_CSS = {
  color: 'var(--color-progressive)',
  textDecoration: 'none',
  '&:hover': {
    color: 'var(--color-progressive--hover)',
    textDecoration: 'underline',
  },
} as const;

export default function StatArticleLink({
  article,
  children,
}: {
  article: StatArticleKey;
  children: React.ReactNode;
}) {
  const initials = usePlaceInitials();

  return (
    <Box asChild css={LINK_CSS}>
      <NextLink href={`/${initials}/${STAT_ARTICLES[article]}`} prefetch={false}>
        {children}
      </NextLink>
    </Box>
  );
}
