import React from 'react';

import { ARMOR_CDN_BASE } from './constants';
import { parseMtca } from './mtca';
import {
  computeDetectedRange,
  renderHeatmapToImageData,
} from './renderArmorHeatmap';

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
  usedModuleIndices: ReadonlySet<number>;
  version: number | null;
}

export { RICOCHET_DARK, RICOCHET_LIGHT } from './renderArmorHeatmap';

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
      `${ARMOR_CDN_BASE}/${slug}/${angle}_armor.mtca`,
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

    const { max, min } = computeDetectedRange(
      rawData,
      ricochetAngle,
      minDepth,
      maxDepth,
    );
    setDetectedMin(min);
    setDetectedMax(max);
  }, [rawData, ricochetAngle, minDepth, maxDepth, hiddenModules]);

  React.useEffect(() => {
    if (!rawData) {
      setOutputCanvas(null);
      return;
    }

    const effectiveMin = autoRange ? detectedMin : minMm;
    const effectiveMax = autoRange ? detectedMax : maxMm;
    const { data, height, width } = renderHeatmapToImageData(rawData, {
      minMm: effectiveMin,
      maxMm: effectiveMax,
      palette,
      ricochetAngle,
      minDepth,
      maxDepth,
      hiddenModules,
    });

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.createImageData(width, height);
    imageData.data.set(data);
    ctx.putImageData(imageData, 0, 0);
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
      const moduleMinDepth = new Map<string, number>();

      for (const layer of pixel.layers) {
        if (layer.moduleIndex > 0) {
          if (layer.depth >= minDepth && layer.depth <= maxDepth) {
            total += layer.thickness;
          }
        } else {
          if (layer.depth < minDepth || layer.depth > maxDepth) continue;

          total += layer.thickness;
        }

        if (layer.moduleIndex > 0 && !hiddenModules.has(layer.moduleIndex)) {
          const mod = raw.modules[layer.moduleIndex - 1];
          if (mod) {
            const existing = moduleHits.find((h) => h.name === mod.name);
            if (existing) {
              existing.thickness += layer.thickness;
            } else {
              moduleHits.push({
                name: mod.name,
                thickness: layer.thickness,
              });
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
    },
    [ricochetAngle, minDepth, maxDepth, hiddenModules],
  );

  const usedModuleIndices = React.useMemo(() => {
    if (!rawData) return new Set<number>();
    const used = new Set<number>();
    for (const pixel of rawData.pixels) {
      if (!pixel) continue;
      for (const layer of pixel.layers) {
        if (layer.moduleIndex > 0) used.add(layer.moduleIndex);
      }
    }
    return used;
  }, [rawData]);

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
    usedModuleIndices,
    version,
  };
}
