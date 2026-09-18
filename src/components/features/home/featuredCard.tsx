import { Box, Flex, VisuallyHidden } from '@chakra-ui/react';
import NextImage from 'next/image';
import NextLink from 'next/link';
import React from 'react';

import { Card } from '@/components/features/home/card';
import { spanRead } from '@/components/features/home/grid';
import {
  FEATURED_BADGE_BORDER,
  FEATURED_BADGE_SURFACE,
  FEATURED_BADGE_TEXT,
  FEATURED_SCRIM,
  HERO_TEXT,
  HERO_TEXT_MUTED,
} from '@/components/features/home/palette';
import {
  DURATION_BASE,
  EASE,
  SUB900_MEDIA,
} from '@/components/layout/shell/constants';
import { getVehicleImage } from '@/utils/getVehicleImage';

const MOTION = {
  transitionProperty: 'transform, opacity',
  transitionDuration: DURATION_BASE,
  transitionTimingFunction: EASE,
} as const;

export default function FeaturedCard({
  initials,
  name,
  role,
  slug,
}: {
  initials: string;
  name: string;
  role: string;
  slug: string;
}) {
  return (
    <Card
      css={{
        ...spanRead,
        transitionProperty: 'border-color',
        transitionDuration: DURATION_BASE,
        transitionTimingFunction: EASE,
        '&:hover, &[data-hover]': {
          borderColor: 'var(--border-color-interactive--hover)',
        },
      }}
    >
      <Box
        css={{
          position: 'relative',
          zIndex: 0,
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          aspectRatio: '16 / 9',
          [SUB900_MEDIA]: { minBlockSize: '220px' },
          '&:hover .feat-img, &[data-hover] .feat-img': {
            transform: 'scale(1.03)',
          },
          '&:hover .feat-scrim, &:hover .feat-body, &[data-hover] .feat-scrim, &[data-hover] .feat-body':
            {
              transform: 'translateY(100%)',
              opacity: 0,
            },
          '@media (prefers-reduced-motion: reduce)': {
            '&:hover .feat-scrim, &:hover .feat-body, &[data-hover] .feat-scrim, &[data-hover] .feat-body':
              {
                transform: 'none',
              },
          },
        }}
      >
        <Box css={{ position: 'absolute', inset: 0, zIndex: -1 }}>
          <NextImage
            alt=""
            className="feat-img"
            fill
            sizes="(max-width: 899px) 100vw, 720px"
            src={getVehicleImage(slug, 'perspective')}
            style={{
              objectFit: 'cover',
              transition: `transform ${DURATION_BASE} ${EASE}`,
            }}
          />
        </Box>

        <Box
          className="feat-scrim"
          css={{
            position: 'absolute',
            inset: 0,
            zIndex: -1,
            background: FEATURED_SCRIM,
            ...MOTION,
          }}
        />

        <Flex
          className="feat-body"
          direction="column"
          css={{
            gap: '4px',
            marginTop: 'auto',
            minWidth: 0,
            padding: '12px',
            ...MOTION,
          }}
        >
          <Flex>
            <Box
              css={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 8px',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: FEATURED_BADGE_BORDER,
                borderRadius: '4px',
                backgroundColor: FEATURED_BADGE_SURFACE,
                color: FEATURED_BADGE_TEXT,
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: 1,
                whiteSpace: 'nowrap',
              }}
            >
              Newest
            </Box>
          </Flex>

          <Flex
            alignItems="baseline"
            css={{ gap: '16px', justifyContent: 'space-between', minWidth: 0 }}
          >
            <Box
              as="h2"
              css={{
                margin: 0,
                minWidth: 0,
                color: HERO_TEXT,
                fontSize: '2.5rem',
                fontWeight: 500,
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                [SUB900_MEDIA]: { fontSize: '1.875rem' },
              }}
            >
              {name}
            </Box>
            <Box
              css={{
                flex: '0 1 auto',
                minWidth: 0,
                color: HERO_TEXT_MUTED,
                fontSize: '14px',
                fontStyle: 'italic',
                lineHeight: '22px',
                textAlign: 'right',
              }}
            >
              {role}
            </Box>
          </Flex>
        </Flex>

        <Box css={{ '& a': { position: 'absolute', inset: 0, zIndex: 1 } }}>
          <NextLink href={`/${initials}/vehicles/${slug}`} prefetch={false}>
            <VisuallyHidden>{name}</VisuallyHidden>
          </NextLink>
        </Box>
      </Box>
    </Card>
  );
}
