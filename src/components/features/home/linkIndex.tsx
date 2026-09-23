import { Box } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import { Kicker } from '@/components/features/home/card';
import { tabs } from '@/components/layout/navigation/tabs';
import { NARROW_MEDIA } from '@/components/layout/shell/constants';
import { FOCUS_RING_CSS } from '@/components/ui/styles';

import type { TabKey } from '@/components/layout/navigation/tabs';
import type { NavGroup } from '@/server/api/trpc/routers/articles';

const SKIP_TABS = new Set(['updates']);

const LINK_CSS = {
  display: 'block',
  marginInline: '-8px',
  padding: '3px 8px',
  borderRadius: '4px',
  color: 'var(--color-progressive)',
  fontSize: '0.875rem',
  lineHeight: '1.375rem',
  textDecoration: 'none',
  '&:hover': { backgroundColor: 'quiet.hover', textDecoration: 'none' },
  '&:focus-visible': FOCUS_RING_CSS,
} as const;

function groupLinks(group: NavGroup, initials: string) {
  return group.links.flatMap((link) => {
    if (link.kind === 'article') {
      if (!link.nav) return [];
      return [{ href: `/${initials}/${link.slug}`, label: link.title }];
    }

    if (SKIP_TABS.has(link.tabKey)) return [];

    const tab = tabs[link.tabKey as TabKey];
    if (!tab) return [];

    return [
      { href: `/${initials}${tab.path}`, label: tab.longLabel ?? tab.label },
    ];
  });
}

export default function HomeLinkIndex({
  groups,
  initials,
}: {
  groups: NavGroup[];
  initials: string;
}) {
  const columns = groups
    .map((group) => ({ group, links: groupLinks(group, initials) }))
    .filter((column) => column.links.length > 0);

  if (columns.length === 0) return null;

  return (
    <Box
      as="nav"
      aria-label="Wiki index"
      css={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
        gap: '24px 16px',
        [NARROW_MEDIA]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
      }}
    >
      {columns.map(({ group, links }) => (
        <Box key={group.key} minWidth={0}>
          <Kicker>{group.label}</Kicker>

          <Box
            as="ul"
            css={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              marginBlockStart: '10px',
            }}
          >
            {links.map((link) => (
              <li key={link.href}>
                <Box asChild css={LINK_CSS}>
                  <NextLink href={link.href} prefetch={false}>
                    {link.label}
                  </NextLink>
                </Box>
              </li>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
