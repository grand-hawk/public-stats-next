import type { EraPanelName } from '@/content/eraPanelNames';

export interface EraPanelSource {
  ke: number;
  heat: number;
  antiTandem: number;
  vehicles: Record<string, string[]>;
}

export interface ExportedPanel {
  names: string[];
  kinetic: number;
  heat: number;
  tandemResistance: number;
}

export interface ExportedVehicle {
  info: { gameId: string; reactiveArmour?: ExportedPanel[] };
}

export function sourcesFromVehicles(
  vehicles: Record<string, ExportedVehicle>,
): EraPanelSource[] | null {
  const sources = new Map<string, EraPanelSource>();
  let exported = false;

  for (const { info } of Object.values(vehicles)) {
    if (!info.reactiveArmour) continue;
    exported = true;

    for (const panel of info.reactiveArmour) {
      const key = `${panel.kinetic}/${panel.heat}/${panel.tandemResistance}`;
      const source = sources.get(key) ?? {
        ke: panel.kinetic,
        heat: panel.heat,
        antiTandem: panel.tandemResistance,
        vehicles: {},
      };

      source.vehicles[info.gameId] = panel.names;
      sources.set(key, source);
    }
  }

  if (!exported) return null;

  return [...sources.values()].sort(
    (a, b) => a.ke - b.ke || a.heat - b.heat || a.antiTandem - b.antiTandem,
  );
}

export interface EraPanelVehicle {
  name: string;
  slug: string;
}

export type Range = [number, number];

export interface EraPanelVariant {
  ke: number;
  heat: number;
  antiTandem: number;
}

export interface NamedEraPanel {
  label: string;
  variants: EraPanelVariant[];
  ke: Range;
  heat: Range;
  antiTandem: Range;
  vehicles: EraPanelVehicle[];
}

export interface VehicleEraPanel {
  suffix: string;
  ke: number;
  heat: number;
  antiTandem: number;
  vehicles: EraPanelVehicle[];
}

export interface EraPanels {
  named: NamedEraPanel[];
  specific: VehicleEraPanel[];
  eraTips: number[];
}

function widen(range: Range | undefined, value: number): Range {
  return range
    ? [Math.min(range[0], value), Math.max(range[1], value)]
    : [value, value];
}

function guessSuffix(parts: string[]): string {
  const text = parts.join(' ').toLowerCase();
  if (text.includes('nera')) return 'NERA';
  if (/skirt|rubber|fender/.test(text)) return 'skirts';
  if (/screen|composite/.test(text)) return 'composite screens';
  return 'ERA';
}

function byName(a: EraPanelVehicle, b: EraPanelVehicle) {
  return a.name.localeCompare(b.name, undefined, { numeric: true });
}

export function groupEraPanels(
  sources: EraPanelSource[],
  names: Record<string, EraPanelName>,
  available: Map<string, EraPanelVehicle>,
  eraTips: number[] = [],
): EraPanels {
  const named = new Map<string, NamedEraPanel>();
  const specific: VehicleEraPanel[] = [];

  for (const source of sources) {
    const key = `${source.ke}/${source.heat}/${source.antiTandem}`;
    const entry = names[key];
    const except = new Set(entry?.except ?? []);

    const included: EraPanelVehicle[] = [];
    const leftOver: EraPanelVehicle[] = [];
    const leftOverParts: string[] = [];

    for (const [gameId, parts] of Object.entries(source.vehicles)) {
      const vehicle = available.get(gameId);
      if (!vehicle) continue;

      if (entry?.label && !except.has(gameId)) included.push(vehicle);
      else {
        leftOver.push(vehicle);
        leftOverParts.push(...parts);
      }
    }

    if (entry?.label && included.length > 0) {
      const existing = named.get(entry.label);
      const seen = new Set(existing?.vehicles.map((vehicle) => vehicle.slug));

      named.set(entry.label, {
        label: entry.label,
        variants: [
          ...(existing?.variants ?? []),
          { ke: source.ke, heat: source.heat, antiTandem: source.antiTandem },
        ],
        ke: widen(existing?.ke, source.ke),
        heat: widen(existing?.heat, source.heat),
        antiTandem: widen(existing?.antiTandem, source.antiTandem),
        vehicles: [
          ...(existing?.vehicles ?? []),
          ...included.filter((vehicle) => !seen.has(vehicle.slug)),
        ].sort(byName),
      });
    }

    if (leftOver.length > 0) {
      specific.push({
        suffix: entry?.suffix ?? guessSuffix(leftOverParts),
        ke: source.ke,
        heat: source.heat,
        antiTandem: source.antiTandem,
        vehicles: leftOver.sort(byName),
      });
    }
  }

  return {
    eraTips: [...new Set(eraTips)].sort((a, b) => a - b),
    named: [...named.values()],
    specific: specific.sort(
      (a, b) => byName(a.vehicles[0], b.vehicles[0]) || a.ke - b.ke,
    ),
  };
}
