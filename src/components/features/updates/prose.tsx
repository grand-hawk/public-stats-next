import { Box } from '@chakra-ui/react';
import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { ArticleTable } from '@/components/article/elements';
import { ARTICLE_MDX_CSS } from '@/components/article/prose';
import { articleMarkdownComponents } from '@/utils/articleMarkdown';

const COMPONENTS = { ...articleMarkdownComponents, table: ArticleTable };
const PLUGINS = [remarkGfm];

export default function UpdateProse({ children }: { children: string }) {
  return (
    <Box color="fg" css={ARTICLE_MDX_CSS}>
      <Markdown components={COMPONENTS} remarkPlugins={PLUGINS}>
        {children}
      </Markdown>
    </Box>
  );
}
