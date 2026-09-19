import { Box } from '@chakra-ui/react';
import React from 'react';
import Markdown from 'react-markdown';

import { HEADING_LEVEL_CSS } from '@/components/wiki/cardHeading';
import { articleMarkdownComponents } from '@/utils/articleMarkdown';

import type { SystemStyleObject } from '@chakra-ui/react';

export const ARTICLE_PROSE_CSS: SystemStyleObject = {
  fontSize: '1rem',
  lineHeight: '1.625rem',
  overflowWrap: 'break-word',
  '& p': { marginBlock: '12px' },
  '& p:first-of-type': { marginBlockStart: 0 },
  '& p:last-of-type': { marginBlockEnd: 0 },
  '& h2': {
    ...HEADING_LEVEL_CSS.h2,
    color: 'fg.emphasized',
    fontWeight: 500,
    marginBlockStart: '32px',
    marginBlockEnd: '12px',
  },
  '& h3': {
    ...HEADING_LEVEL_CSS.h3,
    color: 'fg.emphasized',
    fontWeight: 500,
    marginBlockStart: '24px',
    marginBlockEnd: '8px',
  },
  '& ul, & ol': { marginBlock: '12px', paddingInlineStart: '24px' },
  '& ul': { listStyleType: 'disc' },
  '& ol': { listStyleType: 'decimal' },
  '& li': { marginBlock: '4px' },
  '& strong': { color: 'fg.emphasized', fontWeight: 600 },
  '& a': {
    color: 'var(--color-progressive)',
    textDecoration: 'none',
    textUnderlineOffset: '0.25em',
    '&:hover': {
      color: 'var(--color-progressive--hover)',
      textDecoration: 'underline',
    },
  },
};

export default function ArticleProse({ children }: { children: string }) {
  return (
    <Box color="fg" css={ARTICLE_PROSE_CSS}>
      <Markdown components={articleMarkdownComponents}>{children}</Markdown>
    </Box>
  );
}
