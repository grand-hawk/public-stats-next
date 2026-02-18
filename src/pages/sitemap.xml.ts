import slug from 'slug';
import { create } from 'xmlbuilder2';

import { getBaseUrl } from '@/utils/trpc';
import { getConfig } from '@generated/config';
import { getLoadouts } from '@generated/loadouts';
import { getShells } from '@generated/shells';
import { getVehicles } from '@generated/vehicles';

import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

function getPaths() {
  const config = getConfig();
  const vehicles = getVehicles();
  const loadouts = getLoadouts();
  const shells = getShells();

  const paths: Array<{ path: string; changefreq: string; priority: string }> =
    [];
  const placeName = config.data.primaryPlace;

  const initials = config.data.placeNameInitials[placeName];
  const placeId = config.data.placeIds[placeName];

  const vehicleSlugs = vehicles.data[placeId].metadata.slugs;
  const loadoutsPlace = loadouts.data[placeId];
  const shellsPlace = shells.data[placeId];

  // main place page
  paths.push({
    path: `${initials}`,
    changefreq: 'weekly',
    priority: '1',
  });

  // kdr and winrate pages
  paths.push({
    path: `${initials}/kdr`,
    changefreq: 'weekly',
    priority: '0.8',
  });
  paths.push({
    path: `${initials}/winrate`,
    changefreq: 'weekly',
    priority: '0.8',
  });

  // vehicles
  paths.push({
    path: `${initials}/vehicles`,
    changefreq: 'weekly',
    priority: '0.9',
  });
  for (const vehicleSlug of Object.keys(vehicleSlugs))
    paths.push({
      path: `${initials}/vehicles/${vehicleSlug}`,
      changefreq: 'monthly',
      priority: '0.6',
    });

  // teams
  paths.push({
    path: `${initials}/teams`,
    changefreq: 'weekly',
    priority: '0.8',
  });
  for (const team of loadoutsPlace.metadata.teams)
    paths.push({
      path: `${initials}/teams/${slug(team)}`,
      changefreq: 'monthly',
      priority: '0.6',
    });

  // loadouts
  paths.push({
    path: `${initials}/loadouts`,
    changefreq: 'weekly',
    priority: '0.8',
  });
  for (const loadoutName of loadoutsPlace.metadata.loadouts)
    paths.push({
      path: `${initials}/loadouts/${slug(loadoutName)}`,
      changefreq: 'monthly',
      priority: '0.6',
    });

  // tools
  paths.push({
    path: `${initials}/armor`,
    changefreq: 'monthly',
    priority: '0.5',
  });
  paths.push({
    path: `${initials}/compare`,
    changefreq: 'monthly',
    priority: '0.5',
  });

  // shells
  paths.push({
    path: `${initials}/shells`,
    changefreq: 'weekly',
    priority: '0.8',
  });
  for (const shellSlug of Object.keys(shellsPlace.metadata.slugs))
    paths.push({
      path: `${initials}/shells/${shellSlug}`,
      changefreq: 'monthly',
      priority: '0.5',
    });

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
  const paths = getPaths();

  for (const { changefreq, path, priority } of paths) {
    const url = doc.ele('url');
    url.ele('loc').txt(new URL(path, baseUrl).toString()).up();
    url.ele('changefreq').txt(changefreq).up();
    url.ele('priority').txt(priority).up();
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

export default function Sitemap() {
  return null;
}
