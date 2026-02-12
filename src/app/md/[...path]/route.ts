import { markdownTable } from 'markdown-table';
import { NextResponse } from 'next/server';

import { KDR_RANGE_ITEMS } from '@/components/features/kdr/rangeSelect';
import { createCache } from '@/server/utils/createCache';
import { createMarkdownRouteHandler } from '@/server/utils/createMarkdownRoute';
import {
  escapeMarkdownLink,
  formatMarkdown,
} from '@/server/utils/formatMarkdown';
import { getNameFromInitials, getPlaceFromName } from '@/utils/placeUtils';
import { getBaseUrl } from '@/utils/trpc';
import { getConfig } from '@generated/config';
import { getKdr } from '@generated/kdr';
import { getLoadouts } from '@generated/loadouts';
import { getShells } from '@generated/shells';
import { getVehicles } from '@generated/vehicles';

import type { ListVehicle } from '@/server/api/trpc/routers/vehicles';
import type { PlaceName } from '@generated/config';
import type { KdrPlaceData, KdrPlaceDataVehicle } from '@generated/kdr';
import type { NextRequest } from 'next/server';
import type Cache from 'stale-lru-cache';

// --- Cache factories for each md route type ---

const INDEX_LINKS = [
  { file: 'kdr.md', label: 'K/D table' },
  { file: 'loadouts.md', label: 'Loadouts' },
  { file: 'shells.md', label: 'Shells' },
  { file: 'teams.md', label: 'Teams' },
  { file: 'vehicles.md', label: 'Vehicles' },
];

async function revalidateIndex(placeName: PlaceName) {
  const shells = getShells();
  const { data: config } = getConfig();
  const place = getPlaceFromName(config, placeName);
  const shellsData = shells.data[place.placeId]?.data;
  if (!shellsData) return null;

  const links = INDEX_LINKS.map(
    ({ file, label }) => `- [${label}](/md/${place.initials}/${file})`,
  ).join('\n');
  return formatMarkdown(`# ${place.placeName}\n\n${links}`);
}

async function revalidateKdr(placeName: PlaceName) {
  const kdr = getKdr();
  const vehicles = getVehicles();
  const { data: config } = getConfig();
  const place = getPlaceFromName(config, placeName);
  const kdrData = kdr.data[place.placeId]?.data;
  if (!kdrData) return null;

  const vehiclesData = vehicles.data[place.placeId]?.data;
  const aggregatedVehicles: Array<
    { name: string; slug: string } & Partial<
      Record<keyof KdrPlaceData, KdrPlaceDataVehicle>
    >
  > = [];

  for (const name of Object.keys(kdrData.all_time)) {
    const vehicleSlug = vehiclesData[name]?.info.slug;
    if (!vehicleSlug) continue;
    aggregatedVehicles.push({
      name,
      slug: name,
      all_time: kdrData.all_time[name],
      recent: kdrData.recent[name],
    });
  }

  const headers = [
    'Vehicle',
    ...KDR_RANGE_ITEMS.flatMap((range) => [
      `${range.label} K/D`,
      `${range.label} kills`,
      `${range.label} deaths`,
    ]),
  ];
  const dataRows = aggregatedVehicles.map((vehicle) => [
    `[${escapeMarkdownLink(vehicle.name)}](/md/${place.initials}/vehicles/${vehicle.slug}.md)`,
    ...KDR_RANGE_ITEMS.flatMap((range) => {
      const rangeKey = range.value as keyof KdrPlaceData;
      const vehicleData = vehicle[rangeKey];
      return [
        vehicleData?.kdr.toString() || '',
        vehicleData?.kills.toString() || '',
        vehicleData?.deaths.toString() || '',
      ];
    }),
  ]);
  const table = markdownTable([headers, ...dataRows]);
  return formatMarkdown(`# K/D table\n\n${table}`);
}

