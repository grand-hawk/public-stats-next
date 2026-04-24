import slug from 'slug';
import { create } from 'xmlbuilder2';

import {
  indexableTabKeys,
  primaryTabKeys,
  secondaryTabKeys,
  tabs,
  toolsTabKeys,
} from '@/components/layout/navigation/tabs';
import { getBaseUrl } from '@/utils/trpc';
import { getConfig } from '@generated/config';
import { getLoadouts } from '@generated/loadouts';
import { getShells } from '@generated/shells';
import { getVehicles } from '@generated/vehicles';

import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

interface SitemapEntry {
  path: string;
  changefreq: string;
  priority: string;
}

function tabPriority(key: (typeof indexableTabKeys)[number]): SitemapEntry {
  if ((primaryTabKeys as readonly string[]).includes(key)) {
    return { path: '', changefreq: 'weekly', priority: '0.9' };
  }
  if ((secondaryTabKeys as readonly string[]).includes(key)) {
    return { path: '', changefreq: 'weekly', priority: '0.8' };
  }
  if ((toolsTabKeys as readonly string[]).includes(key)) {
    return { path: '', changefreq: 'monthly', priority: '0.5' };
  }
  return { path: '', changefreq: 'monthly', priority: '0.5' };
}

function getPaths(): SitemapEntry[] {
  const config = getConfig();
  const vehicles = getVehicles();
  const loadouts = getLoadouts();
  const shells = getShells();

  const paths: SitemapEntry[] = [];
  const placeName = config.data.primaryPlace;

  const initials = config.data.placeNameInitials[placeName];
  const placeId = config.data.placeIds[placeName];

  const vehiclesPlace = vehicles.data[placeId];
  const vehicleSlugs = Object.entries(vehiclesPlace.metadata.slugs)
    .filter(([, vehicleName]) => {
      const vehicle = vehiclesPlace.data[vehicleName];
      return vehicle && !vehicle.info.unlisted;
    })
    .map(([vehicleSlug]) => vehicleSlug);
  const loadoutsPlace = loadouts.data[placeId];
  const shellsPlace = shells.data[placeId];

  paths.push({
    path: `${initials}`,
    changefreq: 'weekly',
    priority: '1',
  });

  for (const key of indexableTabKeys) {
    const tab = tabs[key];
    const { changefreq, priority } = tabPriority(key);
    paths.push({
      path: `${initials}${tab.path}`,
      changefreq,
      priority,
    });
  }

  for (const vehicleSlug of vehicleSlugs) {
    paths.push({
      path: `${initials}/vehicles/${vehicleSlug}`,
      changefreq: 'monthly',
      priority: '0.6',
    });
  }

  for (const team of loadoutsPlace.metadata.teams) {
    paths.push({
      path: `${initials}/teams/${slug(team)}`,
      changefreq: 'monthly',
      priority: '0.6',
    });
  }

  for (const loadout of loadoutsPlace.metadata.loadouts) {
    paths.push({
      path: `${initials}/loadouts/${slug(loadout)}`,
      changefreq: 'monthly',
      priority: '0.6',
    });
  }

  for (const shellSlug of Object.keys(shellsPlace.metadata.slugs)) {
    paths.push({
      path: `${initials}/shells/${shellSlug}`,
      changefreq: 'monthly',
      priority: '0.5',
    });
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
