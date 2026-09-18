import {
  buildSearchIndex,
  getEraOrder,
  getRosterTeams,
} from '@/server/api/trpc/routers/vehicles/searchIndex';
import { classificationOrder } from '@/utils/vehicleClassification';

import type { PlaceId } from '@generated/config';

export interface VehicleFacetOptions {
  classifications: string[];
  crewClasses: string[];
  eras: string[];
  locomotions: string[];
  obtainments: string[];
  teams: string[];
}

const facetOptionsCache = new Map<PlaceId, VehicleFacetOptions>();

export function buildFacetOptions(placeId: PlaceId): VehicleFacetOptions {
  const cached = facetOptionsCache.get(placeId);
  if (cached) return cached;

  const entries = buildSearchIndex(placeId);

  const classMap = new Map<string, number>();
  const obtMap = new Map<string, number>();
  const classSet = new Set<string>();
  const eraSet = new Set<string>();
  const locomotionMap = new Map<string, number>();

  for (const entry of entries) {
    classMap.set(
      entry.classification,
      (classMap.get(entry.classification) ?? 0) + 1,
    );
    obtMap.set(entry.obtainment, (obtMap.get(entry.obtainment) ?? 0) + 1);
    for (const supportedClass of entry.supportedClasses) {
      classSet.add(supportedClass);
    }
    for (const roster of entry.rosters) {
      eraSet.add(roster.era);
    }
    locomotionMap.set(
      entry.locomotion,
      (locomotionMap.get(entry.locomotion) ?? 0) + 1,
    );
  }

  const options: VehicleFacetOptions = {
    classifications: classificationOrder.filter(
      (classification) =>
        classification !== 'Other' && classMap.has(classification),
    ),
    crewClasses: [...classSet].sort(),
    eras: getEraOrder(placeId).filter((era) => eraSet.has(era)),
    locomotions: [...locomotionMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([locomotion]) => locomotion),
    obtainments: [...obtMap.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([obtainment]) => obtainment),
    teams: getRosterTeams(placeId),
  };

  facetOptionsCache.set(placeId, options);
  return options;
}
