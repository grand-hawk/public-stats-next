import { Flex } from '@chakra-ui/react';
import React from 'react';

import ClassesSection from '@/components/features/home/classesSection';
import LoadoutsSection from '@/components/features/home/loadoutsSection';
import NewestHero from '@/components/features/home/newestHero';
import Separator from '@/components/features/home/separator';
import { VEHICLE_CLASS_CATEGORIES } from '@/components/features/vehicles/classCategories';
import Layout from '@/components/layout/layout';
import PageMeta from '@/components/layout/pageMeta';
import SiteSearchHero from '@/components/layout/search/siteSearchHero';
import { usePlace } from '@/hooks/usePlace';
import { trpc } from '@/utils/trpc';

export default function Place() {
  const place = usePlace();
  if (!place) return null;

  const [home] = trpc.home.place.useSuspenseQuery({ placeId: place.placeId });
  const { classCounts, loadouts, newest } = home;

  const classes = VEHICLE_CLASS_CATEGORIES.filter(
    (c) => c.slug !== 'artillery',
  );

  return (
    <PageMeta
      exactTitle={`${place.placeName} Wiki`}
      description={`Vehicle stats, shell data and armor maps for ${place.placeName}.`}
    >
      <Layout overwriteTabLabel="">
        <Flex
          direction="column"
          gap={{ base: 6, md: 8 }}
          marginX="auto"
          maxWidth="6xl"
        >
          <SiteSearchHero />

          <ClassesSection
            classCounts={classCounts}
            classes={classes}
            initials={place.initials}
          />

          {loadouts.length > 0 && (
            <>
              <Separator />

              <LoadoutsSection initials={place.initials} loadouts={loadouts} />
            </>
          )}

          {newest && (
            <>
              <Separator />

              <NewestHero
                initials={place.initials}
                name={newest.name}
                role={newest.role}
                slug={newest.slug}
              />
            </>
          )}
        </Flex>
      </Layout>
    </PageMeta>
  );
}
