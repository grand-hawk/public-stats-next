import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import React from 'react';
import slug from 'slug';

import { prefetchPlace } from '@/trpc/server';

import PlaceVehicleClient from './_client';

export default async function PlaceVehiclePage({
  params,
}: {
  params: Promise<{ place: string; vehicle: string }>;
}) {
  const { place: initials, vehicle } = await params;
  const { helpers, place } = await prefetchPlace(initials);

  if (place) {
    const vehicleSlug = slug(vehicle);
    await Promise.all([
      helpers.vehicles.list.prefetch({ placeId: place.placeId }),
      helpers.vehicles.bySlug.prefetch({
        placeId: place.placeId,
        slug: vehicleSlug,
      }),
    ]);
  }

  return (
    <HydrationBoundary state={dehydrate(helpers.queryClient)}>
      <PlaceVehicleClient />
    </HydrationBoundary>
  );
}
