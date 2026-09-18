import { matchesRoster } from '@/server/api/trpc/routers/vehicles/searchIndex';
import { matchesAnyBand } from '@/server/utils/facets';
import {
  CREW_BANDS,
  POWER_BANDS,
  SPEED_BANDS,
  WEIGHT_BANDS,
} from '@/utils/filters/vehicleBands';
import { simplifyString } from '@/utils/simplifyString';

import type { VehicleSearchInput } from '@/server/api/trpc/routers/vehicles/input';
import type {
  SearchEntry,
  VehicleFeatureKey,
} from '@/server/api/trpc/routers/vehicles/types';

export type VehicleGroupKey =
  | 'classifications'
  | 'crewBands'
  | 'crewClasses'
  | 'eras'
  | 'locomotions'
  | 'obtainments'
  | 'powerBands'
  | 'speedBands'
  | 'teams'
  | 'weightBands'
  | VehicleFeatureKey;

export type PlainVehicleGroupKey = Exclude<VehicleGroupKey, 'eras' | 'teams'>;

export type VehiclePredicate = (entry: SearchEntry) => boolean;

export function buildVehiclePredicates(
  input: VehicleSearchInput,
): Record<VehicleGroupKey, VehiclePredicate> {
  const classifications = new Set(input.classifications);
  const crewBands = new Set(input.crewBands);
  const crewClasses = new Set(input.crewClasses);
  const eras = new Set(input.eras);
  const locomotions = new Set(input.locomotions);
  const obtainments = new Set(input.obtainments);
  const powerBands = new Set(input.powerBands);
  const speedBands = new Set(input.speedBands);
  const teams = new Set(input.teams);
  const weightBands = new Set(input.weightBands);

  return {
    amphibious: (entry) => !input.amphibious || entry.amphibious,
    aps: (entry) => !input.aps || entry.hasAPS,
    classifications: (entry) =>
      classifications.size === 0 || classifications.has(entry.classification),
    crewBands: (entry) => matchesAnyBand(CREW_BANDS, crewBands, entry.crew),
    crewClasses: (entry) =>
      crewClasses.size === 0 ||
      entry.supportedClasses.some((supportedClass) =>
        crewClasses.has(supportedClass),
      ),
    eras: (entry) => matchesRoster(entry, eras, teams),
    ess: (entry) => !input.ess || entry.hasESS,
    fcs: (entry) => !input.fcs || entry.hasFCS,
    jammer: (entry) => !input.jammer || entry.hasJammer,
    locomotions: (entry) =>
      locomotions.size === 0 || locomotions.has(entry.locomotion),
    lws: (entry) => !input.lws || entry.hasLWS,
    maws: (entry) => !input.maws || entry.hasMAWS,
    obtainments: (entry) =>
      obtainments.size === 0 || obtainments.has(entry.obtainment),
    powerBands: (entry) =>
      matchesAnyBand(POWER_BANDS, powerBands, entry.powerToWeight),
    speedBands: (entry) =>
      matchesAnyBand(SPEED_BANDS, speedBands, entry.forwardSpeed),
    stabilizer: (entry) => !input.stabilizer || entry.hasStabilizer,
    teams: (entry) => matchesRoster(entry, eras, teams),
    thermal: (entry) => !input.thermal || entry.hasThermal,
    weightBands: (entry) =>
      matchesAnyBand(WEIGHT_BANDS, weightBands, entry.weight),
  };
}

export function buildVehicleQueryPredicate(
  input: VehicleSearchInput,
): VehiclePredicate {
  const normalizedQuery = input.query ? simplifyString(input.query) : null;
  return (entry) =>
    !normalizedQuery || entry.simplifiedName.includes(normalizedQuery);
}
