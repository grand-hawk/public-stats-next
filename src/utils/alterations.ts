import type { VehicleModuleWithId } from '@/utils/vehicles';
import type {
  VehiclesPlaceDataVehicle,
  VehiclesPlaceDataVehicleAlteration,
  VehiclesPlaceDataVehicleAlterations,
  VehiclesPlaceDataVehicleModule,
  VehiclesPlaceDataVehicleModuleReference,
} from '@generated/vehicles';

type ModulesDictionary = VehiclesPlaceDataVehicle['modules'] & {
  $debug?: {
    added: Record<string, string[]>;
    removed: Record<string, string[]>;
  };
};

function updateModulesFromAlterations(
  sourceModules: ModulesDictionary,
  alterations: VehiclesPlaceDataVehicleAlterations,
  enabledAlterations: Record<string, boolean>,
  debug?: boolean,
  selectedLoadout?: string | null,
): ModulesDictionary {
  const modules: ModulesDictionary = JSON.parse(JSON.stringify(sourceModules));

  if (debug) modules.$debug ||= { added: {}, removed: {} };

  for (const [alterationName, alteration] of Object.entries(alterations)) {
    const isActuallyEnabled = !!enabledAlterations[alterationName];
    const isCompatible =
      !selectedLoadout ||
      !alteration.loadout ||
      alteration.loadout === selectedLoadout;

    const isEnabled = isActuallyEnabled && isCompatible;

    const blameName =
      !isCompatible && alteration.loadout ? alteration.loadout : alterationName;
    const reasonSuffix = `is disabled`;

    if (!isEnabled) {
      if (debug && !isCompatible && alteration.loadout) {
        modules.$debug!.removed[alterationName] ||= [];
        modules.$debug!.removed[alterationName].push(
          `Removed because '${alteration.loadout}' ${reasonSuffix}`,
        );
      }

      for (const add of alteration.changes.add) {
        if (debug && modules[add]) {
          modules.$debug!.removed[add] ||= [];
          modules.$debug!.removed[add].push(
            `Removed because '${blameName}' ${reasonSuffix}`,
          );
        }

        delete modules[add];
      }

      if (debug)
        for (const remove of alteration.changes.remove) {
          const targetModule = modules[remove] as
            | (VehiclesPlaceDataVehicleModule & {
                $debug?: string[];
              })
            | undefined;
          if (targetModule) {
            const reason = `Kept because '${blameName}' ${reasonSuffix}`;

            targetModule.$debug ||= [];
            targetModule.$debug.push(reason);

            modules.$debug!.added[remove] ||= [];
            modules.$debug!.added[remove].push(reason);
          }
        }
    }

    if (isEnabled) {
      for (const remove of alteration.changes.remove) {
        if (debug && modules[remove]) {
          modules.$debug!.removed[remove] ||= [];
          modules.$debug!.removed[remove].push(
            `Removed by '${alterationName}'`,
          );
        }

        delete modules[remove];
      }

      if (debug)
        for (const add of alteration.changes.add) {
          const targetModule = modules[add] as
            | (VehiclesPlaceDataVehicleModule & {
                $debug?: string[];
              })
            | undefined;
          if (targetModule) {
            const reason = `Added by '${alterationName}'`;

            targetModule.$debug ||= [];
            targetModule.$debug.push(reason);

            modules.$debug!.added[add] ||= [];
            modules.$debug!.added[add].push(reason);
          }
        }
    }
  }

  return modules;
}

export function assembleModules(
  vehicle: VehiclesPlaceDataVehicle,
  enabledAlterations: Record<string, boolean>,
  debug?: boolean,
): ModulesDictionary {
  const loadoutNames = Object.keys(vehicle.alterations.loadouts);
  const selectedLoadoutName =
    loadoutNames.find((name) => enabledAlterations[name]) || null;

  const postLoadoutModules = selectedLoadoutName
    ? updateModulesFromAlterations(
        vehicle.modules,
        {
          [selectedLoadoutName]:
            vehicle.alterations.loadouts[selectedLoadoutName],
        },
        { [selectedLoadoutName]: true },
        debug,
        selectedLoadoutName,
      )
    : vehicle.modules;

  const postAddonModules = updateModulesFromAlterations(
    postLoadoutModules,
    vehicle.alterations.addons,
    enabledAlterations,
    debug,
    selectedLoadoutName,
  );

  return postAddonModules;
}

export function getAllModulesOfType<
  T extends VehiclesPlaceDataVehicleModule['type'],
>(type: T, assembledModules: ReturnType<typeof assembleModules>) {
  return (
    (
      Object.entries(assembledModules) as Array<
        [string, VehiclesPlaceDataVehicleModule]
      >
    )
      .filter(([id, module]) => id !== '$debug' && module.type === type)
      .map(([id, module]) => ({ ...module, id }))
      .sort((a, b) => a.type.localeCompare(b.type)) as Array<
      VehicleModuleWithId<T>
    >
  ).sort((a, b) => a.id.localeCompare(b.id));
}

export function getOneModuleOfType<
  T extends VehiclesPlaceDataVehicleModule['type'],
>(
  type: T,
  assembledModules: ReturnType<typeof assembleModules>,
): VehicleModuleWithId<T> | null {
  const [module] = getAllModulesOfType(type, assembledModules);
  return module || null;
}

export function getModuleByReference<
  T extends VehiclesPlaceDataVehicleModule['type'],
>(
  reference: VehiclesPlaceDataVehicleModuleReference,
  assembledModules: ReturnType<typeof assembleModules>,
): VehicleModuleWithId<T> | null {
  const targetModule = assembledModules[reference];
  if (!targetModule) return null;
  return { ...targetModule, id: reference } as VehicleModuleWithId<T>;
}

export function getModulesByReferences<
  T extends VehiclesPlaceDataVehicleModule['type'],
>(
  references: VehiclesPlaceDataVehicleModuleReference[],
  assembledModules: ReturnType<typeof assembleModules>,
): VehicleModuleWithId<T>[] {
  return references
    .map((reference) => getModuleByReference<T>(reference, assembledModules))
    .filter(Boolean) as VehicleModuleWithId<T>[];
}

export function getOneModuleFromReferences<
  T extends VehiclesPlaceDataVehicleModule['type'],
>(
  references: VehiclesPlaceDataVehicleModuleReference[],
  assembledModules: ReturnType<typeof assembleModules>,
): VehicleModuleWithId<T> | null {
  const modules = getModulesByReferences<T>(references, assembledModules);
  return modules[0] || null;
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
