import { samplePalette } from '@/components/features/tools/armor/palettes';

import type { RawArmorData } from '@/components/features/tools/armor/mtca';
import type { Palette } from '@/components/features/tools/armor/palettes';

const STRIPE_SPACING = 6;
const STRIPE_WIDTH = 2;
export const RICOCHET_LIGHT = { b: 150, g: 150, r: 150 };
export const RICOCHET_DARK = { b: 60, g: 60, r: 60 };

function isRicochetStripe(x: number, y: number): boolean {
  return (x + y) % STRIPE_SPACING < STRIPE_WIDTH;
}

export function computeDetectedRange(
  rawData: RawArmorData,
  ricochetAngle: number,
  minDepth: number,
  maxDepth: number,
): { min: number; max: number } {
  let min = Infinity;
  const thicknesses: number[] = [];

  for (const pixel of rawData.pixels) {
    if (!pixel) continue;
    if (pixel.angle > 0 && pixel.angle >= ricochetAngle) continue;

    let sum = 0;
    for (const layer of pixel.layers) {
      if (layer.depth >= minDepth && layer.depth <= maxDepth) {
        sum += layer.thickness;
      }
    }

    if (sum > 0 || pixel.layers.length > 0) {
      if (sum < min) min = sum;
      thicknesses.push(sum);
    }
  }

  if (min === Infinity || thicknesses.length === 0) {
    return { min: 0, max: 1000 };
  }

  thicknesses.sort((a, b) => a - b);
  const percentileIndex = Math.floor(thicknesses.length * 0.95);
  const max =
    thicknesses[percentileIndex] ?? thicknesses[thicknesses.length - 1];
  return { min, max };
}

export interface RenderHeatmapOptions {
  minMm: number;
  maxMm: number;
  palette: Palette;
  ricochetAngle: number;
  minDepth: number;
  maxDepth: number;
  hiddenModules: ReadonlySet<number>;
}

export function renderHeatmapToImageData(
  rawData: RawArmorData,
  options: RenderHeatmapOptions,
): { data: Uint8ClampedArray; width: number; height: number } {
  const {
    hiddenModules,
    maxDepth,
    maxMm,
    minDepth,
    minMm,
    palette,
    ricochetAngle,
  } = options;

  const range = maxMm - minMm;
  const output = new Uint8ClampedArray(rawData.cols * rawData.rows * 4);
  const dst = output;

  for (let row = 0; row < rawData.rows; row += 1) {
    for (let col = 0; col < rawData.cols; col += 1) {
      const idx = row * rawData.cols + col;
      const pixel = rawData.pixels[idx];
      const di = idx * 4;

      if (!pixel) {
        dst[di] = 0;
        dst[di + 1] = 0;
        dst[di + 2] = 0;
        dst[di + 3] = 0;
        continue;
      }

      if (pixel.angle > 0 && pixel.angle >= ricochetAngle) {
        const c = isRicochetStripe(col, row) ? RICOCHET_LIGHT : RICOCHET_DARK;
        dst[di] = c.r;
        dst[di + 1] = c.g;
        dst[di + 2] = c.b;
        dst[di + 3] = 255;
        continue;
      }

      let total = 0;
      let hasInRange = false;
      let hasModule = false;

      for (const layer of pixel.layers) {
        if (layer.moduleIndex > 0) {
          if (hiddenModules.has(layer.moduleIndex)) {
            if (layer.depth >= minDepth && layer.depth <= maxDepth) {
              hasInRange = true;
              total += layer.thickness;
            }
          } else {
            hasModule = true;
            hasInRange = true;
            if (layer.depth >= minDepth && layer.depth <= maxDepth) {
              total += layer.thickness;
            }
          }
        } else {
          if (layer.depth < minDepth || layer.depth > maxDepth) continue;

          hasInRange = true;
          total += layer.thickness;
        }
      }

      if (total > 0) {
        const t = range > 0 ? (total - minMm) / range : 0;
        const color = samplePalette(palette, t);
        if (hasModule) {
          const k = 0.4;
          const mc = palette.moduleColor;
          dst[di] = Math.round(color.r * (1 - k) + mc.r * k);
          dst[di + 1] = Math.round(color.g * (1 - k) + mc.g * k);
          dst[di + 2] = Math.round(color.b * (1 - k) + mc.b * k);
        } else {
          dst[di] = color.r;
          dst[di + 1] = color.g;
          dst[di + 2] = color.b;
        }
        dst[di + 3] = 255;
      } else if (hasInRange && hasModule) {
        dst[di] = palette.moduleColor.r;
        dst[di + 1] = palette.moduleColor.g;
        dst[di + 2] = palette.moduleColor.b;
        dst[di + 3] = 140;
      } else {
        const t = range > 0 ? (0 - minMm) / range : 0;
        const color = samplePalette(palette, t);
        dst[di] = color.r;
        dst[di + 1] = color.g;
        dst[di + 2] = color.b;
        dst[di + 3] = pixel.layers.length > 0 && !hasInRange ? 60 : 255;
      }
    }
  }

  return {
    data: output,
    width: rawData.cols,
    height: rawData.rows,
  };
}
