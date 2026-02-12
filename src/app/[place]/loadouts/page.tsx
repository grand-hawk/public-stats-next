import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import React from 'react';

import { prefetchPlace } from '@/trpc/server';

import PlaceLoadoutsClient from './_client';

export default async function PlaceLoadoutsPage({
  params,
}: {
  params: Promise<{ place: string }>;
}) {
  const { place: initials } = await params;
  const { helpers, place } = await prefetchPlace(initials);

  if (place)
    await helpers.loadouts.list.prefetch({ placeId: place.placeId });

  return (
    <HydrationBoundary state={dehydrate(helpers.queryClient)}>
      <PlaceLoadoutsClient />
    </HydrationBoundary>
  );
}
