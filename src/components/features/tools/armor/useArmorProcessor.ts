import React from 'react';

import { parseMtca } from './mtca';
import { samplePalette } from './palettes';

import type { DamageModule, RawArmorData } from './mtca';
import type { Palette } from './palettes';
import type { ArmorAngle } from '@/utils/getVehicleImage';

export interface PixelTooltipData {
  moduleHits: { name: string; thickness: number }[];
  total: number;
}

export interface ArmorProcessorOptions {
  angle: ArmorAngle;
  autoRange: boolean;
  hiddenModules: ReadonlySet<number>;
  maxDepth: number;
  maxMm: number;
  minDepth: number;
  minMm: number;
  overrideData: RawArmorData | null;
  palette: Palette;
  ricochetAngle: number;
  slug: string | null;
}

export interface ArmorProcessorResult {
  canvas: HTMLCanvasElement | null;
  detectedMax: number;
  detectedMaxDepth: number;
  detectedMin: number;
  downloadProgress: number | null;
  error: string | null;
  loading: boolean;
  modules: DamageModule[];
  thicknessAt: (x: number, y: number) => PixelTooltipData | 'ricochet' | null;
  version: number | null;
}

const STRIPE_SPACING = 6;
const STRIPE_WIDTH = 2;
export const RICOCHET_LIGHT = { b: 150, g: 150, r: 150 };
export const RICOCHET_DARK = { b: 60, g: 60, r: 60 };

export function getViewAngleRad(angle: ArmorAngle): number {
  switch (angle) {
    case 'front_-30':
      return (30 * Math.PI) / 180;
    case 'front_30':
      return (-30 * Math.PI) / 180;
    case 'left':
      return (-90 * Math.PI) / 180;
    case 'right':
      return (90 * Math.PI) / 180;
    case 'back':
      return Math.PI;
    default:
      return 0;
  }
}

function isRicochetStripe(x: number, y: number): boolean {
  return (x + y) % STRIPE_SPACING < STRIPE_WIDTH;
}

