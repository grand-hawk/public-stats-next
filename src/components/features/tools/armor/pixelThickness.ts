import type { RawArmorData } from '@/components/features/tools/armor/mtca';

export interface PixelTooltipData {
  moduleHits: { name: string; thickness: number }[];
  total: number;
}

interface DepthFilter {
  hiddenModules: ReadonlySet<number>;
  maxDepth: number;
  minDepth: number;
  ricochetAngle: number;
}

export function pixelThickness(
  raw: RawArmorData,
  x: number,
  y: number,
  { hiddenModules, maxDepth, minDepth, ricochetAngle }: DepthFilter,
): PixelTooltipData | 'ricochet' | null {
  const px = Math.floor(x);
  const py = Math.floor(y);
  if (px < 0 || py < 0 || px >= raw.cols || py >= raw.rows) return null;

  const pixel = raw.pixels[py * raw.cols + px];
  if (!pixel) return null;

  if (pixel.angle > 0 && pixel.angle >= ricochetAngle) return 'ricochet';

  let total = 0;
  const moduleHits: PixelTooltipData['moduleHits'] = [];
  const moduleMinDepth = new Map<string, number>();

  for (const layer of pixel.layers) {
    if (layer.depth >= minDepth && layer.depth <= maxDepth) {
      total += layer.thickness;
    }

    if (layer.moduleIndex > 0 && !hiddenModules.has(layer.moduleIndex)) {
      const mod = raw.modules[layer.moduleIndex - 1];
      if (mod) {
        const existing = moduleHits.find((h) => h.name === mod.name);
        if (existing) {
          existing.thickness += layer.thickness;
        } else {
          moduleHits.push({ name: mod.name, thickness: layer.thickness });
          moduleMinDepth.set(mod.name, layer.depth);
        }
      }
    }
  }

  moduleHits.sort(
    (a, b) =>
      (moduleMinDepth.get(a.name) ?? 0) - (moduleMinDepth.get(b.name) ?? 0),
  );

  return { moduleHits, total };
}
