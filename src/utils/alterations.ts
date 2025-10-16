import type { VehicleModuleFromType } from '@/utils/vehicles';
import type {
  VehiclesPlaceDataVehicle,
  VehiclesPlaceDataVehicleAlteration,
  VehiclesPlaceDataVehicleAlterations,
  VehiclesPlaceDataVehicleModule,
  VehiclesPlaceDataVehicleModuleReference,
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
      for (const remove of alteration.changes.remove) delete modules[remove];
    }
  }

  return modules;
}

export function assembleModules(
  vehicle: VehiclesPlaceDataVehicle,
  enabledAlterations: Record<string, boolean>,
): ModulesDictionary {
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

  return postAddonModules;
}

export function getAllModulesOfType<
  T extends VehiclesPlaceDataVehicleModule['type'],
>(
  type: T,
  vehicle: VehiclesPlaceDataVehicle,
  enabledAlterations: Record<string, boolean>,
) {
  const modules = Object.values(assembleModules(vehicle, enabledAlterations));
  return modules
    .filter((module) => module.type === type)
    .sort((a, b) => a.type.localeCompare(b.type)) as Array<
    VehicleModuleFromType<T>
  >;
}

export function getOneModuleOfType<
  T extends VehiclesPlaceDataVehicleModule['type'],
>(
  type: T,
  vehicle: VehiclesPlaceDataVehicle,
  enabledAlterations: Record<string, boolean>,
): VehicleModuleFromType<T> | null {
  const [module] = getAllModulesOfType(type, vehicle, enabledAlterations);
  return (module as VehicleModuleFromType<T>) || null;
}

export function getModuleByReference<
  T extends VehiclesPlaceDataVehicleModule['type'],
>(
  reference: VehiclesPlaceDataVehicleModuleReference,
  vehicle: VehiclesPlaceDataVehicle,
  enabledAlterations: Record<string, boolean>,
): VehicleModuleFromType<T> | null {
  const modules = assembleModules(vehicle, enabledAlterations);
  return (modules[reference] as VehicleModuleFromType<T>) || null;
}

export function getModulesByReferences<
  T extends VehiclesPlaceDataVehicleModule['type'],
>(
  references: VehiclesPlaceDataVehicleModuleReference[],
  vehicle: VehiclesPlaceDataVehicle,
  enabledAlterations: Record<string, boolean>,
): VehicleModuleFromType<T>[] {
  return references
    .map((reference) =>
      getModuleByReference(reference, vehicle, enabledAlterations),
    )
    .filter(Boolean) as VehicleModuleFromType<T>[];
}

export function getOneModuleFromReferences<
  T extends VehiclesPlaceDataVehicleModule['type'],
>(
  references: VehiclesPlaceDataVehicleModuleReference[],
  vehicle: VehiclesPlaceDataVehicle,
  enabledAlterations: Record<string, boolean>,
): VehicleModuleFromType<T> | null {
  const modules = getModulesByReferences(
    references,
    vehicle,
    enabledAlterations,
  );
  return (modules[0] as VehicleModuleFromType<T>) || null;
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
