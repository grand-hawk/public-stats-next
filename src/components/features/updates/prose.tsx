import { Box } from '@chakra-ui/react';
import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import slugify from 'slug';

import { ArticleTable } from '@/components/article/elements';
import { ARTICLE_BLOCK_GAP, ARTICLE_MDX_CSS } from '@/components/article/prose';
import {
  articleMarkdownComponents,
  headingText,
} from '@/utils/articleMarkdown';

import type { SystemStyleObject } from '@chakra-ui/react';
import type { Components } from 'react-markdown';

const PLUGINS = [remarkGfm];

const lead = (total: string) => `calc(${total} - ${ARTICLE_BLOCK_GAP})`;

const PROSE_CSS: SystemStyleObject = {
  ...ARTICLE_MDX_CSS,
  '& > h2:first-child': { marginBlockStart: lead('40px') },
  '& > h3:first-child': { marginBlockStart: lead('28px') },
};

const COMPONENTS: Components = {
  ...articleMarkdownComponents,
  table: ArticleTable,
  h1: ({ children, node: _node, ...props }) => <h1 {...props}>{children}</h1>,
  h2: ({ children, node: _node, ...props }) => (
    <h2 id={slugify(headingText(children))} {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, node: _node, ...props }) => (
    <h3 id={slugify(headingText(children))} {...props}>
      {children}
    </h3>
  ),
};

export default function UpdateProse({ children }: { children: string }) {
  return (
    <Box color="fg" css={PROSE_CSS}>
      <Markdown components={COMPONENTS} remarkPlugins={PLUGINS}>
        {children}
      </Markdown>
    </Box>
  );
}
