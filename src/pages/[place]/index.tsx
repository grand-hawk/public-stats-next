import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import Layout from '@/components/layout/layout';
import {
  primaryTabKeys,
  secondaryTabKeys,
  tabs,
  toolsTabKeys,
} from '@/components/layout/navigation/tabs';
import NavCard from '@/components/wiki/navCard';
import SectionDivider from '@/components/wiki/sectionDivider';
import { usePlace } from '@/hooks/usePlace';
import { formatTitle } from '@/utils/formatTitle';

export default function Place() {
  const place = usePlace();
  const router = useRouter();

  if (!place) return null;

  const description = `Vehicle stats, shell performance, team compositions, and more for ${place.placeName}.`;

  return (
    <>
      <Head>
        <title>{formatTitle(null, place.initials)}</title>

        <meta key="og:title" content={place.placeName} property="og:title" />
        <meta key="description" content={description} name="description" />
        <meta
          key="og:description"
          content={description}
          property="og:description"
        />
      </Head>

      <Layout overwriteTabLabel="">
        <Flex
          flexDirection="column"
          gap={10}
          marginX="auto"
          maxWidth="6xl"
          paddingY={8}
          position="relative"
        >
          <Box position="relative">
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              opacity={0.03}
              pointerEvents="none"
              css={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
              }}
            />

            <Flex direction="column" gap={3} position="relative">
              <Heading
                size="3xl"
                fontWeight="bold"
                letterSpacing="tight"
                lineHeight="1.1"
                css={{
                  animation: 'heroFadeIn 0.6s ease-out',
                  '@keyframes heroFadeIn': {
                    from: { opacity: 0, transform: 'translateY(-10px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                  },
                }}
              >
                {place.placeName}
              </Heading>

              <Text
                color="fg.muted"
                fontSize="md"
                maxWidth="xl"
                css={{
                  animation: 'heroFadeIn 0.6s ease-out 0.1s both',
                  '@keyframes heroFadeIn': {
                    from: { opacity: 0, transform: 'translateY(-10px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                  },
                }}
              >
                Vehicle stats, shell performance, team compositions, and more.
              </Text>
            </Flex>

            <Box
              position="absolute"
              top={-2}
              right={0}
              width="80px"
              height="80px"
              borderTopWidth="2px"
              borderRightWidth="2px"
              borderColor="whiteAlpha.100"
              display={{ base: 'none', md: 'block' }}
            />
          </Box>

          <div>
            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
              gap={5}
            >
              {primaryTabKeys.map((key) => {
                const item = tabs[key];
                return (
                  <NavCard
                    key={key}
                    item={item}
                    featured
                    onClick={() =>
                      router.push(`/${place.initials}${item.path}`)
                    }
                  />
                );
              })}
            </Grid>
          </div>

          <div>
            <SectionDivider label="Analytics" />

            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
              gap={5}
            >
              {secondaryTabKeys.map((key) => {
                const item = tabs[key];
                return (
                  <NavCard
                    key={key}
                    item={item}
                    onClick={() =>
                      router.push(`/${place.initials}${item.path}`)
                    }
                  />
                );
              })}
            </Grid>
          </div>

          <div>
            <SectionDivider label="Tools" />

            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
              gap={5}
            >
              {toolsTabKeys.map((key) => {
                const item = tabs[key];
                return (
                  <NavCard
                    key={key}
                    item={item}
                    onClick={() =>
                      router.push(`/${place.initials}${item.path}`)
                    }
                  />
                );
              })}
            </Grid>
          </div>
        </Flex>
      </Layout>
    </>
  );
}
