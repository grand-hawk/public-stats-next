import fs from 'node:fs/promises';

import kdr_json from '@config/kdr.json';
import places_json from '@config/places.json';
import vehiclesInLoadout_json from '@data/kdr/vehiclesInLoadout.json';
import { request } from '@scripts/updateData.utils.mts';

const places = places_json as Record<string, number>;
const kdrConfig = kdr_json as { versions: Record<string, number> };
const vehiclesInLoadout = vehiclesInLoadout_json as string[];

async function getDistinct(placeId: string | number) {
  return request(`vehicle/data/distinct/${placeId}`).json<{
    name: string[];
    version: number[];
  }>();
}

async function getVehicleVersions(
  placeId: string | number,
  versions: Array<number | string>,
) {
  return request(`vehicle/data/vehicleVersions`, {
    searchParams: new URLSearchParams({
      placeId: String(placeId),
      versions: versions.join(','),
    }),
  }).json<
    Array<{
      _id: string;
      version: number;
      name: string;
      displayName?: string;
      placeId: string;
      deaths: number;
      kills: number;
    }>
  >();
}

for (const [, placeId] of Object.entries(places)) {
  await fs.mkdir(`./data/kdr/${placeId}`, { recursive: true });

  const distinct = await getDistinct(placeId);
  const recentVersions = distinct.version
    .sort((a, b) => b - a)
    .slice(0, kdrConfig.versions[String(placeId)] ?? 10);

  await fs.writeFile(
    `./data/kdr/${placeId}/metadata.json`,
    JSON.stringify(
      {
        date: new Date().toISOString(),
        vehicles: distinct.name.filter((v) => vehiclesInLoadout.includes(v)),
        versions: recentVersions,
      },
      undefined,
      4,
    ),
  );

  const vehicleVersions = await getVehicleVersions(placeId, recentVersions);
  const filteredVehicleVersions = vehicleVersions.filter(({ name }) =>
    vehiclesInLoadout.includes(name),
  );

  const kdr = distinct.name
    .map((name) => {
      const associatedVersions = filteredVehicleVersions.filter(
        (v) => v.name === name,
      );
      if (associatedVersions.length === 0) return null;

      const averageKills =
        associatedVersions.reduce((acc, v) => acc + v.kills, 0) /
        associatedVersions.length;
      const averageDeaths =
        associatedVersions.reduce((acc, v) => acc + v.deaths, 0) /
        associatedVersions.length;

      const properName = associatedVersions[0].displayName ?? name;

      return {
        name: properName,
        kd: Number((averageKills / (averageDeaths || 1)).toFixed(2)),
        kills: Math.round(averageKills),
        deaths: Math.round(averageDeaths),
      };
    })
    .filter((v) => !!v)
    .sort((a, b) => b.kd - a.kd);

  await fs.writeFile(
    `./data/kdr/${placeId}/kdr.json`,
    JSON.stringify(kdr, undefined, 4),
  );
}
