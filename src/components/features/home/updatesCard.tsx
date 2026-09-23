import { Box, Span, Stack } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import {
  Card,
  CardMore,
  CardPad,
  CardTitle,
} from '@/components/features/home/card';
import { FOCUS_RING_CSS } from '@/components/ui/styles';
import { formatUpdateDate, updateDateLabel } from '@/utils/updateDate';

import type { UpdateSummary } from '@/server/utils/updates/types';
import type { SystemStyleObject } from '@chakra-ui/react';

const SHOWN = 3;

const ROW_CSS: SystemStyleObject = {
  alignItems: 'baseline',
  color: 'fg',
  display: 'flex',
  gap: '12px',
  justifyContent: 'space-between',
  paddingBlock: '6px',
  textDecoration: 'none',
  '& + &': { borderBlockStartWidth: '1px', borderColor: 'border.subtle' },
  '&:hover': { color: 'var(--color-progressive--hover)' },
  '&:focus-visible': FOCUS_RING_CSS,
};

export default function UpdatesCard({
  css,
  initials,
  updates,
}: {
  css?: SystemStyleObject;
  initials: string;
  updates: UpdateSummary[];
}) {
  if (updates.length === 0) return null;

  return (
    <Card css={css}>
      <CardPad>
        <CardTitle as="h2">Updates</CardTitle>

        <Stack gap={0} marginBlockStart="8px" minWidth={0}>
          {updates.slice(0, SHOWN).map((update) => (
            <Box asChild css={ROW_CSS} key={update.slug}>
              <NextLink
                href={`/${initials}/updates/${update.slug}`}
                prefetch={false}
              >
                <Span minWidth={0} truncate>
                  {update.title}
                </Span>

                <Span color="fg.subtle" flex="none" fontSize="0.8125rem">
                  {updateDateLabel(update)
                    ? formatUpdateDate(update.date)
                    : null}
                </Span>
              </NextLink>
            </Box>
          ))}
        </Stack>

        <CardMore>
          <NextLink href={`/${initials}/updates`} prefetch={false}>
            See all updates
          </NextLink>
        </CardMore>
      </CardPad>
    </Card>
  );
}
