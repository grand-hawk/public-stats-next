export const shells: Record<string, string[]> = {
  'assets/icons/shells/AP.png': [],
  'assets/icons/shells/APHE.png': [],
  'assets/icons/shells/APCR.png': [],
  'assets/icons/shells/APFSDS.png': [],
  'assets/icons/shells/DU_APFSDS.png': [],

  'assets/icons/shells/HE.png': [],
  'assets/icons/shells/HESH.png': [],
  'assets/icons/shells/HEAT.png': [],
  'assets/icons/shells/HEAT-FS.png': [],
  'assets/icons/shells/PROXIMITY_FUZE.png': [],
  'assets/icons/shells/TIME_FUZE.png': [],
  'assets/icons/shells/ROCKET.png': [],

  'assets/icons/shells/ATGM.png': [],
  'assets/icons/shells/ATGM_HE.png': [],
  'assets/icons/shells/ATGM_TANDEM.png': [],
  'assets/icons/shells/ATGM_OTA.png': [],
  'assets/icons/shells/ATGM_FNF.png': [],

  'assets/icons/shells/CANISTER.png': [],
  'assets/icons/shells/SMOKE.png': [],
};

export function getIcon(type: string) {
  for (const [icon, types] of Object.entries(shells))
    if (types.includes(type)) return icon;
}
