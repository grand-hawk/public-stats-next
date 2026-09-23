import { Box, Flex, Text } from '@chakra-ui/react';
import NextImage from 'next/image';
import NextLink from 'next/link';
import React from 'react';

import { Card, CardPad, Kicker } from '@/components/features/home/card';
import {
  HERO_TEXT,
  HERO_TEXT_MUTED,
  TILE_SCRIM,
} from '@/components/features/home/palette';
import {
  DURATION_BASE,
  EASE,
  NARROW_MEDIA,
} from '@/components/layout/shell/constants';
import { loadoutDisplayName } from '@/utils/loadoutDisplayName';

export default function LoadoutsCard({
  initials,
  loadouts,
}: {
  initials: string;
  loadouts: {
    description: string;
    name: string;
    slug: string;
    thumbnail: string;
  }[];
}) {
  return (
    <Card>
      <CardPad>
        <Kicker>Loadouts</Kicker>
        <Flex
          css={{
            flexGrow: 1,
            gap: '12px',
            minWidth: 0,
            [NARROW_MEDIA]: { flexDirection: 'column' },
          }}
        >
          {loadouts.map((loadout) => (
            <Box
              asChild
              css={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                flex: '1 1 0',
                minWidth: 0,
                minHeight: '140px',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'var(--border-color-base)',
                borderRadius: '8px',
                overflow: 'hidden',
                transitionProperty: 'border-color',
                transitionDuration: DURATION_BASE,
                transitionTimingFunction: EASE,
                '&:hover': {
                  borderColor: 'var(--border-color-interactive--hover)',
                  textDecoration: 'none',
                },
                '&:hover .loadout-tile-img': { transform: 'scale(1.03)' },
              }}
              key={loadout.slug}
            >
              <NextLink
                href={`/${initials}/loadouts/${loadout.slug}`}
                prefetch={false}
              >
                <Box css={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                  <NextImage
                    alt=""
                    className="loadout-tile-img"
                    fill
                    sizes="(max-width: 640px) 100vw, 240px"
                    src={loadout.thumbnail}
                    style={{
                      objectFit: 'cover',
                      transition: `transform ${DURATION_BASE} ${EASE}`,
                    }}
                  />
                </Box>

                <Box
                  css={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 1,
                    background: TILE_SCRIM,
                  }}
                />

                <Box
                  css={{
                    position: 'relative',
                    zIndex: 2,
                    marginTop: 'auto',
                    minWidth: 0,
                    padding: '12px',
                  }}
                >
                  <Text
                    css={{
                      color: HERO_TEXT,
                      fontSize: '14px',
                      fontWeight: 500,
                      lineHeight: '22px',
                    }}
                    lineClamp={1}
                  >
                    {loadoutDisplayName(loadout.name)}
                  </Text>
                  <Text
                    css={{
                      color: HERO_TEXT_MUTED,
                      fontSize: '12px',
                      lineHeight: '20px',
                    }}
                    lineClamp={1}
                  >
                    {loadout.description}
                  </Text>
                </Box>
              </NextLink>
            </Box>
          ))}
        </Flex>
      </CardPad>
    </Card>
  );
}
