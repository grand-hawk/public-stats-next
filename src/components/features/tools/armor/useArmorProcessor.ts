import React from 'react';

import { samplePalette } from './palettes';

import type { Palette } from './palettes';
import type { ArmorAngle } from '@/utils/getVehicleImage';

export interface ArmorProcessorOptions {
  angle: ArmorAngle;
  autoRange: boolean;
  maxDepth: number;
  maxMm: number;
  minDepth: number;
  minMm: number;
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
  thicknessAt: (x: number, y: number) => number | 'ricochet' | null;
}

interface Layer {
  depth: number;
  thickness: number;
}

interface PixelData {
  angle: number;
  layers: Layer[];
}

interface RawArmorData {
  cols: number;
  pixels: (PixelData | null)[];
  rows: number;
}

function decodeAngle(encoded: number): number {
  if (encoded === 0) return 0;
  return 75 + (encoded - 1) * 0.0625;
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
  if (!response.ok)
    throw new Error(`Failed to fetch armour data (${response.status})`);

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
  const magic = String.fromCharCode(
    view.getUint8(0),
    view.getUint8(1),
    view.getUint8(2),
    view.getUint8(3),
  );
  if (magic !== 'MTCA') throw new Error('Invalid armour data format');

  const rows = view.getUint16(5);
  const cols = view.getUint16(7);

  let offset = 9;
  const pixels: (PixelData | null)[] = new Array(rows * cols);

  for (let i = 0; i < rows * cols; i += 1) {
    const angleByte = view.getUint8(offset);
    offset += 1;
    const count = view.getUint8(offset);
    offset += 1;

    if (angleByte === 0 && count === 0) {
      pixels[i] = null;
      continue;
    }

    const angle = decodeAngle(angleByte);
    const layers: Layer[] = [];

    for (let j = 0; j < count; j += 1) {
      const thickness = view.getUint16(offset);
      offset += 2;
      const depth = view.getFloat64(offset);
      offset += 8;
      layers.push({ depth, thickness });
    }

    pixels[i] = { angle, layers };
  }

  return { cols, pixels, rows };
}

export function useArmorProcessor(
  options: ArmorProcessorOptions,
): ArmorProcessorResult {
  const {
    angle,
    autoRange,
    maxDepth,
    maxMm,
    minDepth,
    minMm,
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
  }, [slug, angle]);

  React.useEffect(() => {
    if (!rawData) return;

    let min = Infinity;
    const thicknesses: number[] = [];

    for (const pixel of rawData.pixels) {
      if (!pixel) continue;
      if (pixel.angle > 0 && pixel.angle >= ricochetAngle) continue;

      let sum = 0;
      for (const layer of pixel.layers) {
        if (layer.depth >= minDepth && layer.depth <= maxDepth)
          sum += layer.thickness;
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
  }, [rawData, ricochetAngle, minDepth, maxDepth]);

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
        for (const layer of pixel.layers) {
          if (layer.depth >= minDepth && layer.depth <= maxDepth) {
            total += layer.thickness;
            hasInRange = true;
          }
        }

        const t = range > 0 ? (total - effectiveMin) / range : 0;
        const color = samplePalette(palette, t);
        dst[di] = color.r;
        dst[di + 1] = color.g;
        dst[di + 2] = color.b;
        dst[di + 3] = pixel.layers.length > 0 && !hasInRange ? 60 : 255;
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
  ]);

  const thicknessAt = React.useCallback(
    (x: number, y: number): number | 'ricochet' | null => {
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
      for (const layer of pixel.layers) {
        if (layer.depth >= minDepth && layer.depth <= maxDepth)
          total += layer.thickness;
      }

      return total;
    },
    [ricochetAngle, minDepth, maxDepth],
  );

  return {
    canvas: outputCanvas,
    detectedMax,
    detectedMaxDepth,
    detectedMin,
    downloadProgress,
    error,
    loading,
    thicknessAt,
  };
}
