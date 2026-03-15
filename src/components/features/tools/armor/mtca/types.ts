export interface DamageModule {
  maxHealth: number;
  name: string;
}

export interface Layer {
  depth: number;
  moduleIndex: number;
  thickness: number;
}

export interface PixelData {
  angle: number;
  layers: Layer[];
}

export interface RawArmorData {
  cols: number;
  modules: DamageModule[];
  pixels: (PixelData | null)[];
  rows: number;
  version: number;
}
