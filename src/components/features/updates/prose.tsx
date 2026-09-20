import { Box } from '@chakra-ui/react';
import React from 'react';
import Markdown, { defaultUrlTransform } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import slugify from 'slug';

import { ArticleTable } from '@/components/article/elements';
import { ARTICLE_BLOCK_GAP, ARTICLE_MDX_CSS } from '@/components/article/prose';
import { MarkdownAnchor } from '@/components/common/externalLink';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';
import {
  articleMarkdownComponents,
  headingText,
} from '@/utils/articleMarkdown';
import { normaliseTarget, VEHICLE_HREF } from '@/utils/vehicleLink';

import type { SystemStyleObject } from '@chakra-ui/react';
import type { Components } from 'react-markdown';

const PLUGINS = [remarkGfm];

const keepVehicleLinks = (url: string) =>
  url.startsWith(VEHICLE_HREF) ? url : defaultUrlTransform(url);

const lead = (total: string) => `calc(${total} - ${ARTICLE_BLOCK_GAP})`;

const PROSE_CSS: SystemStyleObject = {
  ...ARTICLE_MDX_CSS,
  '& > h2:first-child': { marginBlockStart: lead('40px') },
  '& > h3:first-child': { marginBlockStart: lead('28px') },
};

const BASE_COMPONENTS: Components = {
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

export default function UpdateProse({
  children,
  vehicles,
}: {
  children: string;
  vehicles: Record<string, string>;
}) {
  const initials = usePlaceInitials();

  const components = React.useMemo<Components>(
    () => ({
      ...BASE_COMPONENTS,
      a: ({ children: text, href }) => {
        if (!href?.startsWith(VEHICLE_HREF)) {
          return <MarkdownAnchor href={href}>{text}</MarkdownAnchor>;
        }

        const slug = vehicles[normaliseTarget(href.slice(VEHICLE_HREF.length))];

        if (!slug) return <>{text}</>;

        return (
          <MarkdownAnchor href={`/${initials}/vehicles/${slug}`}>
            {text}
          </MarkdownAnchor>
        );
      },
    }),
    [initials, vehicles],
  );

  return (
    <Box color="fg" css={PROSE_CSS}>
      <Markdown
        components={components}
        remarkPlugins={PLUGINS}
        urlTransform={keepVehicleLinks}
      >
        {children}
      </Markdown>
    </Box>
  );
}
