export const shells: Record<string, RegExp[]> = {
  '/assets/icons/shells/AP.png': [/^AP$/],
  '/assets/icons/shells/APHE.png': [/^APHE$/],
  '/assets/icons/shells/APCR.png': [/^APCR$/, /^APDS$/],
  '/assets/icons/shells/APFSDS.png': [
    /^APFSDS$/,
    /^APFSDS ANTI-ERA$/,
    /^CANISTER APFSDS$/,
  ],
  '/assets/icons/shells/DU_APFSDS.png': [
    /^DU APFSDS$/,
    /^DU APFSDS ANTI-ERA$/,
    /^APFSDS INCENDIARY ANTI-ERA$/,
  ],
  '/assets/icons/shells/MG.png': [/^MG$/],

  '/assets/icons/shells/HE.png': [/^HE$/],
  '/assets/icons/shells/HESH.png': [/^HESH$/],
  '/assets/icons/shells/HEAT.png': [/^HEAT$/],
  '/assets/icons/shells/HEAT-FS.png': [/^HEAT-FS$/],
  '/assets/icons/shells/SAPHE.png': [/^SAPHE$/],
  '/assets/icons/shells/PROXIMITY_FUZE.png': [/^PROXIMITY FUZE$/],
  '/assets/icons/shells/TIME_FUZE.png': [/^TIME FUZE$/],

  '/assets/icons/shells/ATGM.png': [/MISSILE$/],
  '/assets/icons/shells/ATGM_HE.png': [],
  '/assets/icons/shells/ATGM_TANDEM.png': [/^TANDEM .* MISSILE$/],
  '/assets/icons/shells/ATGM_OTA.png': [/^OTA .* MISSILE$/],
  '/assets/icons/shells/ATGM_PROXIMITY_FUZE.png': [/^PROXIMITY .* MISSILE$/],
  '/assets/icons/shells/ATGM_FNF.png': [
    /^F&F MISSILE$/,
    /^TANDEM F&F MISSILE$/,
  ],

  '/assets/icons/shells/AA.png': [/AIR-TO-AIR/],
  '/assets/icons/shells/AA_PROXIMITY_FUZE.png': [
    /^PROXIMITY AIR-TO-AIR MISSILE$/,
  ],

  '/assets/icons/shells/ROCKET.png': [/^ROCKET$/],
  '/assets/icons/shells/CANISTER.png': [/^CANISTER$/],
  '/assets/icons/shells/CLUSTER.png': [/^CLUSTER$/],
  '/assets/icons/shells/CLUSTER_INCENDIARY.png': [/^INCENDIARY ROCKET$/],
  '/assets/icons/shells/THERMOBARIC.png': [/^THERMOBARIC$/],
  '/assets/icons/shells/SMOKE.png': [/^SMOKE$/],
};

export function getIcon(type: string) {
  let lastMatch: string | undefined;

  for (const [icon, patterns] of Object.entries(shells))
    if (patterns.some((pattern) => pattern.test(type))) lastMatch = icon;

  return lastMatch;
}
