import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import React from 'react';
import slugify from 'slug';

import { prefetchPlace } from '@/trpc/server';

import PlaceLoadoutClient from './_client';

export default async function PlaceLoadoutPage({
  params,
}: {
  params: Promise<{ place: string; loadout: string }>;
}) {
  const { loadout, place: initials } = await params;
  const { helpers, place } = await prefetchPlace(initials);

  if (place) {
    const loadoutSlug = slugify(loadout);
    await helpers.loadouts.bySlug.prefetch({
      placeId: place.placeId,
      slug: loadoutSlug,
    });
  }

  return (
    <HydrationBoundary state={dehydrate(helpers.queryClient)}>
      <PlaceLoadoutClient />
    </HydrationBoundary>
  );
}
