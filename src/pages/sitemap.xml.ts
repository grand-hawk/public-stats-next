import { create } from 'xmlbuilder2';

import { getBaseUrl } from '@/utils/trpc';
import { getConfig } from '@generated/config';
import { getVehicles } from '@generated/vehicles';

import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

function getPaths() {
  const config = getConfig();
  const vehicles = getVehicles();

  const paths: Array<{ path: string; changefreq: string; priority: string }> =
    [];
  const placeNames = config.data.placeNames;

  for (const placeName of placeNames) {
    const initials = config.data.placeNameInitials[placeName];
    const placeId = config.data.placeIds[placeName];
    const vehicleSlugs = vehicles.data[placeId].metadata.slugs;

    paths.push({
      path: `${initials}`,
      changefreq: 'weekly',
      priority: placeNames.indexOf(placeName) === 0 ? '1' : '0.9',
    });
    paths.push({
      path: `${initials}/vehicles`,
      changefreq: 'weekly',
      priority: placeNames.indexOf(placeName) === 0 ? '0.9' : '0.8',
    });

    for (const vehicleSlug of Object.keys(vehicleSlugs))
      paths.push({
        path: `${initials}/vehicles/${vehicleSlug}`,
        changefreq: 'monthly',
        priority: placeNames.indexOf(placeName) === 0 ? '0.6' : '0.4',
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
