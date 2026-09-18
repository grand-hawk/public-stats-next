import { Box, Text } from '@chakra-ui/react';
import React from 'react';

import { Card, CardPad, Kicker } from '@/components/features/home/card';
import { spanRead } from '@/components/features/home/grid';
import HomeRowLink from '@/components/features/home/rowLink';
import { tabs } from '@/components/layout/navigation/tabs';
import {
  DURATION_BASE,
  EASE,
  NARROW_MEDIA,
} from '@/components/layout/shell/constants';

const HAIRLINE = {
  borderBlockStartWidth: '1px',
  borderBlockStartStyle: 'solid',
  borderBlockStartColor: 'var(--border-color-subtle)',
} as const;

const TOOLS = [
  { tab: tabs.compare, blurb: 'Vehicles or shells, side by side' },
  { tab: tabs.armour, blurb: 'Armour thickness, mapped on the hull' },
  { tab: tabs.kdr, blurb: 'Kill-to-death ratio for every vehicle' },
  { tab: tabs.winrate, blurb: 'Team results by map and loadout' },
];

export default function ToolsCard({ initials }: { initials: string }) {
  return (
    <Card css={{ ...spanRead }}>
      <CardPad>
        <Kicker>Tools</Kicker>

        <Box
          css={{
            display: 'grid',
            flexGrow: 1,
            gridAutoRows: 'minmax(min-content, 1fr)',
            gridTemplateColumns: '1fr 1fr',
            gap: '0 16px',
            [NARROW_MEDIA]: { gridTemplateColumns: '1fr' },
          }}
        >
          {TOOLS.map(({ blurb, tab }) => {
            const TabIcon = tab.icon;

            return (
              <Box
                css={{
                  display: 'flex',
                  minWidth: 0,
                  paddingBlock: '2px',
                  '&:nth-child(n + 3)': HAIRLINE,
                  [NARROW_MEDIA]: { '&:nth-child(n + 2)': HAIRLINE },
                }}
                key={tab.path}
              >
                <HomeRowLink
                  css={{
                    paddingBlock: '6px',
                    '& svg': {
                      color: 'var(--color-subtle)',
                      transitionProperty: 'color',
                      transitionDuration: DURATION_BASE,
                      transitionTimingFunction: EASE,
                    },
                    '&:hover svg': { color: 'var(--color-base)' },
                  }}
                  href={`/${initials}${tab.path}`}
                >
                  <Box css={{ flex: 'none' }}>
                    <TabIcon height="16px" width="16px" />
                  </Box>
                  <Box minWidth={0}>
                    <Text
                      color="fg.emphasized"
                      css={{ fontSize: '14px', fontWeight: 500 }}
                      lineHeight="22px"
                    >
                      {tab.longLabel ?? tab.label}
                    </Text>
                    <Text
                      color="fg.muted"
                      css={{ fontSize: '12px', lineHeight: '20px' }}
                      lineClamp={1}
                    >
                      {blurb}
                    </Text>
                  </Box>
                </HomeRowLink>
              </Box>
            );
          })}
        </Box>
      </CardPad>
    </Card>
  );
}
