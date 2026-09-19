import { Box, Span } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import TeamFlagStrip from '@/components/icons/teams/flagStrip';
import { FOCUS_RING_CSS } from '@/components/ui/styles';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';

import type { VehicleFamilySummary } from '@/server/api/trpc/routers/vehicles';
import type { SystemStyleObject } from '@chakra-ui/react';

const GRID_CSS: SystemStyleObject = {
  display: 'grid',
  gap: '2px 16px',
  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
};

const ROW_CSS: SystemStyleObject = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  minHeight: '32px',
  paddingInline: '8px',
  borderRadius: '4px',
  color: 'var(--color-progressive)',
  fontSize: '0.875rem',
  textDecoration: 'none',
  '&:hover': { backgroundColor: 'quiet.hover', textDecoration: 'none' },
  '&:focus-visible': FOCUS_RING_CSS,
};

export default function FamilyLinks({
  families,
}: {
  families: VehicleFamilySummary[];
}) {
  const initials = usePlaceInitials()!;

  return (
    <Box css={GRID_CSS}>
      {families.map((family) => (
        <Box asChild key={family.slug} css={ROW_CSS}>
          <NextLink
            href={`/${initials}/vehicles/family/${family.slug}`}
            prefetch={false}
          >
            <TeamFlagStrip slots={3} teams={family.teams} />

            <Span flex="1" minWidth={0} truncate>
              {family.name}
            </Span>

            <Span color="fg.muted" flex="none" fontSize="xs">
              {family.count}
            </Span>
          </NextLink>
        </Box>
      ))}
    </Box>
  );
}
