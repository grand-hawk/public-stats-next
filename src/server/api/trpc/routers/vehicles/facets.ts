import { buildFacetOptions } from '@/server/api/trpc/routers/vehicles/facetOptions';
import {
  buildVehiclePredicates,
  buildVehicleQueryPredicate,
} from '@/server/api/trpc/routers/vehicles/predicates';
import {
  buildSearchIndex,
  matchesRoster,
} from '@/server/api/trpc/routers/vehicles/searchIndex';
import {
  bandKeys,
  bumpBandCounts,
  bumpCount,
  countDisjunctiveFacets,
  listCounts,
  seedCounts,
} from '@/server/utils/facets';
import {
  CREW_BANDS,
  POWER_BANDS,
  SPEED_BANDS,
  WEIGHT_BANDS,
} from '@/utils/filters/vehicleBands';

import type { VehicleSearchInput } from '@/server/api/trpc/routers/vehicles/input';
import type {
  PlainVehicleGroupKey,
  VehicleGroupKey,
} from '@/server/api/trpc/routers/vehicles/predicates';
import type {
  SearchEntry,
  VehicleFeatureKey,
  VehicleSearchFacets,
} from '@/server/api/trpc/routers/vehicles/types';
import type { PlaceId } from '@generated/config';

export function computeVehicleFacets(
  input: VehicleSearchInput,
): VehicleSearchFacets {
  const placeId = input.placeId as PlaceId;
  const entries = buildSearchIndex(placeId);
  const options = buildFacetOptions(placeId);

  const predicates = buildVehiclePredicates(input);
  const matchesQuery = buildVehicleQueryPredicate(input);
  const plainKeys = (Object.keys(predicates) as VehicleGroupKey[]).filter(
    (key): key is PlainVehicleGroupKey => key !== 'eras' && key !== 'teams',
  );
  const selectedEras = new Set(input.eras);
  const selectedTeams = new Set(input.teams);

  const classCounts = seedCounts(options.classifications);
  const crewClassCounts = seedCounts(options.crewClasses);
  const eraCounts = seedCounts(options.eras);
  const locomotionCounts = seedCounts(options.locomotions);
  const obtainmentCounts = seedCounts(options.obtainments);
  const teamCounts = seedCounts(options.teams);
  const crewBandCounts = seedCounts(bandKeys(CREW_BANDS));
  const powerBandCounts = seedCounts(bandKeys(POWER_BANDS));
  const speedBandCounts = seedCounts(bandKeys(SPEED_BANDS));
  const weightBandCounts = seedCounts(bandKeys(WEIGHT_BANDS));

  const featureCounts: Record<VehicleFeatureKey, number> = {
    amphibious: 0,
    aps: 0,
    ess: 0,
    fcs: 0,
    jammer: 0,
    lws: 0,
    maws: 0,
    stabilizer: 0,
    thermal: 0,
  };

  function tallyRosters(entry: SearchEntry): void {
    for (const roster of entry.rosters) {
      if (
        selectedTeams.size === 0 ||
        roster.teams.some((team) => selectedTeams.has(team))
      ) {
        bumpCount(eraCounts, roster.era);
      }
    }

    const counted = new Set<string>();
    for (const roster of entry.rosters) {
      if (selectedEras.size > 0 && !selectedEras.has(roster.era)) continue;
      for (const team of roster.teams) {
        if (counted.has(team)) continue;
        counted.add(team);
        bumpCount(teamCounts, team);
      }
    }
  }

  const tallies: Record<PlainVehicleGroupKey, (entry: SearchEntry) => void> = {
    amphibious: (entry) => {
      if (entry.amphibious) featureCounts.amphibious += 1;
    },
    aps: (entry) => {
      if (entry.hasAPS) featureCounts.aps += 1;
    },
    classifications: (entry) => bumpCount(classCounts, entry.classification),
    crewBands: (entry) =>
      bumpBandCounts(crewBandCounts, CREW_BANDS, entry.crew),
    crewClasses: (entry) => {
      for (const supportedClass of entry.supportedClasses) {
        bumpCount(crewClassCounts, supportedClass);
      }
    },
    ess: (entry) => {
      if (entry.hasESS) featureCounts.ess += 1;
    },
    fcs: (entry) => {
      if (entry.hasFCS) featureCounts.fcs += 1;
    },
    jammer: (entry) => {
      if (entry.hasJammer) featureCounts.jammer += 1;
    },
    locomotions: (entry) => bumpCount(locomotionCounts, entry.locomotion),
    lws: (entry) => {
      if (entry.hasLWS) featureCounts.lws += 1;
    },
    maws: (entry) => {
      if (entry.hasMAWS) featureCounts.maws += 1;
    },
    obtainments: (entry) => bumpCount(obtainmentCounts, entry.obtainment),
    powerBands: (entry) =>
      bumpBandCounts(powerBandCounts, POWER_BANDS, entry.powerToWeight),
    speedBands: (entry) =>
      bumpBandCounts(speedBandCounts, SPEED_BANDS, entry.forwardSpeed),
    stabilizer: (entry) => {
      if (entry.hasStabilizer) featureCounts.stabilizer += 1;
    },
    thermal: (entry) => {
      if (entry.hasThermal) featureCounts.thermal += 1;
    },
    weightBands: (entry) =>
      bumpBandCounts(weightBandCounts, WEIGHT_BANDS, entry.weight),
  };

  countDisjunctiveFacets(entries, {
    coupled: {
      matches: (entry) => matchesRoster(entry, selectedEras, selectedTeams),
      tally: tallyRosters,
    },
    include: matchesQuery,
    keys: plainKeys,
    matches: (key, entry) => predicates[key](entry),
    tally: (key, entry) => tallies[key](entry),
  });

  return {
    classifications: listCounts(options.classifications, classCounts),
    crewBands: listCounts(bandKeys(CREW_BANDS), crewBandCounts),
    crewClasses: listCounts(options.crewClasses, crewClassCounts),
    eras: listCounts(options.eras, eraCounts),
    features: featureCounts,
    locomotions: listCounts(options.locomotions, locomotionCounts),
    obtainments: listCounts(options.obtainments, obtainmentCounts),
    powerBands: listCounts(bandKeys(POWER_BANDS), powerBandCounts),
    speedBands: listCounts(bandKeys(SPEED_BANDS), speedBandCounts),
    teams: listCounts(options.teams, teamCounts),
    weightBands: listCounts(bandKeys(WEIGHT_BANDS), weightBandCounts),
  };
}
