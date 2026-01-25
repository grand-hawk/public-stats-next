import { MEDIA_PREFIX } from '@/env';

const shells: Record<string, RegExp[]> = {
  '/shells/AP.png': [/^AP$/],
  '/shells/APHE.png': [/^APHE$/],
  '/shells/APCR.png': [/^APCR$/, /^APDS$/],
  '/shells/APFSDS.png': [/^APFSDS$/, /^APFSDS ANTI-ERA$/, /^CANISTER APFSDS$/],
  '/shells/DU_APFSDS.png': [
    /^DU APFSDS$/,
    /^DU APFSDS ANTI-ERA$/,
    /^APFSDS INCENDIARY ANTI-ERA$/,
  ],
  '/shells/MG.png': [/^MG$/],

  '/shells/HE.png': [/^HE$/],
  '/shells/HESH.png': [/^HESH$/],
  '/shells/HEAT.png': [/^HEAT$/],
  '/shells/HEAT-FS.png': [/^HEAT-FS$/],
  '/shells/SAPHE.png': [/^SAPHE$/],
  '/shells/PROXIMITY_FUZE.png': [/^PROXIMITY FUZE$/],
  '/shells/TIME_FUZE.png': [/^TIME FUZE$/],

  '/shells/ATGM.png': [/MISSILE$/],
  '/shells/ATGM_HE.png': [],
  '/shells/ATGM_TANDEM.png': [/^TANDEM .* MISSILE$/],
  '/shells/ATGM_OTA.png': [/^OTA .* MISSILE$/],
  '/shells/ATGM_PROXIMITY_FUZE.png': [/^PROXIMITY .* MISSILE$/],
  '/shells/ATGM_FNF.png': [/^F&F MISSILE$/, /^TANDEM F&F MISSILE$/],

  '/shells/AA.png': [/AIR-TO-AIR/],
  '/shells/AA_PROXIMITY_FUZE.png': [/^PROXIMITY AIR-TO-AIR MISSILE$/],

  '/shells/ROCKET.png': [/^ROCKET$/],
  '/shells/CANISTER.png': [/^CANISTER$/],
  '/shells/CLUSTER.png': [/^CLUSTER$/],
  '/shells/CLUSTER_INCENDIARY.png': [/^INCENDIARY ROCKET$/],
  '/shells/THERMOBARIC.png': [/^THERMOBARIC$/],
  '/shells/SMOKE.png': [/^SMOKE$/],
};

const shellTypeCache = new Map<string, string | undefined>();

export function getShellTypeIcon(type: string) {
  const cached = shellTypeCache.get(type);
  if (cached) return cached;

  let lastMatch: string | undefined;

  for (const [icon, patterns] of Object.entries(shells))
    if (patterns.some((pattern) => pattern.test(type)))
      lastMatch = `${MEDIA_PREFIX}/assets/icons${icon}`;

  shellTypeCache.set(type, lastMatch);

  return lastMatch;
}
