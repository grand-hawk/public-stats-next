import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import React from 'react';

import { prefetchPlace } from '@/trpc/server';

import PlaceWinrateClient from './_client';

export default async function PlaceWinratePage({
  params,
}: {
  params: Promise<{ place: string }>;
}) {
  const { place: initials } = await params;
  const { helpers, place } = await prefetchPlace(initials);

  if (place)
    await helpers.winrate.metadata.prefetch({ placeId: place.placeId });

  return (
    <HydrationBoundary state={dehydrate(helpers.queryClient)}>
      <PlaceWinrateClient />
    </HydrationBoundary>
  );
}
