import type { DamageModule, Layer, PixelData, RawArmorData } from './types';

function decodeAngle(encoded: number): number {
  if (encoded === 0) return 0;
  return 75 + (encoded - 1) * 0.0625;
}

export function parseMtcaV2(view: DataView): RawArmorData {
  const rows = view.getUint16(5);
  const cols = view.getUint16(7);
  const moduleCount = view.getUint8(9);

  let offset = 10;
  const modules: DamageModule[] = [];
  const decoder = new TextDecoder();

  for (let m = 0; m < moduleCount; m += 1) {
    const nameLength = view.getUint8(offset);
    offset += 1;

    const nameBytes = new Uint8Array(
      view.buffer,
      view.byteOffset + offset,
      nameLength,
    );
    const name = decoder.decode(nameBytes);
    offset += nameLength;

    const maxHealth = view.getUint16(offset);
    offset += 2;

    modules.push({ maxHealth, name });
  }

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
      const moduleIndex = view.getUint8(offset);
      offset += 1;
      const thickness = view.getUint16(offset);
      offset += 2;
      const depth = view.getFloat64(offset);
      offset += 8;
      layers.push({ depth, moduleIndex, thickness });
    }

    pixels[i] = { angle, layers };
  }

  return { cols, modules, pixels, rows, version: 2 };
}
