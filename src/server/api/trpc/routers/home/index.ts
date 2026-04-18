import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc/context';
import { getLoadoutListItems } from '@/server/utils/loadoutsList';
import { getClassification } from '@/utils/vehicleClassification';
import { getVehicles } from '@generated/vehicles';

import type { LoadoutListItem } from '@/server/utils/loadoutsList';
import type { PlaceId } from '@generated/config';

interface HomeNewestVehicle {
  name: string;
  role: string;
  slug: string;
}

interface PlaceHomePayload {
  classCounts: Record<string, number>;
  loadouts: LoadoutListItem[];
  newest: HomeNewestVehicle | null;
}

function pickHomeNewest(
  rows: {
    addedDate?: string;
    name: string;
    role: string;
    slug: string;
  }[],
): HomeNewestVehicle | null {
  if (rows.length === 0) return null;

  rows.sort((left, right) => left.name.localeCompare(right.name));
  const withDates = rows.filter(
    (row): row is typeof row & { addedDate: string } => Boolean(row.addedDate),
  );
  if (withDates.length > 0) {
    withDates.sort(
      (left, right) =>
        new Date(right.addedDate).getTime() -
        new Date(left.addedDate).getTime(),
    );
    const newestByDate = withDates[0];
    return {
      name: newestByDate.name,
      role: newestByDate.role,
      slug: newestByDate.slug,
    };
  }

  const firstAlphabetically = rows[0];
  return {
    name: firstAlphabetically.name,
    role: firstAlphabetically.role,
    slug: firstAlphabetically.slug,
  };
}

function placeHomePayload(placeId: PlaceId): PlaceHomePayload {
  const vehicles = getVehicles();
  const vehiclesData = vehicles.data[placeId]?.data;
  if (!vehiclesData) throw new TRPCError({ code: 'NOT_FOUND' });

  const classCounts: Record<string, number> = {};
  const rows: {
    addedDate?: string;
    name: string;
    role: string;
    slug: string;
  }[] = [];

  for (const [name, data] of Object.entries(vehiclesData)) {
    if (data.info.unlisted) continue;
    const classification = getClassification(data.info.role);
    classCounts[classification] = (classCounts[classification] ?? 0) + 1;
    rows.push({
      name,
      role: data.info.role,
      slug: data.info.slug,
      addedDate: data.info.addedDate,
    });
  }

  return {
    classCounts,
    loadouts: getLoadoutListItems(placeId),
    newest: pickHomeNewest(rows),
  };
}

export const homeRouter = createTRPCRouter({
  place: publicProcedure
    .input(
      z.object({
        placeId: z.string(),
      }),
    )
    .query(({ input }): PlaceHomePayload => {
      return placeHomePayload(input.placeId as PlaceId);
    }),
});
