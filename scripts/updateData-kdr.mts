import fs from 'node:fs/promises';

import kdr_json from '@config/kdr.json';
import places_json from '@config/places.json';
import vehiclesInLoadout_json from '@data/kdr/vehiclesInLoadout.json';
import { controller } from '@scripts/updateData.utils.mts';

const places = places_json as Record<string, number>;
const kdrConfig = kdr_json as { versions: Record<string, number> };
const vehiclesInLoadout = vehiclesInLoadout_json as string[];

async function getDistinct(placeId: string) {
  return controller<{
    placeId: string[];
    placeVersion: number[];
    name: string[];
    displayName: string[];
    loadout: string[];
    class: string[];
  }>('vehicles.distinct', placeId);
}

interface VehicleVersion {
  vehicleId: number;
  placeId: string;
  placeVersion: number;
  name: string;
  displayName: string;
  loadout: string;
  class: string;
  deaths: number;
  kills: number;
}

async function getVehicleVersions(input: {
  placeId: string;
  placeVersions: number[];
  loadout?: string;
  class?: string[];
}): Promise<VehicleVersion[]> {
  return controller<VehicleVersion[]>('vehicles.versions', input);
}

for (const [, placeIdValue] of Object.entries(places)) {
  const placeId = placeIdValue.toString();
  await fs.mkdir(`./data/kdr/${placeId}`, { recursive: true });

  const distinct = await getDistinct(placeId);
  const recentVersions = distinct.placeVersion
    .sort((a, b) => b - a)
    .slice(0, kdrConfig.versions[placeId] ?? 10);

  const vehicleVersions = await getVehicleVersions({
    placeId,
    placeVersions: recentVersions,
  });

  const filteredVehicleVersions = vehicleVersions.filter(({ name }) =>
    vehiclesInLoadout.includes(name),
  );

  await fs.writeFile(
    `./data/kdr/${placeId}/metadata.json`,
    JSON.stringify(
      {
        date: new Date().toISOString(),
        vehicles: distinct.name
          .filter((v) => vehiclesInLoadout.includes(v))
          .map((name) => {
            const vehicle = vehicleVersions.find((v) => v.name === name);
            return vehicle?.displayName ?? name;
          }),
        versions: recentVersions,
      },
      undefined,
      4,
    ),
  );

  const kdr = distinct.name
    .map((name) => {
      const associatedVersions = filteredVehicleVersions.filter(
        (v) => v.name === name,
      );
      if (associatedVersions.length === 0) return null;

      const totalKills = associatedVersions.reduce(
        (acc, v) => acc + v.kills,
        0,
      );
      const totalDeaths = associatedVersions.reduce(
        (acc, v) => acc + v.deaths,
        0,
      );

      const properName = associatedVersions[0].displayName ?? name;

      return {
        name: properName,
        kd: Number((totalKills / (totalDeaths || 1)).toFixed(2)),
        kills: totalKills,
        deaths: totalDeaths,
      };
    })
    .filter((v) => !!v)
    .sort((a, b) => b.kd - a.kd);

  await fs.writeFile(
    `./data/kdr/${placeId}/kdr.json`,
    JSON.stringify(kdr, undefined, 4),
  );
}
