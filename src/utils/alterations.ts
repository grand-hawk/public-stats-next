import type { DetailedVehicle } from '@/server/api/trpc/routers/vehicles';
import type {
  VehiclesPlaceDataVehicle,
  VehiclesPlaceDataVehicleAlteration,
  VehiclesPlaceDataVehicleAlterations,
  VehiclesPlaceDataVehicleModule,
} from '@generated/vehicles';

type ModulesDictionary = VehiclesPlaceDataVehicle['modules'];

function updateModulesFromAlterations(
  sourceModules: ModulesDictionary,
  alterations: VehiclesPlaceDataVehicleAlterations,
  enabledAlterations: Record<string, boolean>,
): ModulesDictionary {
  const modules: ModulesDictionary = JSON.parse(JSON.stringify(sourceModules));

  for (const [alterationName, alteration] of Object.entries(alterations)) {
    if (!enabledAlterations[alterationName]) {
      for (const add of alteration.changes.add) delete modules[add];
    }
    if (enabledAlterations[alterationName]) {
      for (const remove of alteration.changes.remove)
        delete sourceModules[remove];
    }
  }

  return modules;
}

export function assembleModules(
  vehicle: DetailedVehicle,
  enabledAlterations: Record<string, boolean>,
): VehiclesPlaceDataVehicleModule[] {
  const postLoadoutModules = updateModulesFromAlterations(
    vehicle.modules,
    vehicle.alterations.loadouts,
    enabledAlterations,
  );
  const postAddonModules = updateModulesFromAlterations(
    postLoadoutModules,
    vehicle.alterations.addons,
    enabledAlterations,
  );

  return Object.values(postAddonModules);
}

export function getAllModulesOfType(
  type: VehiclesPlaceDataVehicleModule['type'],
  vehicle: DetailedVehicle,
  enabledAlterations: Record<string, boolean>,
): VehiclesPlaceDataVehicleModule[] {
  const modules = assembleModules(vehicle, enabledAlterations);
  return modules
    .filter((module) => module.type === type)
    .sort((a, b) => a.type.localeCompare(b.type));
}

export function getOneModuleOfType(
  type: VehiclesPlaceDataVehicleModule['type'],
  vehicle: DetailedVehicle,
  enabledAlterations: Record<string, boolean>,
): VehiclesPlaceDataVehicleModule | null {
  const [module] = getAllModulesOfType(type, vehicle, enabledAlterations);
  return module || null;
}

export function alterationHasChanges(
  alteration: VehiclesPlaceDataVehicleAlteration,
): boolean {
  return (
    alteration.changes.add.length > 0 || alteration.changes.remove.length > 0
  );
}

export function alterationIsConflicting(
  alteration: VehiclesPlaceDataVehicleAlteration,
  alterations: VehiclesPlaceDataVehicleAlterations,
  enabledAlterations: Record<string, boolean>,
  selectedLoadout: string | null,
) {
  if (
    selectedLoadout &&
    alteration.loadout !== undefined &&
    alteration.loadout !== selectedLoadout
  )
    return true;

  if (alteration.category)
    for (const [otherName, isEnabled] of Object.entries(enabledAlterations)) {
      if (!isEnabled) continue;

      const other = alterations[otherName];
      if (!other) continue;
      if (other === alteration) continue;

      if (other.category && other.category === alteration.category) return true;
    }

  return false;
}