async function revalidateVehicles(placeName: PlaceName) {
  const vehicles = getVehicles();
  const { data: config } = getConfig();
  const place = getPlaceFromName(config, placeName);
  const vehiclesData = vehicles.data[place.placeId]?.data;
  if (!vehiclesData) return null;

  const entries = Object.entries(vehiclesData)
    .map(([name, data]) => ({
      name: `[${escapeMarkdownLink(name)}](/md/${place.initials}/vehicles/${data.info.slug}.md)`,
      team: data.info.team,
      role: data.info.role,
    }))
    .sort((a, b) => a.name.localeCompare(b.name)) as Omit<
    ListVehicle,
    'slug'
  >[];

  const table = [
    ['Name', 'Team', 'Role'],
    ...entries.map((entry) => [entry.name, entry.team, entry.role]),
  ];
  return formatMarkdown(`# Vehicles\n\n${markdownTable(table)}`);
}

async function revalidateShells(placeName: PlaceName) {
  const shells = getShells();
  const { data: config } = getConfig();
  const place = getPlaceFromName(config, placeName);
  const shellsData = shells.data[place.placeId]?.data;
  if (!shellsData) return null;

  const weaponTables = Object.entries(shellsData).map(
    ([weapon, shellsList]) => {
      return `## ${weapon}\n\n${markdownTable([
        ['Shell name', 'Type'],
        ...shellsList.map((shell) => [
          `[${escapeMarkdownLink(shell.name)}](/md/${place.initials}/shells/${shell.slug}.md)`,
          shell.type,
        ]),
      ])}`;
    },
  );
  return formatMarkdown(`# Shells\n\n${weaponTables.join('\n\n')}`);
}

async function revalidateTeams(placeName: PlaceName) {
  const loadouts = getLoadouts();
  const { data: config } = getConfig();
  const place = getPlaceFromName(config, placeName);
  const loadoutsData = loadouts.data[place.placeId];
  if (!loadoutsData) return null;

  const teams = loadoutsData.metadata.teams;
  const table = markdownTable([
    ['Team name', 'Loadouts'],
    ...teams.map((team) => {
      const teamLoadouts = Object.entries(loadoutsData.data)
        .filter(([, loadout]) => loadout.teams.includes(team))
        .map(([name]) => name);
      return [
        `[${escapeMarkdownLink(team)}](/md/${place.initials}/teams/${encodeURIComponent(team)}.md)`,
        teamLoadouts.join(', '),
      ];
    }),
  ]);
  return formatMarkdown(`# Teams\n\n${table}`);
}

async function revalidateLoadouts(placeName: PlaceName) {
  const loadouts = getLoadouts();
  const { data: config } = getConfig();
  const place = getPlaceFromName(config, placeName);
  const loadoutsData = loadouts.data[place.placeId];
  if (!loadoutsData) return null;

  const loadoutNames = loadoutsData.metadata.loadouts;
  const table = markdownTable([
    ['Loadout name', 'Teams', 'Description'],
    ...loadoutNames.map((loadoutName) => {
      const loadout = loadoutsData.data[loadoutName];
      return [
        `[${escapeMarkdownLink(loadoutName)}](/md/${place.initials}/loadouts/${encodeURIComponent(loadoutName)}.md)`,
        loadout?.teams.join(', ') ?? '',
        loadout?.description ?? '',
      ];
    }),
  ]);
  return formatMarkdown(`# Loadouts\n\n${table}`);
}

// Caches for each route type
const indexCache = createCache<PlaceName, string | null>(revalidateIndex);
const kdrCache = createCache<PlaceName, string | null>(revalidateKdr);
const vehiclesCache = createCache<PlaceName, string | null>(revalidateVehicles);
const shellsCache = createCache<PlaceName, string | null>(revalidateShells);
const teamsCache = createCache<PlaceName, string | null>(revalidateTeams);
const loadoutsCache = createCache<PlaceName, string | null>(revalidateLoadouts);

