import { Text } from '@chakra-ui/react';
import React from 'react';

import InfantryWeaponsBrowse from '@/components/features/infantryWeapons/browse';
import ArticlePage from '@/components/layout/articlePage';
import Layout from '@/components/layout/layout';
import PageMeta from '@/components/layout/pageMeta';
import ArticleTitle from '@/components/wiki/articleTitle';
import Navbox from '@/components/wiki/navbox';
import { usePlace } from '@/hooks/usePlace';

export default function PlaceInfantryWeapons() {
  const place = usePlace()!;

  return (
    <PageMeta
      title="Infantry weapons"
      description={`Every infantry weapon in ${place.placeName}, with penetration, damage, rate of fire and availability`}
    >
      <Layout noPadding>
        <ArticlePage
          markdownTarget
          placeName={place.placeName}
          titleId="infantry-weapons-page-title"
        >
          <ArticleTitle
            id="infantry-weapons-page-title"
            title="Infantry weapons"
          />

          <Text
            color="fg"
            css={{
              fontSize: '1rem',
              lineHeight: '1.625rem',
              marginBlockStart: '24px',
            }}
          >
            Infantry weapons are the rifles, machine guns, pistols and launchers
            that players carry. Each weapon is available to certain loadouts,
            teams and classes, and its page lists them.
          </Text>

          <InfantryWeaponsBrowse />
          <Navbox group="weapons" />
        </ArticlePage>
      </Layout>
    </PageMeta>
  );
}
