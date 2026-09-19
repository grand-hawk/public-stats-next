import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

import { createConsola } from 'consola';
import slugify from 'slug';

import { VEHICLE_CLASS_CATEGORIES } from '@/components/features/vehicles/classCategories';
import { STAT_ARTICLES } from '@/content/statLinks';
import { ARTICLES_DIR, readArticlesFromDisk } from '@/server/utils/articles';
import {
  GLOSSARY_PATH,
  GLOSSARY_SLUG,
  parseGlossary,
} from '@/server/utils/articles/glossary';
import {
  NAVIGATION_PATH,
  parseNavigation,
} from '@/server/utils/articles/navigation';
import {
  ARTICLE_SLUG,
  RESERVED_SLUGS,
} from '@/server/utils/articles/reserved';
import { getConfig } from '@generated/config';
import { getLoadouts } from '@generated/loadouts';
import { getShells } from '@generated/shells';
import { getVehicles } from '@generated/vehicles';

import type { VehiclesPlaceDataVehicle } from '@generated/vehicles';

const STAT_LINKS_PATH = 'src/content/statLinks.ts';
const REGISTRY_PATH = 'src/content/articleModules.ts';
const REGISTRY_IMPORT = /content\/articles\/([a-z0-9-]+)\/index\.mdx/g;
const BANNED_WORDS = /\b(so|but|studs?)\b/gi;

const consola = createConsola({ formatOptions: { date: false } });

const errors = new Map<string, string[]>();
const warnings = new Map<string, string[]>();

function note(store: Map<string, string[]>, file: string, message: string) {
  store.set(file, [...(store.get(file) ?? []), message]);
}

const articles = readArticlesFromDisk();
const glossary = existsSync(GLOSSARY_PATH)
  ? parseGlossary(readFileSync(GLOSSARY_PATH, 'utf-8'))
  : [];
const groups = new Set(
  existsSync(NAVIGATION_PATH)
    ? parseNavigation(readFileSync(NAVIGATION_PATH, 'utf-8')).map(
        (group) => group.key,
      )
    : [],
);

const termIds = new Set(glossary.map((term) => term.id));
const anchorsBySlug = new Map(
  articles.map((article) => [
    article.slug,
    new Set(article.outline.map((heading) => heading.id)),
  ]),
);
for (const term of glossary) anchorsBySlug.get(GLOSSARY_SLUG)?.add(term.anchor);

const { placeIds, primaryPlace } = getConfig().data;
const primaryPlaceId = placeIds[primaryPlace];
const gameIds = new Set<string>();
const primaryGameIds = new Set<string>();
const loadoutGameIds = new Set<string>();
const loadoutVehicleNames = new Set<string>();
const teamSlugs = new Set<string>();

for (const loadout of Object.values(
  getLoadouts().data[primaryPlaceId]?.data ?? {},
)) {
  for (const name of Object.keys(loadout?.vehicles ?? {})) {
    loadoutVehicleNames.add(name);
  }
}

for (const [placeId, place] of Object.entries(getVehicles().data ?? {})) {
  const placeVehicles = (place?.data ?? {}) as Record<
    string,
    VehiclesPlaceDataVehicle
  >;
  for (const [name, vehicle] of Object.entries(placeVehicles)) {
    gameIds.add(vehicle.info.gameId);
    if (placeId === primaryPlaceId && loadoutVehicleNames.has(name)) {
      loadoutGameIds.add(vehicle.info.gameId);
    }
    if (placeId === primaryPlaceId) primaryGameIds.add(vehicle.info.gameId);
    if (vehicle.info.team) teamSlugs.add(slugify(vehicle.info.team));
  }
}
for (const place of Object.values(getLoadouts().data ?? {})) {
  for (const team of place?.metadata?.teams ?? []) teamSlugs.add(slugify(team));
}

const shellTypesByName = new Map<string, Set<string>>();
const shellKeys = new Set<string>();
for (const place of Object.values(getShells().data ?? {})) {
  const placeShells = (place?.data ?? {}) as Record<
    string,
    { name: string; displayType: string }[]
  >;
  for (const [weapon, shells] of Object.entries(placeShells)) {
    for (const shell of shells) {
      shellKeys.add(`${weapon}::${shell.name}`);
      const types = shellTypesByName.get(shell.name) ?? new Set<string>();
      types.add(shell.displayType);
      shellTypesByName.set(shell.name, types);
    }
  }
}
const hasGameData = gameIds.size > 0;

const classSlugs = new Set(
  VEHICLE_CLASS_CATEGORIES.map((category) => category.slug),
);

const seenSlugs = new Map<string, string>();

function claimSlug(slug: string, file: string, kind: string) {
  if (!ARTICLE_SLUG.test(slug)) {
    note(errors, file, `${kind} "${slug}" must be lowercase with dashes`);
  }
  if (RESERVED_SLUGS.has(slug)) {
    note(errors, file, `${kind} "${slug}" collides with a reserved route`);
  }
  const owner = seenSlugs.get(slug);
  if (owner) note(errors, file, `${kind} "${slug}" is already used by ${owner}`);
  else seenSlugs.set(slug, file);
}

function checkTarget(file: string, slug: string, anchor?: string) {
  const anchors = anchorsBySlug.get(slug);
  if (!anchors) {
    note(errors, file, `Link to unknown article "${slug}"`);
    return;
  }
  if (anchor && !anchors.has(anchor)) {
    note(errors, file, `Link to unknown anchor "${slug}#${anchor}"`);
  }
}

