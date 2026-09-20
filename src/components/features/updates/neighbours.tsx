import { Box, Span } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

import { FOCUS_RING_CSS, RAISED_FRAME_CSS } from '@/components/ui/styles';
import { updateDateLabel } from '@/utils/updateDate';

import type { UpdateSummary } from '@/server/utils/updates/types';

const LINK_CSS = {
  ...RAISED_FRAME_CSS,
  alignItems: 'baseline',
  display: 'flex',
  fontSize: '0.875rem',
  gap: '8px',
  minWidth: 0,
  padding: '6px 10px',
  textDecoration: 'none',
  '&:hover': { borderColor: 'border.emphasized' },
  '&:focus-visible': FOCUS_RING_CSS,
} as const;

const MUTED_CSS = { color: 'fg.subtle', flex: 'none' } as const;

function NeighbourLink({
  direction,
  initials,
  update,
}: {
  direction: 'previous' | 'next';
  initials: string;
  update: UpdateSummary;
}) {
  const isPrevious = direction === 'previous';
  const Arrow = isPrevious ? LuChevronLeft : LuChevronRight;
  const date = updateDateLabel(update);

  return (
    <Box
      asChild
      css={{
        ...LINK_CSS,
        gridColumn: isPrevious ? 1 : 2,
        justifyContent: isPrevious ? 'start' : 'end',
      }}
    >
      <NextLink href={`/${initials}/updates/${update.slug}`} prefetch={false}>
        {isPrevious ? (
          <Span css={{ ...MUTED_CSS, alignSelf: 'center' }}>
            <Arrow aria-hidden />
          </Span>
        ) : null}

        <Span css={MUTED_CSS}>{isPrevious ? 'Previous' : 'Next'}</Span>

        <Span color="fg.emphasized" fontWeight={600} minWidth={0} truncate>
          {update.title}
        </Span>

        {date ? (
          <Span css={MUTED_CSS} hideBelow="md">
            {date}
          </Span>
        ) : null}

        {isPrevious ? null : (
          <Span css={{ ...MUTED_CSS, alignSelf: 'center' }}>
            <Arrow aria-hidden />
          </Span>
        )}
      </NextLink>
    </Box>
  );
}

export default function UpdateNeighbours({
  initials,
  next,
  previous,
}: {
  initials: string;
  next?: UpdateSummary;
  previous?: UpdateSummary;
}) {
  if (!previous && !next) return null;

  return (
    <Box
      as="nav"
      aria-label="Updates"
      data-md-ignore
      css={{
        display: 'grid',
        gap: '8px',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        marginBlockStart: '16px',
      }}
    >
      {previous ? (
        <NeighbourLink
          direction="previous"
          initials={initials}
          update={previous}
        />
      ) : null}

      {next ? (
        <NeighbourLink direction="next" initials={initials} update={next} />
      ) : null}
    </Box>
  );
}
