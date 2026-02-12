import slug from 'slug';
import { create } from 'xmlbuilder2';

import { getBaseUrl } from '@/utils/trpc';
import { getConfig } from '@generated/config';
import { getLoadouts } from '@generated/loadouts';
import { getShells } from '@generated/shells';
import { getVehicles } from '@generated/vehicles';

function getMdPaths() {
  const config = getConfig();
  const vehicles = getVehicles();
  const loadouts = getLoadouts();
  const shells = getShells();

  const paths: Array<{ path: string; changefreq: string }> = [];
  const placeNames = config.data.placeNames;

  for (const placeName of placeNames) {
    const initials = config.data.placeNameInitials[placeName];
    const placeId = config.data.placeIds[placeName];

    const vehiclesPlace = vehicles.data[placeId];
    const vehicleSlugs = Object.values(vehiclesPlace.data).map(
      (v) => v.info.slug,
    );
    const loadoutsPlace = loadouts.data[placeId];
    const shellsPlace = shells.data[placeId];

    paths.push({ path: `md/${initials}/index.md`, changefreq: 'weekly' });
    paths.push({ path: `md/${initials}/kdr.md`, changefreq: 'weekly' });

    paths.push({ path: `md/${initials}/vehicles.md`, changefreq: 'weekly' });
    for (const vehicleSlug of vehicleSlugs)
      paths.push({
        path: `md/${initials}/vehicles/${vehicleSlug}.md`,
        changefreq: 'monthly',
      });

    paths.push({ path: `md/${initials}/teams.md`, changefreq: 'weekly' });
    for (const team of loadoutsPlace.metadata.teams)
      paths.push({
        path: `md/${initials}/teams/${slug(team)}.md`,
        changefreq: 'monthly',
      });

    paths.push({ path: `md/${initials}/loadouts.md`, changefreq: 'weekly' });
    for (const loadoutName of loadoutsPlace.metadata.loadouts)
      paths.push({
        path: `md/${initials}/loadouts/${slug(loadoutName)}.md`,
        changefreq: 'monthly',
      });

    paths.push({ path: `md/${initials}/shells.md`, changefreq: 'weekly' });
    for (const shellSlug of Object.keys(shellsPlace.metadata.slugs))
      paths.push({
        path: `md/${initials}/shells/${shellSlug}.md`,
        changefreq: 'monthly',
      });
  }

  return paths;
}

export function GET() {
  const doc = create({
    version: '1.0',
    encoding: 'UTF-8',
    standalone: true,
  }).ele('urlset', {
    xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
  });

  const baseUrl = getBaseUrl();
  const paths = getMdPaths();

  for (const { changefreq, path } of paths) {
    const url = doc.ele('url');
    url.ele('loc').txt(new URL(path, baseUrl).toString()).up();
    url.ele('changefreq').txt(changefreq).up();
    url.up();
  }

  const xml = doc.end();

  return new Response(xml, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control':
        'public, max-age=604800, stale-while-revalidate=86400',
    },
  });
}
