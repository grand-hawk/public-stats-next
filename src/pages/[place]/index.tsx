import { Box } from '@chakra-ui/react';
import React from 'react';

import {
  Band,
  BandGrid,
  BandInner,
  spanAside,
  spanRead,
} from '@/components/features/home/grid';
import Ground from '@/components/features/home/ground';
import HomeHero from '@/components/features/home/hero';
import HighlightsBand from '@/components/features/home/highlightsBand';
import HomeLinkIndex from '@/components/features/home/linkIndex';
import LoadoutsCard from '@/components/features/home/loadoutsCard';
import UpdatesCard from '@/components/features/home/updatesCard';
import Layout from '@/components/layout/layout';
import PageMeta from '@/components/layout/pageMeta';
import { FOOTER_PUSH_MIN_HEIGHT } from '@/components/layout/shell/constants';
import SiteFooter from '@/components/layout/siteFooter';
import { usePlace } from '@/hooks/usePlace';
import { trpc } from '@/utils/trpc';

const COLUMN_CSS = {
  display: 'grid',
  gap: '16px',
} as const;

export default function Place() {
  const place = usePlace();
  if (!place) return null;

  const [home] = trpc.home.place.useSuspenseQuery({ placeId: place.placeId });
  const [navigation] = trpc.articles.navigation.useSuspenseQuery({
    initials: place.initials,
  });
  const [updates] = trpc.updates.list.useSuspenseQuery({
    placeId: place.placeId,
  });
  const { classCounts, loadouts, newest } = home;
  const { initials, placeName } = place;
  const hasLoadouts = loadouts.length > 0;
  const wide = [
    hasLoadouts ? (
      <LoadoutsCard initials={initials} key="loadouts" loadouts={loadouts} />
    ) : null,
  ].filter(Boolean);

  const aside = [
    updates.length > 0 ? (
      <UpdatesCard initials={initials} key="updates" updates={updates} />
    ) : null,
  ].filter(Boolean);

  return (
    <PageMeta
      exactTitle={`${placeName} Wiki`}
      description={`Vehicle stats, shell data, armor maps and game mechanics for ${placeName}.`}
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
                <Box css={{ ...spanRead, ...COLUMN_CSS }}>{wide}</Box>
                <Box css={{ ...spanAside, ...COLUMN_CSS }}>{aside}</Box>
              </BandGrid>
            </BandInner>
          </Band>

          <Band css={{ paddingBlockEnd: '32px' }}>
            <BandInner>
              <HomeLinkIndex groups={navigation} initials={initials} />
            </BandInner>
          </Band>

          <SiteFooter placeName={placeName} />
        </Box>
      </Layout>
    </PageMeta>
  );
}
