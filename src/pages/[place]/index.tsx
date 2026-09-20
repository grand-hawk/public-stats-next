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
import LinkCard from '@/components/features/home/linkCard';
import LoadoutsCard from '@/components/features/home/loadoutsCard';
import SubjectCard from '@/components/features/home/subjectCard';
import ToolsCard from '@/components/features/home/toolsCard';
import UpdatesCard from '@/components/features/home/updatesCard';
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
  const [navigation] = trpc.articles.navigation.useSuspenseQuery({
    initials: place.initials,
  });
  const [updates] = trpc.updates.list.useSuspenseQuery({
    placeId: place.placeId,
  });
  const { classCounts, loadouts, newest } = home;
  const { initials, placeName } = place;
  const hasLoadouts = loadouts.length > 0;
  const weapons = navigation.find((group) => group.key === 'weapons');
  const gameplay = navigation.find((group) => group.key === 'gameplay');

  const wide = [
    <ToolsCard initials={initials} key="tools" />,
    hasLoadouts ? (
      <LoadoutsCard initials={initials} key="loadouts" loadouts={loadouts} />
    ) : null,
    gameplay && gameplay.links.length > 0 ? (
      <SubjectCard
        columns={2}
        css={{ ...spanRead }}
        group={gameplay}
        initials={initials}
        key="gameplay"
      />
    ) : null,
  ].filter(Boolean);

  const aside = [
    weapons ? (
      <SubjectCard
        css={{ ...spanAside }}
        group={weapons}
        initials={initials}
        key="weapons"
      />
    ) : (
      <LinkCard
        action="Browse shells"
        body="Penetration, velocity and damage for every round in the game."
        css={{ ...spanAside }}
        href={`/${initials}/shells`}
        key="shells"
        title="Shells"
      />
    ),
    updates.length > 0 ? (
      <UpdatesCard
        css={{ ...spanAside }}
        initials={initials}
        key="updates"
        updates={updates}
      />
    ) : null,
    <LinkCard
      action="Browse teams"
      body="Every faction and the vehicles it fields in each era."
      css={{ ...spanAside }}
      href={`/${initials}/teams`}
      key="teams"
      title="Teams"
    />,
  ].filter(Boolean);

  const rows = Math.max(wide.length, aside.length);

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
                {Array.from({ length: rows }, (_, row) => (
                  <React.Fragment key={row}>
                    {wide[row]}
                    {aside[row]}
                  </React.Fragment>
                ))}
              </BandGrid>
            </BandInner>
          </Band>

          <SiteFooter placeName={placeName} />
        </Box>
      </Layout>
    </PageMeta>
  );
}
