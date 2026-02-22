export interface RawArmorData {
  cols: number;
  pixels: (PixelData | null)[];
  rows: number;
}

export interface Layer {
  depth: number;
  thickness: number;
}

export interface PixelData {
  angle: number;
  layers: Layer[];
}
