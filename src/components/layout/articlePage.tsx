import { Box, Flex, Stack } from '@chakra-ui/react';
import React from 'react';

import { GUTTER_CSS, MEASURE } from '@/components/layout/shell/constants';
import SiteFooter from '@/components/layout/siteFooter';
import ArticleSwap from '@/components/wiki/articleSwap';
import AtmosphereBand from '@/components/wiki/atmosphereBand';
import StickyArticleHeader from '@/components/wiki/stickyArticleHeader';

export interface ArticlePageProps {
  actions?: React.ReactNode;
  band?: boolean;
  bandColor?: string;
  bandImage?: string;
  children: React.ReactNode;
  describedBy?: string;
  markdownTarget?: boolean;
  placeName: string;
  stickyTitle?: string;
  swapId?: string;
  swapStale?: boolean;
  titleId: string;
  wide?: boolean;
}

const CONTENT_CSS = {
  ...GUTTER_CSS,
  paddingBlockStart: '24px',
} as const;

export default function ArticlePage({
  actions,
  band = true,
  bandColor,
  bandImage,
  children,
  describedBy,
  markdownTarget = false,
  placeName,
  stickyTitle,
  swapId,
  swapStale = false,
  titleId,
  wide = false,
}: ArticlePageProps) {
  const body = (
    <>
      {stickyTitle && (
        <StickyArticleHeader
          actions={actions}
          targetId={titleId}
          title={stickyTitle}
        />
      )}

      <Flex justifyContent="center" position="relative" css={CONTENT_CSS}>
        {band && <AtmosphereBand color={bandColor} image={bandImage} />}

        <Stack
          aria-describedby={describedBy}
          aria-labelledby={titleId}
          as="article"
          data-md-target={markdownTarget || undefined}
          gap={0}
          maxWidth={wide ? undefined : MEASURE}
          position="relative"
          width="100%"
          zIndex={1}
        >
          {children}
        </Stack>
      </Flex>

      <SiteFooter placeName={placeName} />
    </>
  );

  if (!swapId) return <Box>{body}</Box>;

  return (
    <ArticleSwap id={swapId} stale={swapStale}>
      {body}
    </ArticleSwap>
  );
}
