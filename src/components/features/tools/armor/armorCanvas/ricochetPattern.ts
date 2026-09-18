import {
  RICOCHET_DARK,
  RICOCHET_LIGHT,
} from '@/components/features/tools/armor/renderArmorHeatmap';

export function fillRicochetStripes(
  ctx: CanvasRenderingContext2D,
  originX: number,
  originY: number,
  width: number,
  height: number,
) {
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const c = (x + y) % 6 < 2 ? RICOCHET_LIGHT : RICOCHET_DARK;
      ctx.fillStyle = `rgb(${c.r},${c.g},${c.b})`;
      ctx.fillRect(originX + x, originY + y, 1, 1);
    }
  }
}
