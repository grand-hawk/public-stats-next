import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import React from 'react';
import slugify from 'slug';

import { prefetchPlace } from '@/trpc/server';

import PlaceTeamClient from './_client';

export default async function PlaceTeamPage({
  params,
}: {
  params: Promise<{ place: string; team: string }>;
}) {
  const { place: initials, team } = await params;
  const { helpers, place } = await prefetchPlace(initials);

  if (place) {
    const teamSlug = slugify(team);
    await helpers.teams.bySlug.prefetch({
      placeId: place.placeId,
      slug: teamSlug,
    });
  }

  return (
    <HydrationBoundary state={dehydrate(helpers.queryClient)}>
      <PlaceTeamClient />
    </HydrationBoundary>
  );
}
