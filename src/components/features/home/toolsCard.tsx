import React from 'react';

import { Card, CardPad, Kicker } from '@/components/features/home/card';
import { LinkRow, LinkRowGrid } from '@/components/features/home/linkRows';
import { tabs } from '@/components/layout/navigation/tabs';

const TOOLS = [
  { tab: tabs.compare, blurb: 'Vehicles or shells, side by side' },
  { tab: tabs.armour, blurb: 'Armour thickness, mapped on the hull' },
  { tab: tabs.kdr, blurb: 'Kill-to-death ratio for every vehicle' },
  { tab: tabs.winrate, blurb: 'Team results by map and loadout' },
];

export default function ToolsCard({ initials }: { initials: string }) {
  return (
    <Card>
      <CardPad>
        <Kicker>Tools</Kicker>

        <LinkRowGrid>
          {TOOLS.map(({ blurb, tab }) => {
            const TabIcon = tab.icon;

            return (
              <LinkRow
                blurb={blurb}
                href={`/${initials}${tab.path}`}
                icon={<TabIcon height="16px" width="16px" />}
                key={tab.path}
                label={tab.longLabel ?? tab.label}
              />
            );
          })}
        </LinkRowGrid>
      </CardPad>
    </Card>
  );
}
