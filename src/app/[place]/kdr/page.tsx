import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import React from 'react';

import { prefetchPlace } from '@/trpc/server';

import PlaceKdrClient from './_client';

export default async function PlaceKdrPage({
  params,
}: {
  params: Promise<{ place: string }>;
}) {
  const { place: initials } = await params;
  const { helpers, place } = await prefetchPlace(initials);

  if (place) {
    await helpers.kdr.table.prefetch({ placeId: place.placeId });
  }

  return (
    <HydrationBoundary state={dehydrate(helpers.queryClient)}>
      <PlaceKdrClient />
    </HydrationBoundary>
  );
}
