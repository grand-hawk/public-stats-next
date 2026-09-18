import React from 'react';

import { ARMOR_CDN_BASE } from '@/components/features/tools/armor/constants';
import {
  fetchArmorData,
  maxLayerDepth,
} from '@/components/features/tools/armor/fetchArmorData';
import { pixelThickness } from '@/components/features/tools/armor/pixelThickness';
import {
  computeDetectedRange,
  renderHeatmapToImageData,
} from '@/components/features/tools/armor/renderArmorHeatmap';

import type {
  DamageModule,
  RawArmorData,
} from '@/components/features/tools/armor/mtca';
import type { Palette } from '@/components/features/tools/armor/palettes';
import type { PixelTooltipData } from '@/components/features/tools/armor/pixelThickness';
import type { ArmorAngle } from '@/utils/getVehicleImage';

export type { PixelTooltipData };

interface ArmorProcessorOptions {
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

interface ArmorProcessorResult {
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

export function useArmorProcessor({
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
}: ArmorProcessorOptions): ArmorProcessorResult {
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
    const accept = (data: RawArmorData) => {
      rawDataRef.current = data;
      setRawData(data);
      setDetectedMaxDepth(Math.ceil(maxLayerDepth(data)));
      setLoading(false);
      setDownloadProgress(null);
    };

    if (overrideData) {
      accept(overrideData);
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

    fetchArmorData(
      `${ARMOR_CDN_BASE}/${slug}/${angle}_armor.mtca`,
      (percent) => {
        if (!cancelled) setDownloadProgress(percent);
      },
    )
      .then((data) => {
        if (!cancelled) accept(data);
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

    const { data, height, width } = renderHeatmapToImageData(rawData, {
      minMm: autoRange ? detectedMin : minMm,
      maxMm: autoRange ? detectedMax : maxMm,
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
    (x: number, y: number) => {
      const raw = rawDataRef.current;
      if (!raw) return null;
      return pixelThickness(raw, x, y, {
        hiddenModules,
        maxDepth,
        minDepth,
        ricochetAngle,
      });
    },
    [ricochetAngle, minDepth, maxDepth, hiddenModules],
  );

  const usedModuleIndices = React.useMemo(() => {
    const used = new Set<number>();
    if (!rawData) return used;
    for (const pixel of rawData.pixels) {
      if (!pixel) continue;
      for (const layer of pixel.layers) {
        if (layer.moduleIndex > 0) used.add(layer.moduleIndex);
      }
    }
    return used;
  }, [rawData]);

  return {
    canvas: outputCanvas,
    detectedMax,
    detectedMaxDepth,
    detectedMin,
    downloadProgress,
    error,
    loading,
    modules: rawData?.modules ?? [],
    thicknessAt,
    usedModuleIndices,
    version: rawData?.version ?? null,
  };
}
