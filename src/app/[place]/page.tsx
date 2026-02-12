import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import React from 'react';

import { prefetchPlace } from '@/trpc/server';

import PlaceClient from './_client';

export default async function PlacePage({
  params,
}: {
  params: Promise<{ place: string }>;
}) {
  const { place: initials } = await params;
  const { helpers } = await prefetchPlace(initials);

  return (
    <HydrationBoundary state={dehydrate(helpers.queryClient)}>
      <PlaceClient />
    </HydrationBoundary>
  );
}
