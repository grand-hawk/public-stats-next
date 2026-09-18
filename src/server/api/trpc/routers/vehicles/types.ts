import type { VehicleContent } from '@/server/utils/vehicleContent';
import type { KdrPlaceDataVehicle } from '@generated/kdr';
import type { LoadoutsPlaceDataLoadoutVehicle } from '@generated/loadouts';
import type {
  VehiclesPlaceDataVehicle,
  VehiclesPlaceDataVehicleInfo,
} from '@generated/vehicles';
import type { BreadcrumbList, Vehicle, WithContext } from 'schema-dts';

export interface ListVehicle {
  name: string;
  new?: boolean;
  premium?: NonNullable<VehiclesPlaceDataVehicleInfo['premium']>['type'];
  role: string;
  slug: string;
  team: string;
  frontArmorDepth?: number;
}

export type VehicleFeatureKey =
  | 'amphibious'
  | 'aps'
  | 'ess'
  | 'fcs'
  | 'jammer'
  | 'lws'
  | 'maws'
  | 'stabilizer'
  | 'thermal';

export interface VehicleSearchFacets {
  classifications: [string, number][];
  crewBands: [string, number][];
  crewClasses: [string, number][];
  eras: [string, number][];
  features: Record<VehicleFeatureKey, number>;
  locomotions: [string, number][];
  obtainments: [string, number][];
  powerBands: [string, number][];
  speedBands: [string, number][];
  teams: [string, number][];
  weightBands: [string, number][];
}

export type VehicleAvailability = Record<
  string,
  LoadoutsPlaceDataLoadoutVehicle
>;

export type DetailedVehicle = VehiclesPlaceDataVehicle & {
  info: {
    frontArmorDepth?: number;
    name: string;
    lastRetrieved: string;
    availability: VehicleAvailability;
    kdr: KdrPlaceDataVehicle;
    teamColor?: string;
  };
  content?: VehicleContent;
  linkedData: Partial<{
    breadcrumbs: WithContext<BreadcrumbList>;
    vehicle: WithContext<Vehicle>;
  }>;
};

export interface VehicleRoster {
  era: string;
  teams: string[];
}

export interface SearchEntry {
  amphibious: boolean;
  classification: string;
  crew: number;
  forwardSpeed: number;
  hasAPS: boolean;
  hasESS: boolean;
  hasFCS: boolean;
  hasJammer: boolean;
  hasLWS: boolean;
  hasMAWS: boolean;
  hasStabilizer: boolean;
  hasThermal: boolean;
  locomotion: string;
  obtainment: string;
  powerToWeight: number;
  rosters: VehicleRoster[];
  simplifiedName: string;
  supportedClasses: string[];
  vehicle: ListVehicle;
  weight: number;
}
