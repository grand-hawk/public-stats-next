import type {
  Layer,
  PixelData,
} from '@/components/features/tools/armor/mtca/types';

export interface LayerReader {
  size: number;
  read: (view: DataView, offset: number) => Layer;
}

function decodeAngle(encoded: number): number {
  if (encoded === 0) return 0;
  return 75 + (encoded - 1) * 0.0625;
}

export function readPixels(
  view: DataView,
  start: number,
  rows: number,
  cols: number,
  layer: LayerReader,
): (PixelData | null)[] {
  const pixels: (PixelData | null)[] = new Array(rows * cols);
  let offset = start;

  for (let i = 0; i < rows * cols; i += 1) {
    const angleByte = view.getUint8(offset);
    offset += 1;
    const count = view.getUint8(offset);
    offset += 1;

    if (angleByte === 0 && count === 0) {
      pixels[i] = null;
      continue;
    }

    const layers: Layer[] = [];

    for (let j = 0; j < count; j += 1) {
      layers.push(layer.read(view, offset));
      offset += layer.size;
    }

    pixels[i] = { angle: decodeAngle(angleByte), layers };
  }

  return pixels;
}
