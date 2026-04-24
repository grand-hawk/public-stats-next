const DISPLAY_NAMES: Record<string, string> = {
  WW2: 'World War 2',
};

export function loadoutDisplayName(name: string): string {
  return DISPLAY_NAMES[name] ?? name;
}
