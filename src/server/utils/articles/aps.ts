import type { EraPanelVehicle } from '@/server/utils/articles/eraPanels';
import type { VehiclesPlaceDataVehicleModule } from '@generated/vehicles';

export type ApsModuleData = Extract<
  VehiclesPlaceDataVehicleModule,
  { type: 'APS' }
>['data'];

export interface ApsVehicle {
  info: { gameId: string };
  modules: Record<string, { type: string; data: unknown }>;
}

export interface ApsSystem {
  label: string;
  named: boolean;
  maxSpeed: number;
  resistance: number;
  launchers: number;
  horizontalWidth: number;
  vertical: [number, number];
  drones: boolean;
  vehicles: EraPanelVehicle[];
}

function byName(a: EraPanelVehicle, b: EraPanelVehicle) {
  return a.name.localeCompare(b.name, undefined, { numeric: true });
}

function toSystem(data: ApsModuleData, vehicle: EraPanelVehicle): ApsSystem {
  const name = data.name.replace(/^APS$| APS$/, '');

  return {
    label: name || `${vehicle.name} APS`,
    named: name !== '',
    maxSpeed: data.interceptionSpeed.max,
    resistance: data.resistance,
    launchers: data.launchers,
    horizontalWidth:
      data.traverse.horizontal.max - data.traverse.horizontal.min,
    vertical: [data.traverse.vertical.min, data.traverse.vertical.max],
    drones: data.interceptsDrones,
    vehicles: [vehicle],
  };
}

export function groupApsSystems(
  vehicles: Record<string, ApsVehicle>,
  available: Map<string, EraPanelVehicle>,
): ApsSystem[] {
  const systems = new Map<string, ApsSystem>();

  for (const { info, modules } of Object.values(vehicles)) {
    const vehicle = available.get(info.gameId);
    if (!vehicle) continue;

    for (const entry of Object.values(modules)) {
      if (entry.type !== 'APS') continue;

      const system = toSystem(entry.data as ApsModuleData, vehicle);
      const key = JSON.stringify({ ...system, vehicles: undefined });
      const existing = systems.get(key);

      if (existing) {
        existing.vehicles = [...existing.vehicles, vehicle].sort(byName);
      } else {
        systems.set(key, system);
      }
    }
  }

  return [...systems.values()].sort(
    (a, b) =>
      Number(b.named) - Number(a.named) ||
      a.label.localeCompare(b.label) ||
      a.maxSpeed - b.maxSpeed ||
      byName(a.vehicles[0], b.vehicles[0]),
  );
}
