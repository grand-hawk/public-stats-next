import slug from 'slug';
import { create } from 'xmlbuilder2';

import { getBaseUrl } from '@/utils/trpc';
import { getConfig } from '@generated/config';
import { getLoadouts } from '@generated/loadouts';
import { getShells } from '@generated/shells';
import { getVehicles } from '@generated/vehicles';

import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

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
    const vehicleSlugs = Object.values(vehiclesPlace.data)
      .filter((vehicle) => !vehicle.info.unlisted)
      .map((vehicle) => vehicle.info.slug);
    const loadoutsPlace = loadouts.data[placeId];
    const shellsPlace = shells.data[placeId];

    // main place md page
    paths.push({
      path: `md/${initials}/index.md`,
      changefreq: 'weekly',
    });

    // kdr page
    paths.push({
      path: `md/${initials}/kdr.md`,
      changefreq: 'weekly',
    });

    // vehicles
    paths.push({
      path: `md/${initials}/vehicles.md`,
      changefreq: 'weekly',
    });
    for (const vehicleSlug of vehicleSlugs) {
      paths.push({
        path: `md/${initials}/vehicles/${vehicleSlug}.md`,
        changefreq: 'monthly',
      });
    }

    // teams
    paths.push({
      path: `md/${initials}/teams.md`,
      changefreq: 'weekly',
    });
    for (const team of loadoutsPlace.metadata.teams) {
      paths.push({
        path: `md/${initials}/teams/${slug(team)}.md`,
        changefreq: 'monthly',
      });
    }

    // loadouts
    paths.push({
      path: `md/${initials}/loadouts.md`,
      changefreq: 'weekly',
    });
    for (const loadoutName of loadoutsPlace.metadata.loadouts) {
      paths.push({
        path: `md/${initials}/loadouts/${slug(loadoutName)}.md`,
        changefreq: 'monthly',
      });
    }

    // shells
    paths.push({
      path: `md/${initials}/shells.md`,
      changefreq: 'weekly',
    });
    for (const shellSlug of Object.keys(shellsPlace.metadata.slugs)) {
      paths.push({
        path: `md/${initials}/shells/${shellSlug}.md`,
        changefreq: 'monthly',
      });
    }
  }

  return paths;
}

export function getServerSideProps({
  res,
}: GetServerSidePropsContext): GetServerSidePropsResult<{}> {
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

  res.setHeader('content-type', 'application/xml; charset=utf-8');
  res.setHeader(
    'cache-control',
    'public, max-age=604800, stale-while-revalidate=86400',
  );

  res.write(xml);

  res.end();

  return { props: {} };
}

export default function SitemapMd() {
  return null;
}