async function fetchAndParseMtca(
  url: string,
  onProgress?: (percent: number) => void,
): Promise<RawArmorData> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch armour data (${response.status})`);
  }

  const contentLength = response.headers.get('Content-Length');
  const total = contentLength ? parseInt(contentLength, 10) : null;
  const reader = response.body!.getReader();

  const chunks: Uint8Array[] = [];
  let receivedLength = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    chunks.push(value);
    receivedLength += value.length;

    if (onProgress) {
      const percent =
        total && total > 0
          ? Math.round((receivedLength / total) * 100)
          : Math.min(95, Math.round((receivedLength / 500_000) * 90));
      onProgress(percent);
    }
  }

  if (onProgress) onProgress(100);

  const combined = new Uint8Array(receivedLength);
  let position = 0;
  for (const chunk of chunks) {
    combined.set(chunk, position);
    position += chunk.length;
  }

  const view = new DataView(
    combined.buffer,
    combined.byteOffset,
    combined.byteLength,
  );
  return parseMtca(view);
}

export function useArmorProcessor(
  options: ArmorProcessorOptions,
): ArmorProcessorResult {
  const {
    angle,
    autoRange,
    hiddenModules,
    maxDepth,
    maxMm,
    minDepth,
    minMm,
    overrideData,
    palette,
    ricochetAngle,
    slug,
  } = options;

  const [loading, setLoading] = React.useState(false);
  const [downloadProgress, setDownloadProgress] = React.useState<number | null>(
    null,
  );
  const [error, setError] = React.useState<string | null>(null);
  const [rawData, setRawData] = React.useState<RawArmorData | null>(null);
  const [detectedMin, setDetectedMin] = React.useState(0);
  const [detectedMax, setDetectedMax] = React.useState(1000);
  const [detectedMaxDepth, setDetectedMaxDepth] = React.useState(100);
  const [outputCanvas, setOutputCanvas] =
    React.useState<HTMLCanvasElement | null>(null);
  const rawDataRef = React.useRef<RawArmorData | null>(null);

  React.useEffect(() => {
    if (overrideData) {
      let maxD = 0;
      for (const pixel of overrideData.pixels) {
        if (!pixel) continue;
        for (const layer of pixel.layers) {
          if (layer.depth > maxD) maxD = layer.depth;
        }
      }

      rawDataRef.current = overrideData;
      setRawData(overrideData);
      setDetectedMaxDepth(Math.ceil(maxD));
      setLoading(false);
      setDownloadProgress(null);
      setError(null);
      return;
    }

    if (!slug) {
      setRawData(null);
      rawDataRef.current = null;
      setLoading(false);
      setDownloadProgress(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setDownloadProgress(0);
    setError(null);

    fetchAndParseMtca(
      `https://cdn.astrid.ovh/public-stats-images/${slug}/${angle}_armor.mtca`,
      (percent) => {
        if (!cancelled) setDownloadProgress(percent);
      },
    )
      .then((data) => {
        if (cancelled) return;

        let maxD = 0;
        for (const pixel of data.pixels) {
          if (!pixel) continue;
          for (const layer of pixel.layers) {
            if (layer.depth > maxD) maxD = layer.depth;
          }
        }

        rawDataRef.current = data;
        setRawData(data);
        setDetectedMaxDepth(Math.ceil(maxD));
        setLoading(false);
        setDownloadProgress(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : 'Failed to load armour data',
        );
        setLoading(false);
        setDownloadProgress(null);
      });

    return () => {
      cancelled = true;
    };
  }, [slug, angle, overrideData]);

  React.useEffect(() => {
    if (!rawData) return;

    let min = Infinity;
    const thicknesses: number[] = [];

    for (const pixel of rawData.pixels) {
      if (!pixel) continue;
      if (pixel.angle > 0 && pixel.angle >= ricochetAngle) continue;

      let sum = 0;
      for (const layer of pixel.layers) {
        if (layer.moduleIndex > 0) {
          if (hiddenModules.has(layer.moduleIndex)) continue;

          if (layer.depth >= minDepth && layer.depth <= maxDepth) {
            sum += layer.thickness;
          }
        } else {
          if (layer.depth < minDepth || layer.depth > maxDepth) continue;

          sum += layer.thickness;
        }
      }

      if (sum > 0 || pixel.layers.length > 0) {
        if (sum < min) min = sum;
        thicknesses.push(sum);
      }
    }

    if (min === Infinity || thicknesses.length === 0) {
      setDetectedMin(0);
      setDetectedMax(1000);
      return;
    }

    thicknesses.sort((a, b) => a - b);
    const percentileIndex = Math.floor(thicknesses.length * 0.95);
    const percentile95 =
      thicknesses[percentileIndex] ?? thicknesses[thicknesses.length - 1];

    setDetectedMin(min);
    setDetectedMax(percentile95);
  }, [rawData, ricochetAngle, minDepth, maxDepth, hiddenModules]);

  React.useEffect(() => {
    if (!rawData) {
      setOutputCanvas(null);
      return;
    }

    const effectiveMin = autoRange ? detectedMin : minMm;
    const effectiveMax = autoRange ? detectedMax : maxMm;
    const range = effectiveMax - effectiveMin;

    const canvas = document.createElement('canvas');
    canvas.width = rawData.cols;
    canvas.height = rawData.rows;
    const ctx = canvas.getContext('2d')!;
    const output = ctx.createImageData(rawData.cols, rawData.rows);
    const dst = output.data;

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
            if (hiddenModules.has(layer.moduleIndex)) continue;

            hasModule = true;
            hasInRange = true;
            if (layer.depth >= minDepth && layer.depth <= maxDepth) {
              total += layer.thickness;
            }
          } else {
            if (layer.depth < minDepth || layer.depth > maxDepth) continue;

            hasInRange = true;
            total += layer.thickness;
          }
        }

        if (total > 0) {
          const t = range > 0 ? (total - effectiveMin) / range : 0;
          const color = samplePalette(palette, t);
          if (hasModule) {
            const s = palette.moduleShift;
            dst[di] = Math.min(255, color.r + s.r);
            dst[di + 1] = Math.min(255, color.g + s.g);
            dst[di + 2] = Math.min(255, color.b + s.b);
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
          const t = range > 0 ? (0 - effectiveMin) / range : 0;
          const color = samplePalette(palette, t);
          dst[di] = color.r;
          dst[di + 1] = color.g;
          dst[di + 2] = color.b;
          dst[di + 3] = pixel.layers.length > 0 && !hasInRange ? 60 : 255;
        }
      }
    }

    ctx.putImageData(output, 0, 0);
    setOutputCanvas(canvas);
  }, [
    rawData,
    minMm,
    maxMm,
    palette,
    autoRange,
    detectedMin,
    detectedMax,
    ricochetAngle,
    minDepth,
    maxDepth,
    hiddenModules,
  ]);

  const thicknessAt = React.useCallback(
    (x: number, y: number): PixelTooltipData | 'ricochet' | null => {
      const raw = rawDataRef.current;
      if (!raw) return null;

      const px = Math.floor(x);
      const py = Math.floor(y);
      if (px < 0 || py < 0 || px >= raw.cols || py >= raw.rows) return null;

      const idx = py * raw.cols + px;
      const pixel = raw.pixels[idx];
      if (!pixel) return null;

      if (pixel.angle > 0 && pixel.angle >= ricochetAngle) return 'ricochet';

      let total = 0;
      const moduleHits: PixelTooltipData['moduleHits'] = [];

      for (const layer of pixel.layers) {
        if (layer.moduleIndex > 0) {
          if (hiddenModules.has(layer.moduleIndex)) continue;

          if (layer.depth >= minDepth && layer.depth <= maxDepth) {
            total += layer.thickness;
          }
        } else {
          if (layer.depth < minDepth || layer.depth > maxDepth) continue;

          total += layer.thickness;
        }

        if (layer.moduleIndex > 0) {
          const mod = raw.modules[layer.moduleIndex - 1];
          if (mod) {
            const existing = moduleHits.find((h) => h.name === mod.name);
            if (existing) existing.thickness += layer.thickness;
            else {
              moduleHits.push({
                name: mod.name,
                thickness: layer.thickness,
              });
            }
          }
        }
      }

      return { moduleHits, total };
    },
    [ricochetAngle, minDepth, maxDepth, hiddenModules],
  );

  const modules = rawData?.modules ?? [];
  const version = rawData?.version ?? null;

  return {
    canvas: outputCanvas,
    detectedMax,
    detectedMaxDepth,
    detectedMin,
    downloadProgress,
    error,
    loading,
    modules,
    thicknessAt,
    version,
  };
}
