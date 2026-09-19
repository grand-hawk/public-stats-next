import { Box } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import { useArticle } from '@/components/article/context';
import { useArticleTitle } from '@/hooks/useArticleTitle';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';

const HATNOTE_CSS = {
  marginBlock: '0 16px',
  paddingInlineStart: '12px',
  borderInlineStartWidth: '2px',
  borderInlineStartStyle: 'solid',
  borderColor: 'var(--border-color-base)',
  color: 'fg.muted',
  fontSize: '0.875rem',
  fontStyle: 'italic',
  lineHeight: '1.375rem',
  '& a': {
    color: 'var(--color-progressive)',
    textDecoration: 'none',
    '&:hover': {
      color: 'var(--color-progressive--hover)',
      textDecoration: 'underline',
    },
  },
} as const;

export default function MainArticle({
  label = 'Main article',
  title,
  to,
}: {
  label?: string;
  title?: string;
  to: string;
}) {
  const { refs } = useArticle();
  const initials = usePlaceInitials();
  const [slug] = to.split('#');
  const navigationTitle = useArticleTitle(slug);
  const resolvedTitle =
    title ?? refs.articles[slug]?.title ?? navigationTitle;
  if (!resolvedTitle) return null;

  return (
    <Box css={HATNOTE_CSS} role="note">
      {label}:{' '}
      <NextLink href={`/${initials}/${to}`} prefetch={false}>
        {resolvedTitle}
      </NextLink>
    </Box>
  );
}
