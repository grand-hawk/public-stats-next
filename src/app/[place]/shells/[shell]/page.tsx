import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import React from 'react';
import slug from 'slug';

import { prefetchPlace } from '@/trpc/server';

import PlaceShellClient from './_client';

export default async function PlaceShellPage({
  params,
}: {
  params: Promise<{ place: string; shell: string }>;
}) {
  const { place: initials, shell } = await params;
  const { helpers, place } = await prefetchPlace(initials);

  if (place) {
    const shellSlug = slug(shell);
    await Promise.all([
      helpers.shells.list.prefetch({ placeId: place.placeId }),
      helpers.shells.bySlug.prefetch({ placeId: place.placeId, slug: shellSlug }),
    ]);
  }

  return (
    <HydrationBoundary state={dehydrate(helpers.queryClient)}>
      <PlaceShellClient />
    </HydrationBoundary>
  );
}
