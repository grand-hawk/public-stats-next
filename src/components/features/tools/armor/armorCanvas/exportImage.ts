import { fillRicochetStripes } from '@/components/features/tools/armor/armorCanvas/ricochetPattern';
import { samplePalette } from '@/components/features/tools/armor/palettes';

import type { Palette } from '@/components/features/tools/armor/palettes';
import type { ArmorAngle } from '@/utils/getVehicleImage';

const PAD = 8;
const TITLE_HEIGHT = 20;
const LEGEND_BAR_HEIGHT = 12;
const LEGEND_LABELS_HEIGHT = 14;
const DISCLAIMER_HEIGHT = 20;

interface ExportImageOptions {
  angle: ArmorAngle;
  canvas: HTMLCanvasElement;
  maxMm: number;
  minMm: number;
  minimap: HTMLCanvasElement | null;
  palette: Palette;
  ricochetAngle: number;
  slug: string | null;
}

export function exportArmorImage({
  angle,
  canvas,
  maxMm,
  minMm,
  minimap,
  palette,
  ricochetAngle,
  slug,
}: ExportImageOptions) {
  const textHeaderHeight =
    TITLE_HEIGHT + 4 + LEGEND_BAR_HEIGHT + LEGEND_LABELS_HEIGHT;
  const hasMinimap = !!minimap && minimap.width > 0 && minimap.height > 0;
  const headerHeight =
    PAD + Math.max(textHeaderHeight, hasMinimap ? minimap.height : 0) + PAD;
  const totalWidth = canvas.width;
  const totalHeight = headerHeight + canvas.height + DISCLAIMER_HEIGHT;

  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = totalWidth;
  exportCanvas.height = totalHeight;
  const ctx = exportCanvas.getContext('2d')!;

  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, totalWidth, totalHeight);

  if (hasMinimap) ctx.drawImage(minimap, totalWidth - minimap.width - PAD, PAD);

  let y = PAD;
  ctx.fillStyle = '#ccc';
  ctx.font = 'bold 14px monospace';
  ctx.fillText('KE effective thickness at LOS', PAD, y + 14);
  y += TITLE_HEIGHT + 4;

  const legendBarWidth = Math.min(totalWidth - 120 - PAD * 2, 300);
  for (let x = 0; x < legendBarWidth; x += 1) {
    const c = samplePalette(palette, x / (legendBarWidth - 1));
    ctx.fillStyle = `rgb(${c.r},${c.g},${c.b})`;
    ctx.fillRect(PAD + x, y, 1, LEGEND_BAR_HEIGHT);
  }

  if (ricochetAngle !== 90) {
    const swatchX = PAD + legendBarWidth + 10;
    fillRicochetStripes(ctx, swatchX, y, 10, LEGEND_BAR_HEIGHT);

    ctx.fillStyle = '#aaa';
    ctx.font = '10px monospace';
    ctx.fillText(
      `Ricochet (≥${ricochetAngle}°)`,
      swatchX + 14,
      y + LEGEND_BAR_HEIGHT - 1,
    );
  }

  y += LEGEND_BAR_HEIGHT;
  ctx.fillStyle = '#aaa';
  ctx.font = '10px monospace';
  ctx.fillText(`${minMm}`, PAD, y + 11);
  const maxLabel = `${maxMm}`;
  ctx.fillText(
    maxLabel,
    PAD + legendBarWidth - ctx.measureText(maxLabel).width,
    y + 11,
  );

  ctx.drawImage(canvas, 0, headerHeight);

  ctx.fillStyle = '#666';
  ctx.font = '9px monospace';
  ctx.fillText('Estimated data — not for bug reports', PAD, totalHeight - 6);

  const link = document.createElement('a');
  link.download = slug
    ? `armor-${slug}-${angle}.png`
    : 'armor-visualization.png';
  link.href = exportCanvas.toDataURL('image/png');
  link.click();
}
