export const shells: Record<string, string[]> = {
  '/assets/icons/shells/AP.png': ['AP'],
  '/assets/icons/shells/APHE.png': ['APHE'],
  '/assets/icons/shells/APCR.png': ['APCR', 'APDS'],
  '/assets/icons/shells/APFSDS.png': [
    'APFSDS',
    'APFSDS ANTI-ERA',
    'CANISTER APFSDS',
  ],
  '/assets/icons/shells/DU_APFSDS.png': [
    'DU APFSDS',
    'DU APFSDS ANTI-ERA',
    'APFSDS INCENDIARY ANTI-ERA',
  ],
  '/assets/icons/shells/MG.png': ['MG'],

  '/assets/icons/shells/HE.png': ['HE'],
  '/assets/icons/shells/HESH.png': ['HESH'],
  '/assets/icons/shells/HEAT.png': ['HEAT'],
  '/assets/icons/shells/HEAT-FS.png': ['HEAT-FS'],
  '/assets/icons/shells/PROXIMITY_FUZE.png': ['PROXIMITY FUZE'],
  '/assets/icons/shells/TIME_FUZE.png': ['TIME FUZE'],
  '/assets/icons/shells/ROCKET.png': ['ROCKET'],

  '/assets/icons/shells/ATGM.png': [
    'ANTI-TANK GUIDED MISSILE',
    'MACLOS MISSILE',
    'LASER GUIDED MISSILE',
    'AIR-TO-AIR MISSILE',
  ],
  '/assets/icons/shells/ATGM_HE.png': [],
  '/assets/icons/shells/ATGM_TANDEM.png': [
    'TANDEM ANTI-TANK GUIDED MISSILE',
    'TANDEM MACLOS MISSILE',
    'TANDEM LASER GUIDED MISSILE',
    'TANDEM AIR-TO-AIR MISSILE',
  ],
  '/assets/icons/shells/ATGM_OTA.png': [
    'OTA ANTI-TANK GUIDED MISSILE',
    'OTA MACLOS MISSILE',
    'OTA LASER GUIDED MISSILE',
  ],
  '/assets/icons/shells/ATGM_FNF.png': ['F&F MISSILE', 'TANDEM F&F MISSILE'],

  '/assets/icons/shells/CANISTER.png': ['CANISTER'],
  '/assets/icons/shells/SMOKE.png': ['SMOKE'],
};

export function getIcon(type: string) {
  for (const [icon, types] of Object.entries(shells))
    if (types.includes(type)) return icon;
}