for (const article of articles) {
  const file = path.join(ARTICLES_DIR, article.slug, 'index.mdx');

  for (const error of article.metaErrors) note(errors, file, error);

  claimSlug(article.slug, file, 'Slug');
  for (const alias of article.meta.aliases) claimSlug(alias, file, 'Alias');

  if (article.meta.group && !groups.has(article.meta.group)) {
    note(
      errors,
      file,
      `Group "${article.meta.group}" is not defined in ${NAVIGATION_PATH}`,
    );
  }

  const headingIds = new Set<string>();
  for (const heading of article.outline) {
    if (!heading.id) note(errors, file, 'A heading has no text');
    if (headingIds.has(heading.id)) {
      note(errors, file, `Duplicate heading "${heading.text}"`);
    }
    headingIds.add(heading.id);
  }

  for (const ref of article.refs.articles) {
    checkTarget(file, ref.slug, ref.anchor);
  }

  for (const id of article.refs.terms) {
    if (!termIds.has(id)) {
      note(errors, file, `Term "${id}" is not defined in ${GLOSSARY_PATH}`);
    }
  }

  for (const name of article.refs.classes) {
    if (!classSlugs.has(name)) {
      note(errors, file, `Unknown vehicle class "${name}"`);
    }
  }

  for (const figure of article.figures) {
    if (!figure.hasAlt) {
      note(errors, file, `Line ${figure.line}: Figure is missing alt text`);
    }
  }

  for (const match of article.text.matchAll(BANNED_WORDS)) {
    note(errors, file, `The word "${match[0]}" is not allowed in articles`);
  }

  if (!article.leadHasBold) {
    note(errors, file, 'The opening paragraph must name the subject in bold');
  }

  for (const line of article.bareImages) {
    note(
      errors,
      file,
      `Line ${line}: markdown images are not allowed, use <Figure>`,
    );
  }

  if (!hasGameData) continue;

  for (const id of article.refs.vehicles) {
    if (!gameIds.has(id)) {
      note(warnings, file, `Vehicle id "${id}" does not exist in any place`);
    } else if (!primaryGameIds.has(id)) {
      note(warnings, file, `Vehicle id "${id}" is not in ${primaryPlace}`);
    } else if (!loadoutGameIds.has(id)) {
      note(errors, file, `Vehicle "${id}" is not in any public loadout`);
    }
  }

  for (const ref of article.refs.shells) {
    const types = shellTypesByName.get(ref.name);
    if (!types) {
      note(warnings, file, `Shell "${ref.name}" does not exist in any place`);
    } else if (ref.weapon && !shellKeys.has(`${ref.weapon}::${ref.name}`)) {
      note(
        warnings,
        file,
        `Shell "${ref.name}" does not exist on "${ref.weapon}"`,
      );
    } else if (!ref.weapon && types.size > 1) {
      note(
        warnings,
        file,
        `Shell "${ref.name}" names different rounds (${[...types].join(', ')}); add a weapon`,
      );
    }
  }

  for (const team of article.refs.teams) {
    if (!teamSlugs.has(slugify(team))) {
      note(warnings, file, `Team "${team}" does not exist in any place`);
    }
  }
}

const glossaryAnchors = new Set<string>();
for (const term of glossary) {
  for (const match of term.definition.matchAll(BANNED_WORDS)) {
    note(
      errors,
      GLOSSARY_PATH,
      `"${term.label}": the word "${match[0]}" is not allowed`,
    );
  }
  if (term.article) {
    const [slug, anchor] = term.article.split('#');
    checkTarget(GLOSSARY_PATH, slug, anchor);
  }
  if (glossaryAnchors.has(term.anchor)) {
    note(errors, GLOSSARY_PATH, `Duplicate term label "${term.label}"`);
  }
  glossaryAnchors.add(term.anchor);
}
if (glossary.length > 0 && !anchorsBySlug.has(GLOSSARY_SLUG)) {
  note(errors, GLOSSARY_PATH, `No "${GLOSSARY_SLUG}" article exists`);
}

for (const [key, target] of Object.entries(STAT_ARTICLES)) {
  const [slug, anchor] = target.split('#');
  const before = errors.get(STAT_LINKS_PATH)?.length ?? 0;
  checkTarget(STAT_LINKS_PATH, slug, anchor);
  if ((errors.get(STAT_LINKS_PATH)?.length ?? 0) > before) {
    note(errors, STAT_LINKS_PATH, `"${key}" points at a missing page or section`);
  }
}

const registered = new Set(
  [...readFileSync(REGISTRY_PATH, 'utf-8').matchAll(REGISTRY_IMPORT)].map(
    (match) => match[1],
  ),
);
const onDisk = new Set(
  existsSync(ARTICLES_DIR)
    ? readdirSync(ARTICLES_DIR, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
    : [],
);
for (const slug of onDisk) {
  if (!registered.has(slug)) {
    note(errors, REGISTRY_PATH, `Article "${slug}" is not registered`);
  }
}
for (const slug of registered) {
  if (!onDisk.has(slug)) {
    note(errors, REGISTRY_PATH, `Registered article "${slug}" does not exist`);
  }
}

if (!hasGameData) {
  consola.warn('Game data is unavailable, vehicle and shell ids not checked');
}

for (const [file, messages] of warnings) {
  consola.warn(`${file}:\n${messages.map((m) => `  - ${m}`).join('\n')}`);
}
for (const [file, messages] of errors) {
  consola.error(`${file}:\n${messages.map((m) => `  - ${m}`).join('\n')}`);
}

if (errors.size > 0) {
  consola.fail('Article validation failed');
  process.exit(1);
}
consola.success(`Validated ${articles.length} articles`);
process.exit(0);
