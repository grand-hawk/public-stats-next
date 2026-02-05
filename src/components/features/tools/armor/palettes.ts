export interface ColorStop {
  r: number;
  g: number;
  b: number;
}

export interface Palette {
  name: string;
  stops: ColorStop[];
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function samplePalette(palette: Palette, t: number): ColorStop {
  const clamped = Math.max(0, Math.min(1, t));
  const count = palette.stops.length;

  if (count === 1) return palette.stops[0];

  const scaled = clamped * (count - 1);
  const i = Math.floor(scaled);
  const frac = scaled - i;

  const a = palette.stops[Math.min(i, count - 1)];
  const b = palette.stops[Math.min(i + 1, count - 1)];

  return {
    r: Math.round(lerp(a.r, b.r, frac)),
    g: Math.round(lerp(a.g, b.g, frac)),
    b: Math.round(lerp(a.b, b.b, frac)),
  };
}

export const RICOCHET_COLOR: ColorStop = { r: 140, g: 140, b: 140 };

export const palettes: Palette[] = [
  {
    name: 'Green to Red',
    stops: [
      { r: 76, g: 175, b: 80 },
      { r: 205, g: 220, b: 57 },
      { r: 255, g: 235, b: 59 },
      { r: 255, g: 152, b: 0 },
      { r: 244, g: 67, b: 54 },
    ],
  },
  {
    name: 'Cool to Hot',
    stops: [
      { r: 33, g: 150, b: 243 },
      { r: 0, g: 188, b: 212 },
      { r: 255, g: 235, b: 59 },
      { r: 255, g: 152, b: 0 },
      { r: 244, g: 67, b: 54 },
    ],
  },
  {
    name: 'Inferno',
    stops: [
      { r: 0, g: 0, b: 4 },
      { r: 87, g: 16, b: 110 },
      { r: 188, g: 55, b: 84 },
      { r: 249, g: 142, b: 9 },
      { r: 252, g: 255, b: 164 },
    ],
  },
  {
    name: 'Grayscale',
    stops: [
      { r: 240, g: 240, b: 240 },
      { r: 20, g: 20, b: 20 },
    ],
  },
];
