import { Box } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { tabs } from '@/components/layout/navigation/tabs';
import { FOCUS_RING_CSS, RAISED_FRAME_CSS } from '@/components/ui/styles';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';
import { trpc } from '@/utils/trpc';

import type { TabKey } from '@/components/layout/navigation/tabs';
import type { NavLink } from '@/server/api/trpc/routers/articles';

const LINK_CSS = {
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '28px',
  padding: '0 8px',
  borderRadius: '4px',
  color: 'var(--color-progressive)',
  fontSize: '0.875rem',
  lineHeight: '1.375rem',
  textDecoration: 'none',
  '&:hover': { backgroundColor: 'quiet.hover', textDecoration: 'none' },
  '&:focus-visible': FOCUS_RING_CSS,
  '&[aria-current=page]': { color: 'fg.emphasized', fontWeight: 600 },
} as const;

function resolveLink(link: NavLink, initials: string) {
  if (link.kind === 'article') {
    return { href: `/${initials}/${link.slug}`, label: link.title };
  }

  const tab = tabs[link.tabKey as TabKey];
  if (!tab) return null;

  return { href: `/${initials}${tab.path}`, label: tab.longLabel ?? tab.label };
}

export default function Navbox({ group }: { group: string }) {
  const initials = usePlaceInitials();
  const router = useRouter();
  const [groups] = trpc.articles.navigation.useSuspenseQuery({ initials });

  const navGroup = groups.find((candidate) => candidate.key === group);
  if (!navGroup || navGroup.links.length < 2) return null;

  const currentPath = router.asPath.split(/[?#]/)[0];

  return (
    <Box
      aria-label={navGroup.label}
      as="nav"
      data-md-ignore
      css={{
        ...RAISED_FRAME_CSS,
        display: 'flex',
        alignItems: 'baseline',
        flexWrap: 'wrap',
        gap: '4px 12px',
        marginBlockStart: '32px',
        padding: '8px 8px 8px 16px',
      }}
    >
      <Box
        color="fg.emphasized"
        css={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: '28px' }}
      >
        {navGroup.label}
      </Box>

      <Box
        as="ul"
        css={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2px',
          margin: 0,
          padding: 0,
          listStyle: 'none',
        }}
      >
        {navGroup.links.map((link) => {
          const resolved = resolveLink(link, initials);
          if (!resolved) return null;

          return (
            <li key={resolved.href}>
              <Box asChild css={LINK_CSS}>
                <NextLink
                  aria-current={
                    resolved.href === currentPath ? 'page' : undefined
                  }
                  href={resolved.href}
                  prefetch={false}
                >
                  {resolved.label}
                </NextLink>
              </Box>
            </li>
          );
        })}
      </Box>
    </Box>
  );
}
