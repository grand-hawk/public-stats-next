import { Box } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import { STAT_ARTICLES } from '@/content/statLinks';
import { useArticleTitle } from '@/hooks/useArticleTitle';
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
  const target = STAT_ARTICLES[article];
  const available = useArticleTitle(target.split('#')[0]) !== undefined;

  if (!available) return children;

  return (
    <Box asChild css={LINK_CSS}>
      <NextLink href={`/${initials}/${target}`} prefetch={false}>
        {children}
      </NextLink>
    </Box>
  );
}
