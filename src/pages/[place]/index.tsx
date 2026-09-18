import { Box } from '@chakra-ui/react';
import React from 'react';

import {
  Band,
  BandGrid,
  BandInner,
  spanAside,
  spanFull,
} from '@/components/features/home/grid';
import Ground from '@/components/features/home/ground';
import HomeHero from '@/components/features/home/hero';
import HighlightsBand from '@/components/features/home/highlightsBand';
import LinkCard from '@/components/features/home/linkCard';
import LoadoutsCard from '@/components/features/home/loadoutsCard';
import ToolsCard from '@/components/features/home/toolsCard';
import Layout from '@/components/layout/layout';
import PageMeta from '@/components/layout/pageMeta';
import { FOOTER_PUSH_MIN_HEIGHT } from '@/components/layout/shell/constants';
import SiteFooter from '@/components/layout/siteFooter';
import { usePlace } from '@/hooks/usePlace';
import { trpc } from '@/utils/trpc';

export default function Place() {
  const place = usePlace();
  if (!place) return null;

  const [home] = trpc.home.place.useSuspenseQuery({ placeId: place.placeId });
  const { classCounts, loadouts, newest } = home;
  const { initials, placeName } = place;
  const hasLoadouts = loadouts.length > 0;

  return (
    <PageMeta
      exactTitle={`${placeName} Wiki`}
      description={`Vehicle stats, shell data and armor maps for ${placeName}.`}
    >
      <Layout noPadding>
        <Box
          isolation="isolate"
          minHeight={FOOTER_PUSH_MIN_HEIGHT}
          position="relative"
        >
          <Ground />

          <HomeHero initials={initials} placeName={placeName} />

          <HighlightsBand
            classCounts={classCounts}
            initials={initials}
            newest={newest}
          />

          <Band css={{ paddingBlockEnd: '16px' }}>
            <BandInner>
              <BandGrid>
                <ToolsCard initials={initials} />

                <LinkCard
                  action="Browse shells"
                  body="Penetration, velocity and damage for every round in the game."
                  css={{ ...spanAside }}
                  href={`/${initials}/shells`}
                  title="Shells"
                />

                {hasLoadouts && (
                  <LoadoutsCard initials={initials} loadouts={loadouts} />
                )}

                <LinkCard
                  action="Browse teams"
                  body="Every faction and the vehicles it fields in each era."
                  css={hasLoadouts ? { ...spanAside } : { ...spanFull }}
                  href={`/${initials}/teams`}
                  title="Teams"
                />
              </BandGrid>
            </BandInner>
          </Band>

          <SiteFooter placeName={placeName} />
        </Box>
      </Layout>
    </PageMeta>
  );
}
