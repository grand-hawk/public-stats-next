import { ARTICLE_PROSE_CSS } from '@/components/wiki/articleProse';

import type { SystemStyleObject } from '@chakra-ui/react';

export const ARTICLE_TEXT_GAP = '16px';
export const ARTICLE_BLOCK_GAP = '20px';

export const ARTICLE_MDX_CSS: SystemStyleObject = {
  ...ARTICLE_PROSE_CSS,
  '& p': { marginBlock: ARTICLE_TEXT_GAP },
  '& ul, & ol': { marginBlock: ARTICLE_TEXT_GAP, paddingInlineStart: '24px' },
  '& li': { marginBlock: '6px' },
  '& h2': {
    ...(ARTICLE_PROSE_CSS['& h2'] as SystemStyleObject),
    marginBlockStart: '40px',
    marginBlockEnd: '12px',
  },
  '& h3': {
    ...(ARTICLE_PROSE_CSS['& h3'] as SystemStyleObject),
    marginBlockStart: '28px',
    marginBlockEnd: '8px',
  },
  '& > :first-child': { marginBlockStart: 0 },
  '& > :last-child': { marginBlockEnd: 0 },
  '& a[data-external]::after': {
    content: '"\\2197"',
    marginInlineStart: '2px',
    fontSize: '0.75em',
  },
  '& code': {
    padding: '1px 4px',
    borderRadius: '4px',
    backgroundColor: 'var(--color-surface-2)',
    color: 'fg.emphasized',
    fontFamily: 'mono',
    fontSize: '0.875em',
  },
  '& blockquote': {
    marginBlock: ARTICLE_BLOCK_GAP,
    paddingInlineStart: '16px',
    borderInlineStartWidth: '2px',
    borderInlineStartStyle: 'solid',
    borderColor: 'var(--border-color-base)',
    color: 'fg.muted',
  },
  '& hr': {
    marginBlock: '24px',
    borderColor: 'var(--border-color-subtle)',
  },
  '& .article-table': {
    marginBlock: ARTICLE_BLOCK_GAP,
    overflowX: 'auto',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'var(--border-color-base)',
    borderRadius: '8px',
    backgroundColor: 'var(--color-surface-1)',
  },
  '& table': {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.875rem',
    lineHeight: '1.375rem',
  },
  '& th, & td': {
    padding: '8px 12px',
    textAlign: 'start',
    verticalAlign: 'top',
  },
  '& th': {
    backgroundColor: 'var(--color-surface-2)',
    color: 'fg.emphasized',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  '& tbody tr': {
    borderBlockStartWidth: '1px',
    borderBlockStartStyle: 'solid',
    borderColor: 'var(--border-color-subtle)',
  },
  '& tbody tr:hover': { backgroundColor: 'quiet.hover' },
};
