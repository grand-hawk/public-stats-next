import { Box } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import { primaryTabKeys, tabs } from '@/components/layout/navigation/tabs';
import RailButton from '@/components/layout/rail/railButton';
import { useCurrentTab } from '@/hooks/useCurrentTab';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';

const FITS_MEDIA = {
  column: '@media (min-height: 480px)',
  row: '@media (min-width: 390px)',
} as const;

export default function RailQuickLinks({
  direction,
}: {
  direction: 'column' | 'row';
}) {
  const initials = usePlaceInitials();
  const currentTab = useCurrentTab();

  return (
    <Box
      css={{
        display: 'none',
        [FITS_MEDIA[direction]]: { display: 'contents' },
      }}
    >
      {primaryTabKeys.map((key) => {
        const tab = tabs[key];
        const TabIcon = tab.icon;
        const active = currentTab?.path === tab.path;

        return (
          <RailButton key={key} asChild active={active} label={tab.label}>
            <NextLink
              aria-current={active ? 'page' : undefined}
              href={`/${initials}${tab.path}`}
              prefetch={tab.prefetch}
            >
              <TabIcon />
            </NextLink>
          </RailButton>
        );
      })}
    </Box>
  );
}
