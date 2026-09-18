import { Box } from '@chakra-ui/react';
import React from 'react';

import PageHeader from '@/components/layout/pageHeader';
import {
  DESKTOP_MEDIA,
  GUTTER_CSS,
  MEASURE,
  SIDEBAR_GAP,
  SIDEBAR_WIDTH,
  FOOTER_PUSH_MIN_HEIGHT,
} from '@/components/layout/shell/constants';
import SiteFooter from '@/components/layout/siteFooter';

export interface ArticleLayoutProps {
  children: React.ReactNode;
  placeName: string;
  sidebar?: React.ReactNode;
  subtitle?: string;
  title: string;
}

const CONTENT_CSS = {
  gridArea: 'content',
  minWidth: 0,
  marginBlockStart: '16px',
  fontSize: '1rem',
  lineHeight: 'var(--line-height-content)',
  overflowWrap: 'break-word',
} as const;

const SIDEBAR_TOP_OFFSET = '120px';

const SIDEBAR_CSS = {
  display: 'none',
  [DESKTOP_MEDIA]: {
    gridArea: 'sidebar',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    alignSelf: 'start',
    position: 'sticky',
    top: 0,
    maxHeight: `calc(100dvh - ${SIDEBAR_TOP_OFFSET})`,
    marginTop: '12px',
    paddingBlock: '8px 24px',
    overflowY: 'auto',
    '@supports (animation-timeline: scroll())': {
      animationName: 'browse-sidebar-grow',
      animationDuration: 'auto',
      animationTimingFunction: 'linear',
      animationFillMode: 'both',
      animationTimeline: 'scroll(nearest block)',
      animationRange: `0px ${SIDEBAR_TOP_OFFSET}`,
    },
  },
} as const;

export default function ArticleLayout({
  children,
  placeName,
  sidebar,
  subtitle,
  title,
}: ArticleLayoutProps) {
  return (
    <Box minHeight={FOOTER_PUSH_MIN_HEIGHT} position="relative">
      <PageHeader subtitle={subtitle} title={title} wide={!!sidebar} />

      <Box
        css={{
          display: 'grid',
          gridTemplateAreas: '"content" "footer"',
          gridTemplateColumns: `minmax(0, ${MEASURE})`,
          gap: `0 ${SIDEBAR_GAP}`,
          justifyContent: 'center',
          marginBottom: '24px',
          ...GUTTER_CSS,
          ...(sidebar
            ? {
                [DESKTOP_MEDIA]: {
                  paddingInline: '32px',
                  gridTemplateAreas: '"sidebar content" "footer footer"',
                  gridTemplateColumns: `${SIDEBAR_WIDTH} minmax(0, ${MEASURE})`,
                },
              }
            : null),
        }}
      >
        {sidebar && <Box css={SIDEBAR_CSS}>{sidebar}</Box>}

        <Box css={CONTENT_CSS}>{children}</Box>
      </Box>

      <SiteFooter placeName={placeName} />
    </Box>
  );
}
