import { Box } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import slugify from 'slug';

import ExternalLink, { isExternalHref } from '@/components/common/externalLink';
import { IS_DEV } from '@/env';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';
import { headingText } from '@/utils/articleMarkdown';

const HEADING_ANCHOR_CSS = {
  color: 'inherit !important',
  textDecoration: 'none',
  '&:hover': { textDecoration: 'underline' },
} as const;

function heading(Tag: 'h2' | 'h3') {
  return function ArticleHeading({
    children,
    ...props
  }: React.ComponentProps<'h2'>) {
    const id = slugify(headingText(children));

    return (
      <Tag {...props} id={id} style={{ scrollMarginTop: '64px' }}>
        <Box asChild css={HEADING_ANCHOR_CSS}>
          <NextLink href={`#${id}`} shallow>
            {children}
          </NextLink>
        </Box>
      </Tag>
    );
  };
}

export const ArticleH2 = heading('h2');
export const ArticleH3 = heading('h3');

export function ArticleAnchor({
  children,
  href = '',
  ...props
}: React.ComponentProps<'a'>) {
  const initials = usePlaceInitials();

  if (isExternalHref(href)) {
    return (
      <ExternalLink {...props} href={href}>
        {children}
      </ExternalLink>
    );
  }

  return (
    <NextLink
      href={href.startsWith('/') ? `/${initials}${href}` : href}
      prefetch={false}
      shallow={href.startsWith('#')}
    >
      {children}
    </NextLink>
  );
}

export function ArticleTable(props: React.ComponentProps<'table'>) {
  return (
    <Box className="article-table">
      <table {...props} />
    </Box>
  );
}

export function ArticleImage({ src }: React.ComponentProps<'img'>) {
  if (IS_DEV) {
    throw new Error(
      `Markdown image "${String(src)}" is not allowed in articles. Import the file and use <Figure src={...} alt="..." />.`,
    );
  }

  return null;
}
