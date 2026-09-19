import { shellRefKey } from '@/server/utils/articles/parse';

import type { GlossaryTerm } from '@/server/utils/articles/glossary';
import type { ArticleRefs } from '@/server/utils/articles/parse';

export interface ResolvedVehicle {
  name: string;
  slug: string;
  role: string;
  team: string;
}

export interface ResolvedShell {
  name: string;
  slug: string;
  displayType: string;
  weapon: string;
}

export interface ResolvedRefs {
  vehicles: Record<string, ResolvedVehicle>;
  shells: Record<string, ResolvedShell>;
  articles: Record<string, { title: string }>;
  terms: Record<string, GlossaryTerm>;
}

export interface VehicleSource {
  info: {
    gameId: string;
    slug: string;
    role?: string;
    team?: string;
    unlisted?: boolean;
  };
}

export interface ShellSource {
  name: string;
  slug: string;
  displayType: string;
}

export interface ResolveSources {
  vehicles: Record<string, VehicleSource>;
  shells: Record<string, ShellSource[]>;
  articleTitles: Map<string, string>;
  glossary: GlossaryTerm[];
}

export function resolveRefs(
  refs: ArticleRefs,
  { articleTitles, glossary, shells, vehicles }: ResolveSources,
): ResolvedRefs {
  const resolved: ResolvedRefs = {
    vehicles: {},
    shells: {},
    articles: {},
    terms: {},
  };

  const wantedVehicles = new Set(refs.vehicles);
  for (const [name, vehicle] of Object.entries(vehicles)) {
    const { gameId, role, slug, team } = vehicle.info;
    if (!wantedVehicles.has(gameId)) continue;
    if (resolved.vehicles[gameId] && vehicle.info.unlisted) continue;

    resolved.vehicles[gameId] = {
      name,
      slug,
      role: role ?? '',
      team: team ?? '',
    };
  }

  for (const ref of refs.shells) {
    const weapons = ref.weapon ? [ref.weapon] : Object.keys(shells);

    for (const weapon of weapons) {
      const shell = shells[weapon]?.find(
        (candidate) => candidate.name === ref.name,
      );
      if (!shell) continue;

      resolved.shells[shellRefKey(ref)] = {
        name: shell.name,
        slug: shell.slug,
        displayType: shell.displayType,
        weapon,
      };
      break;
    }
  }

  for (const { slug } of refs.articles) {
    const title = articleTitles.get(slug);
    if (title) resolved.articles[slug] = { title };
  }

  const wantedTerms = new Set(refs.terms);
  for (const term of glossary) {
    if (wantedTerms.has(term.id)) resolved.terms[term.id] = term;
  }

  return resolved;
}
