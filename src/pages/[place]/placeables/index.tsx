import { Text } from '@chakra-ui/react';
import React from 'react';

import PlaceablesBrowse from '@/components/features/placeables/browse';
import ArticlePage from '@/components/layout/articlePage';
import Layout from '@/components/layout/layout';
import PageMeta from '@/components/layout/pageMeta';
import ArticleTitle from '@/components/wiki/articleTitle';
import Navbox from '@/components/wiki/navbox';
import { usePlace } from '@/hooks/usePlace';

export default function PlacePlaceables() {
  const place = usePlace()!;

  return (
    <PageMeta
      title="Placeables"
      description={`Every placeable in ${place.placeName}, with its cost, the classes that can place it and what it does`}
    >
      <Layout noPadding>
        <ArticlePage
          markdownTarget
          placeName={place.placeName}
          titleId="placeables-page-title"
        >
          <ArticleTitle id="placeables-page-title" title="Placeables" />

          <Text
            color="fg"
            css={{
              fontSize: '1rem',
              lineHeight: '1.625rem',
              marginBlockStart: '24px',
            }}
          >
            Placeables are the guns, armour, structures and explosives that
            players put down during a match. Weapons and explosives take up a
            class slot, everything else is paid for with points from a build
            tool, and each page lists what it costs and who can place it.
          </Text>

          <PlaceablesBrowse />
          <Navbox group="weapons" />
        </ArticlePage>
      </Layout>
    </PageMeta>
  );
}
