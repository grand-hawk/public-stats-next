import React from 'react';

import { usePlace } from '@/hooks/usePlace';
import { trpc } from '@/utils/trpc';

import type { DetailedShell } from '@/server/api/trpc/routers/shells';
import type { DetailedVehicle } from '@/server/api/trpc/routers/vehicles';

interface DataLoaderProps<T> {
  children: (items: T[], loadingCount: number) => React.ReactNode;
  slugs: string[];
}

function render<T>(
  children: DataLoaderProps<T>['children'],
  queries: { data?: T | null; isLoading: boolean }[],
) {
  const items = queries
    .map((query) => query.data)
    .filter((item): item is T => item != null);

  return (
    <>{children(items, queries.filter((query) => query.isLoading).length)}</>
  );
}

export function VehicleDataLoader({
  children,
  slugs,
}: DataLoaderProps<DetailedVehicle>) {
  const place = usePlace()!;

  const queries = trpc.useQueries((t) =>
    slugs.map((slug) => t.vehicles.bySlug({ placeId: place.placeId, slug })),
  );

  return render(children, queries);
}

export function ShellDataLoader({
  children,
  slugs,
}: DataLoaderProps<DetailedShell>) {
  const place = usePlace()!;

  const queries = trpc.useQueries((t) =>
    slugs.map((slug) => t.shells.bySlug({ placeId: place.placeId, slug })),
  );

  return render(children, queries);
}
