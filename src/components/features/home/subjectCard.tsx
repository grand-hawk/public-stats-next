import React from 'react';
import { LuFileText } from 'react-icons/lu';

import { Card, CardPad, Kicker } from '@/components/features/home/card';
import { LinkRow, LinkRowGrid } from '@/components/features/home/linkRows';
import { tabs } from '@/components/layout/navigation/tabs';

import type { TabKey } from '@/components/layout/navigation/tabs';
import type { NavGroup } from '@/server/api/trpc/routers/articles';
import type { SystemStyleObject } from '@chakra-ui/react';

export default function SubjectCard({
  columns = 1,
  css,
  group,
  initials,
}: {
  columns?: 1 | 2;
  css?: SystemStyleObject;
  group: NavGroup;
  initials: string;
}) {
  return (
    <Card css={css}>
      <CardPad>
        <Kicker>{group.label}</Kicker>

        <LinkRowGrid columns={columns}>
          {group.links.map((link) => {
            if (link.kind === 'article') {
              if (!link.nav) return null;

              return (
                <LinkRow
                  blurb={link.summary}
                  href={`/${initials}/${link.slug}`}
                  icon={<LuFileText size={16} />}
                  key={link.slug}
                  label={link.title}
                />
              );
            }

            const tab = tabs[link.tabKey as TabKey];
            if (!tab) return null;
            const TabIcon = tab.icon;

            return (
              <LinkRow
                blurb={tab.description}
                href={`/${initials}${tab.path}`}
                icon={<TabIcon height="16px" width="16px" />}
                key={link.tabKey}
                label={tab.longLabel ?? tab.label}
              />
            );
          })}
        </LinkRowGrid>
      </CardPad>
    </Card>
  );
}
