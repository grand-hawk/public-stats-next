import React from 'react';

import { getVehicleImage } from '@/utils/getVehicleImage';

import { RICOCHET_COLOR, samplePalette } from './palettes';

import type { Palette } from './palettes';
import type { ArmorAngle } from '@/utils/getVehicleImage';

export interface ArmorProcessorOptions {
  angle: ArmorAngle;
  autoRange: boolean;
  maxMm: number;
  minMm: number;
  palette: Palette;
  slug: string | null;
}

export interface ArmorProcessorResult {
  canvas: HTMLCanvasElement | null;
  detectedMax: number;
  detectedMin: number;
  error: string | null;
  loading: boolean;
  thicknessAt: (x: number, y: number) => number | 'ricochet' | null;
}

interface RawImageData {
  data: Uint8ClampedArray;
  height: number;
  width: number;
}

export function useArmorProcessor(
  options: ArmorProcessorOptions,
): ArmorProcessorResult {
  const { angle, autoRange, maxMm, minMm, palette, slug } = options;

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [rawData, setRawData] = React.useState<RawImageData | null>(null);
  const [detectedMin, setDetectedMin] = React.useState(0);
  const [detectedMax, setDetectedMax] = React.useState(1000);
  const [outputCanvas, setOutputCanvas] =
    React.useState<HTMLCanvasElement | null>(null);

  const rawDataRef = React.useRef<RawImageData | null>(null);

  React.useEffect(() => {
    if (!slug) {
      setRawData(null);
      rawDataRef.current = null;
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = getVehicleImage(slug, `${angle}_armor`, false);

    img.onload = () => {
      if (cancelled) return;

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);

      let min = Infinity;
      let max = -Infinity;
      const d = imageData.data;
      for (let i = 0; i < d.length; i += 4) {
        const a = d[i + 3];
        if (a === 0) continue;

        const r = d[i];
        const g = d[i + 1];
        if (r === 255 && g === 255) continue;

        const thickness = r * 256 + g;
        if (thickness < min) min = thickness;
        if (thickness > max) max = thickness;
      }

      if (min === Infinity) {
        min = 0;
        max = 1000;
      }

      const raw: RawImageData = {
        data: imageData.data,
        height: img.height,
        width: img.width,
      };

      rawDataRef.current = raw;
      setRawData(raw);
      setDetectedMin(min);
      setDetectedMax(max);
      setLoading(false);
    };

    img.onerror = () => {
      if (cancelled) return;
      setError('Failed to load armor image');
      setLoading(false);
    };

    return () => {
      cancelled = true;
    };
  }, [slug, angle]);

  React.useEffect(() => {
    if (!rawData) {
      setOutputCanvas(null);
      return;
    }

    const effectiveMin = autoRange ? detectedMin : minMm;
    const effectiveMax = autoRange ? detectedMax : maxMm;
    const range = effectiveMax - effectiveMin;

    const canvas = document.createElement('canvas');
    canvas.width = rawData.width;
    canvas.height = rawData.height;
    const ctx = canvas.getContext('2d')!;
    const output = ctx.createImageData(rawData.width, rawData.height);
    const src = rawData.data;
    const dst = output.data;

    for (let i = 0; i < src.length; i += 4) {
      const a = src[i + 3];
      if (a === 0) {
        dst[i] = 0;
        dst[i + 1] = 0;
        dst[i + 2] = 0;
        dst[i + 3] = 0;
        continue;
      }

      const r = src[i];
      const g = src[i + 1];

      if (r === 255 && g === 255) {
        dst[i] = RICOCHET_COLOR.r;
        dst[i + 1] = RICOCHET_COLOR.g;
        dst[i + 2] = RICOCHET_COLOR.b;
        dst[i + 3] = 255;
        continue;
      }

      const thickness = r * 256 + g;
      const t = range > 0 ? (thickness - effectiveMin) / range : 0;
      const color = samplePalette(palette, t);
      dst[i] = color.r;
      dst[i + 1] = color.g;
      dst[i + 2] = color.b;
      dst[i + 3] = 255;
    }

    ctx.putImageData(output, 0, 0);
    setOutputCanvas(canvas);
  }, [rawData, minMm, maxMm, palette, autoRange, detectedMin, detectedMax]);

  const thicknessAt = React.useCallback(
    (x: number, y: number): number | 'ricochet' | null => {
      const raw = rawDataRef.current;
      if (!raw) return null;

      const px = Math.floor(x);
      const py = Math.floor(y);
      if (px < 0 || py < 0 || px >= raw.width || py >= raw.height) return null;

      const i = (py * raw.width + px) * 4;
      const a = raw.data[i + 3];
      if (a === 0) return null;

      const r = raw.data[i];
      const g = raw.data[i + 1];
      if (r === 255 && g === 255) return 'ricochet';

      return r * 256 + g;
    },
    [],
  );

  return {
    canvas: outputCanvas,
    detectedMax,
    detectedMin,
    error,
    loading,
    thicknessAt,
  };
}
