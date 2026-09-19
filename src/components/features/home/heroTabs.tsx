import { Box } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import {
  HERO_TABS_BORDER,
  HERO_TABS_DIVIDER,
  HERO_TABS_SURFACE,
  HERO_TABS_TEXT,
  HERO_TABS_TEXT_HOVER,
} from '@/components/features/home/palette';
import { NARROW_MEDIA } from '@/components/layout/shell/constants';

const HERO_TABS = [
  { label: 'Vehicles', path: '/vehicles' },
  { label: 'Shells', path: '/shells' },
  { label: 'Weapons', path: '/weapons' },
  { label: 'Teams', path: '/teams' },
  { label: 'K/D', path: '/kdr' },
  { label: 'Winrate', path: '/winrate' },
  { label: 'Armour', path: '/armor' },
];

export default function HeroTabs({ initials }: { initials: string }) {
  return (
    <Box
      css={{
        position: 'relative',
        zIndex: 1,
        display: 'inline-flex',
        alignSelf: 'flex-start',
        marginLeft: '32px',
        overflow: 'hidden',
        backgroundColor: HERO_TABS_SURFACE,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: HERO_TABS_BORDER,
        borderTopWidth: 0,
        borderRadius: '0 0 12px 12px',
        '& a': {
          paddingInline: '16px',
          fontSize: '12px',
          fontWeight: 500,
          lineHeight: '36px',
          color: HERO_TABS_TEXT,
        },
        '& a:hover': {
          color: HERO_TABS_TEXT_HOVER,
          backgroundColor:
            'color-mix(in oklch, var(--color-progressive) 10%, transparent)',
          textDecoration: 'none',
        },
        '& a + a': {
          borderLeftWidth: '1px',
          borderLeftStyle: 'solid',
          borderLeftColor: HERO_TABS_DIVIDER,
        },
        [NARROW_MEDIA]: {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          alignSelf: 'stretch',
          margin: '0 12px',
          borderRadius: '0 0 8px 8px',
          '& a': { paddingInline: 0, textAlign: 'center' },
          '& a:nth-child(4)': { borderLeftWidth: 0 },
          '& a:nth-child(n + 4)': {
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: HERO_TABS_DIVIDER,
          },
        },
      }}
    >
      {HERO_TABS.map((tab) => (
        <NextLink
          href={`/${initials}${tab.path}`}
          key={tab.path}
          prefetch={false}
        >
          {tab.label}
        </NextLink>
      ))}
    </Box>
  );
}
