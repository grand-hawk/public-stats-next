import { Box } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import { useArticle } from '@/components/article/context';
import { Tooltip } from '@/components/ui/tooltip';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';
import { useRouterQuery } from '@/hooks/useRouterQuery';

const TERM_CSS = {
  color: 'var(--color-progressive)',
  textDecorationLine: 'underline !important',
  textDecorationStyle: 'dotted',
  textDecorationColor: 'currentColor',
  textUnderlineOffset: '0.25em',
  '&:hover': {
    color: 'var(--color-progressive--hover)',
    textDecorationStyle: 'solid',
  },
} as const;

function inlineLabel(label: string) {
  const isAcronym = /^[A-Z]{2}/.test(label);
  return isAcronym ? label : label.charAt(0).toLowerCase() + label.slice(1);
}

export default function Term({
  children,
  id,
}: {
  children?: React.ReactNode;
  id: string;
}) {
  const { refs } = useArticle();
  const initials = usePlaceInitials();
  const currentSlug = useRouterQuery('article');
  const term = refs.terms[id];
  if (!term) return <>{children ?? id}</>;

  const pointsHere = term.article?.split('#')[0] === currentSlug;
  const target =
    term.article && !pointsHere ? term.article : `glossary#${term.anchor}`;

  return (
    <Tooltip
      content={
        <Box css={{ maxWidth: '320px', fontWeight: 400 }}>
          {term.definition}
        </Box>
      }
    >
      <Box asChild css={TERM_CSS}>
        <NextLink
          href={`/${initials}/${target}`}
          prefetch={false}
        >
          {children ?? inlineLabel(term.label)}
        </NextLink>
      </Box>
    </Tooltip>
  );
}