function mdResponse(markdown: string, canonicalUrl: string) {
  return new Response(markdown, {
    headers: {
      Link: `<${canonicalUrl}>; rel="canonical"`,
      'X-Robots-Tag': 'noindex',
      'content-type': 'text/markdown; charset=utf-8',
      'cache-control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}

async function getCachedMarkdown(
  cache: Cache<PlaceName, string | null>,
  revalidateFn: (placeName: PlaceName) => Promise<string | null>,
  placeName: PlaceName,
) {
  let markdown = await cache.get(placeName);
  if (!markdown) {
    markdown = await revalidateFn(placeName);
    cache.set(placeName, markdown);
  }
  return markdown;
}

// handler for html-to-markdown routes (vehicles/[vehicle], shells/[shell], etc.)
const htmlToMdHandler = createMarkdownRouteHandler();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  if (!path || path.length === 0) return NextResponse.json({}, { status: 404 });

  const initials = path[0];
  const { data: config } = getConfig();
  const placeName = getNameFromInitials(config, initials);
  if (!placeName) return NextResponse.json({}, { status: 404 });

  const baseUrl = getBaseUrl();
  const remaining = path.slice(1);

  // /md/[place]/index.md
  if (remaining.length === 1 && remaining[0] === 'index.md') {
    const markdown = await getCachedMarkdown(
      indexCache,
      revalidateIndex,
      placeName,
    );
    if (!markdown) return NextResponse.json({}, { status: 404 });
    return mdResponse(markdown, new URL(initials, baseUrl).toString());
  }

  // /md/[place]/kdr.md
  if (remaining.length === 1 && remaining[0] === 'kdr.md') {
    const markdown = await getCachedMarkdown(
      kdrCache,
      revalidateKdr,
      placeName,
    );
    if (!markdown) return NextResponse.json({}, { status: 404 });
    return mdResponse(
      markdown,
      new URL(`${initials}/kdr`, baseUrl).toString(),
    );
  }

  // /md/[place]/vehicles.md
  if (remaining.length === 1 && remaining[0] === 'vehicles.md') {
    const markdown = await getCachedMarkdown(
      vehiclesCache,
      revalidateVehicles,
      placeName,
    );
    if (!markdown) return NextResponse.json({}, { status: 404 });
    return mdResponse(
      markdown,
      new URL(`${initials}/vehicles`, baseUrl).toString(),
    );
  }

  // /md/[place]/shells.md
  if (remaining.length === 1 && remaining[0] === 'shells.md') {
    const markdown = await getCachedMarkdown(
      shellsCache,
      revalidateShells,
      placeName,
    );
    if (!markdown) return NextResponse.json({}, { status: 404 });
    return mdResponse(
      markdown,
      new URL(`${initials}/shells`, baseUrl).toString(),
    );
  }

  // /md/[place]/teams.md
  if (remaining.length === 1 && remaining[0] === 'teams.md') {
    const markdown = await getCachedMarkdown(
      teamsCache,
      revalidateTeams,
      placeName,
    );
    if (!markdown) return NextResponse.json({}, { status: 404 });
    return mdResponse(
      markdown,
      new URL(`${initials}/teams`, baseUrl).toString(),
    );
  }

  // /md/[place]/loadouts.md
  if (remaining.length === 1 && remaining[0] === 'loadouts.md') {
    const markdown = await getCachedMarkdown(
      loadoutsCache,
      revalidateLoadouts,
      placeName,
    );
    if (!markdown) return NextResponse.json({}, { status: 404 });
    return mdResponse(
      markdown,
      new URL(`${initials}/loadouts`, baseUrl).toString(),
    );
  }

  // /md/[place]/vehicles/[vehicle].md, /md/[place]/shells/[shell].md, etc.
  // These use html-to-markdown conversion
  const resolvedUrl = `/md/${path.join('/')}`;
  return htmlToMdHandler(request, resolvedUrl);
}
