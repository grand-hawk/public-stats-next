import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { createCanvas, ImageData } from '@napi-rs/canvas';
import pAll from 'p-all';
import sharp from 'sharp';
import slug from 'slug';

import {
  ARMOR_CDN_BASE,
  DEFAULT_ARMOR_ANGLE,
  DEFAULT_RICOCHET_ANGLE,
} from '@/components/features/tools/armor/constants';
import { groupModules } from '@/components/features/tools/armor/moduleGroups';
import { parseMtca } from '@/components/features/tools/armor/mtca';
import {
  palettes,
  samplePalette,
} from '@/components/features/tools/armor/palettes';
import {
  computeDetectedRange,
  RICOCHET_DARK,
  RICOCHET_LIGHT,
  renderHeatmapToImageData,
} from '@/components/features/tools/armor/renderArmorHeatmap';
import { getVehicleMeta } from '@/server/utils/vehicleContent';
import { getNameFromInitials, getPlaceFromName } from '@/utils/placeUtils';
import { getConfig } from '@generated/config';
import { getVehicles } from '@generated/vehicles';

function extractVehicleSlugs(): string[] {
  const { data: config } = getConfig();
  const rvName = getNameFromInitials(config, 'rv');
  if (!rvName) return [];
  const rvPlace = getPlaceFromName(config, rvName);

  const vehicles = getVehicles();
  const slugs = new Set<string>();
  const placeVehicles = vehicles.data?.[rvPlace.placeId]?.data;
  const entries = placeVehicles
    ? Object.values(placeVehicles).filter((v) => !v?.info.unlisted)
    : [];
  for (const vehicle of entries) {
    const slug = vehicle?.info?.slug;
    if (typeof slug === 'string' && slug.length > 0) {
      slugs.add(slug);
    }
  }

  return [...slugs].sort((a, b) => a.localeCompare(b));
}

function getContentSlug(vehicleSlug: string): string | null {
  const vehicles = getVehicles();
  for (const place of Object.values(vehicles.data)) {
    const vehicleName = place.metadata.slugs[vehicleSlug];
    if (vehicleName) {
      const vehicle = place.data[vehicleName];
      return vehicle ? slug(vehicle.info.gameId) : null;
    }
  }
  return null;
}

async function fetchArmorMtca(vehicleSlug: string): Promise<ArrayBuffer> {
  const url = `${ARMOR_CDN_BASE}/${vehicleSlug}/${DEFAULT_ARMOR_ANGLE}_armor.mtca`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch armour data: ${res.status} ${url}`);
  }
  return res.arrayBuffer();
}

function getDetectedMaxDepth(rawData: Awaited<ReturnType<typeof parseMtca>>) {
  let maxD = 0;
  for (const pixel of rawData.pixels) {
    if (!pixel) continue;
    for (const layer of pixel.layers) {
      if (layer.depth > maxD) maxD = layer.depth;
    }
  }
  return Math.ceil(maxD);
}

async function renderArmorCanvas(vehicleSlug: string) {
  const buffer = await fetchArmorMtca(vehicleSlug);
  const rawData = parseMtca(new DataView(buffer));

  const minDepth = 0;
  const detectedMaxDepth = getDetectedMaxDepth(rawData);
  const contentSlug = getContentSlug(vehicleSlug) ?? vehicleSlug;
  const frontArmorDepth = getVehicleMeta(contentSlug)?.frontArmorDepth;
  const frontFraction = frontArmorDepth != null ? frontArmorDepth / 100 : 0.5;
  const maxDepth = detectedMaxDepth * frontFraction;

  const { max: detectedMax, min: detectedMin } = computeDetectedRange(
    rawData,
    DEFAULT_RICOCHET_ANGLE,
    minDepth,
    maxDepth,
  );
  const palette = palettes[0];

  const heatmap = renderHeatmapToImageData(rawData, {
    minMm: detectedMin,
    maxMm: detectedMax,
    palette,
    ricochetAngle: DEFAULT_RICOCHET_ANGLE,
    minDepth,
    maxDepth,
    hiddenModules: new Set(
      groupModules(rawData.modules)
        .filter((g) => g.initiallyHidden)
        .flatMap((g) => g.indices),
    ),
  });

  const pad = 8;
  const headerBottomPad = 16;
  const titleHeight = 20;
  const legendBarHeight = 12;
  const legendLabelsHeight = 14;
  const textHeaderHeight =
    titleHeight + 4 + legendBarHeight + legendLabelsHeight;
  const headerContentHeight = pad + textHeaderHeight + pad;
  const headerHeight = headerContentHeight + headerBottomPad;
  const totalWidth = heatmap.width;
  const totalHeight = headerHeight + heatmap.height;

  const canvas = createCanvas(totalWidth, totalHeight);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, totalWidth, headerContentHeight);

  let y = pad;
  ctx.fillStyle = '#ccc';
  ctx.font = 'bold 14px monospace';
  ctx.fillText('KE effective thickness at LOS', pad, y + 14);
  y += titleHeight + 4;

  const legendBarWidth = Math.min(totalWidth - 120 - pad * 2, 300);
  for (let x = 0; x < legendBarWidth; x += 1) {
    const t = x / (legendBarWidth - 1);
    const c = samplePalette(palette, t);
    ctx.fillStyle = `rgb(${c.r},${c.g},${c.b})`;
    ctx.fillRect(pad + x, y, 1, legendBarHeight);
  }

  const swatchX = pad + legendBarWidth + 10;
  for (let sy = 0; sy < legendBarHeight; sy += 1) {
    for (let sx = 0; sx < 10; sx += 1) {
      const stripe = (sx + sy) % 6 < 2;
      const c = stripe ? RICOCHET_LIGHT : RICOCHET_DARK;
      ctx.fillStyle = `rgb(${c.r},${c.g},${c.b})`;
      ctx.fillRect(swatchX + sx, y + sy, 1, 1);
    }
  }
  ctx.fillStyle = '#aaa';
  ctx.font = '10px monospace';
  ctx.fillText(
    `Ricochet (≥${DEFAULT_RICOCHET_ANGLE}°)`,
    swatchX + 14,
    y + legendBarHeight - 1,
  );

  y += legendBarHeight;
  ctx.fillStyle = '#aaa';
  ctx.font = '10px monospace';
  ctx.fillText(`${Math.round(detectedMin)}`, pad, y + 11);
  const maxLabel = `${Math.round(detectedMax)}`;
  ctx.fillText(
    maxLabel,
    pad + legendBarWidth - ctx.measureText(maxLabel).width,
    y + 11,
  );

  const heatmapImageData = new ImageData(
    heatmap.data,
    heatmap.width,
    heatmap.height,
  );
  ctx.putImageData(heatmapImageData, 0, headerHeight);

  return canvas;
}

async function writeThumbnail(vehicleSlug: string) {
  const canvas = await renderArmorCanvas(vehicleSlug);
  const pngBuffer = canvas.encodeSync('png');
  const optimized = await sharp(pngBuffer)
    .png({ compressionLevel: 9 })
    .toBuffer();
  const outputDir = path.join('armor-output', vehicleSlug);
  await mkdir(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, 'armor_thumbnail.png');
  await writeFile(outputPath, optimized);
}

await pAll(
  extractVehicleSlugs().map((vehicleSlug) => async () => {
    try {
      await writeThumbnail(vehicleSlug);
      console.log(`✓ ${vehicleSlug}`);
    } catch (err) {
      console.error(`✗ ${vehicleSlug}`);
      console.error(err);
    }
  }),
  { concurrency: 25 },
);
