import { Box, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import {
  Card,
  CardMore,
  CardPad,
  Kicker,
} from '@/components/features/home/card';
import { spanAside } from '@/components/features/home/grid';
import HomeRowLink from '@/components/features/home/rowLink';
import { VEHICLE_CLASS_CATEGORIES } from '@/components/features/vehicles/classCategories';

export default function ClassesCard({
  classCounts,
  initials,
}: {
  classCounts: Record<string, number>;
  initials: string;
}) {
  return (
    <Card css={{ ...spanAside }}>
      <CardPad>
        <Kicker>Vehicle classes</Kicker>
        <Box
          aria-label="Vehicle classes"
          color="fg.muted"
          css={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            fontSize: '14px',
            lineHeight: '22px',
          }}
          role="group"
        >
          {VEHICLE_CLASS_CATEGORIES.map((category) => (
            <Box
              css={{
                display: 'flex',
                flex: 1,
                paddingBlock: '2px',
                '& + &': {
                  borderBlockStartWidth: '1px',
                  borderBlockStartStyle: 'solid',
                  borderBlockStartColor: 'var(--border-color-subtle)',
                },
              }}
              key={category.slug}
            >
              <HomeRowLink
                css={{
                  minBlockSize: '32px',
                  paddingBlock: '4px',
                  color: 'var(--color-subtle)',
                }}
                hoverCss={{ color: 'var(--color-emphasized)' }}
                href={`/${initials}/vehicles/class/${category.slug}`}
              >
                <Box flex={1} minWidth={0}>
                  {category.label}
                </Box>
                <Text
                  css={{
                    color: 'inherit',
                    fontFamily: 'var(--font-family-monospace)',
                    fontSize: '12px',
                    fontVariantNumeric: 'tabular-nums',
                    lineHeight: '20px',
                    opacity: 0.8,
                  }}
                >
                  {classCounts[category.name] ?? 0}
                </Text>
              </HomeRowLink>
            </Box>
          ))}
        </Box>
        <CardMore>
          <NextLink href={`/${initials}/vehicles`} prefetch={false}>
            See all classes
          </NextLink>
        </CardMore>
      </CardPad>
    </Card>
  );
}
