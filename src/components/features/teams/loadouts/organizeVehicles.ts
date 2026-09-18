import {
  classificationOrder,
  getClassification,
} from '@/utils/vehicleClassification';

import type { LoadoutVehicle } from '@/server/api/trpc/routers/loadouts';
import type { TeamVehicle } from '@/server/api/trpc/routers/teams';

export type GridVehicle = TeamVehicle & {
  premium?: LoadoutVehicle['premium'];
};

export interface OrganizedVehicle {
  name: string;
  slug: string;
  vehicle: GridVehicle;
}

export interface OrganizedVehicles {
  classifications: string[];
  tiers: number[];
  byTierAndClassification: Record<number, Record<string, OrganizedVehicle[]>>;
}

export function organizeVehicles(
  entries: [string, GridVehicle][],
): OrganizedVehicles {
  const classificationsSet = new Set<string>();
  const tiersSet = new Set<number>();

  for (const [, vehicle] of entries) {
    classificationsSet.add(getClassification(vehicle.role));
    tiersSet.add(vehicle.tier);
  }

  const classifications = classificationOrder.filter((c) =>
    classificationsSet.has(c),
  );
  const tiers = Array.from(tiersSet).sort((a, b) => a - b);

  const byTierAndClassification: OrganizedVehicles['byTierAndClassification'] =
    {};

  for (const tier of tiers) {
    byTierAndClassification[tier] = {};
    for (const classification of classifications) {
      byTierAndClassification[tier][classification] = [];
    }
  }

  for (const [vehicleName, vehicle] of entries) {
    byTierAndClassification[vehicle.tier][getClassification(vehicle.role)].push(
      { name: vehicleName, slug: vehicle.slug, vehicle },
    );
  }

  for (const tier of tiers) {
    for (const classification of classifications) {
      byTierAndClassification[tier][classification].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
    }
  }

  return { classifications, tiers, byTierAndClassification };
}
