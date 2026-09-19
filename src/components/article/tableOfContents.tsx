import { Box } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { LuChevronDown } from 'react-icons/lu';

import { DURATION_BASE, EASE } from '@/components/layout/shell/constants';
import { FOCUS_RING_CSS, RAISED_FRAME_CSS } from '@/components/ui/styles';
import OnThisPage from '@/components/wiki/onThisPage';

import type { PageMarker } from '@/components/wiki/onThisPage';

const WIDE_MEDIA = '@media (min-width: 1280px)';
const MIN_MARKERS = 2;

export default function TableOfContents({
  markers,
  variant,
}: {
  markers: PageMarker[];
  variant: 'inline' | 'rail';
}) {
  if (markers.length < MIN_MARKERS) return null;

  if (variant === 'rail') {
    return (
      <Box
        as="aside"
        data-md-ignore
        css={{
          display: 'none',
          [WIDE_MEDIA]: {
            display: 'block',
            position: 'sticky',
            top: '64px',
            maxHeight: 'calc(100dvh - 80px)',
            overflowY: 'auto',
            alignSelf: 'start',
          },
        }}
      >
        <OnThisPage markers={markers} />
      </Box>
    );
  }

  return (
    <Box
      as="details"
      data-md-ignore
      css={{
        ...RAISED_FRAME_CSS,
        marginBlockEnd: '24px',
        '&[open] .toc-chevron': { transform: 'rotate(180deg)' },
        [WIDE_MEDIA]: { display: 'none' },
      }}
    >
      <Box
        as="summary"
        css={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '40px',
          padding: '0 12px 0 16px',
          borderRadius: '8px',
          color: 'fg.emphasized',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: 500,
          listStyle: 'none',
          userSelect: 'none',
          '&::-webkit-details-marker': { display: 'none' },
          '&:hover': { backgroundColor: 'quiet.hover' },
          '&:focus-visible': FOCUS_RING_CSS,
        }}
      >
        Contents
        <Box
          aria-hidden
          className="toc-chevron"
          css={{
            display: 'flex',
            color: 'fg.muted',
            transition: `transform ${DURATION_BASE} ${EASE}`,
          }}
        >
          <LuChevronDown size={16} />
        </Box>
      </Box>

      <Box
        as="ol"
        css={{
          margin: 0,
          padding: '4px 8px 8px',
          listStyle: 'none',
          borderBlockStartWidth: '1px',
          borderBlockStartStyle: 'solid',
          borderColor: 'var(--border-color-subtle)',
        }}
      >
        {markers.map((marker) => (
          <li key={marker.slug}>
            <Box
              asChild
              css={{
                display: 'flex',
                alignItems: 'center',
                minHeight: '32px',
                padding:
                  (marker.depth ?? 2) > 2 ? '4px 8px 4px 24px' : '4px 8px',
                borderRadius: '4px',
                color: 'fg.muted',
                fontSize: '0.875rem',
                lineHeight: '1.375rem',
                textDecoration: 'none',
                '&:hover': {
                  backgroundColor: 'quiet.hover',
                  color: 'fg.emphasized',
                },
                '&:focus-visible': FOCUS_RING_CSS,
              }}
            >
              <NextLink href={`#${marker.slug}`} shallow>
                {marker.name}
              </NextLink>
            </Box>
          </li>
        ))}
      </Box>
    </Box>
  );
}
