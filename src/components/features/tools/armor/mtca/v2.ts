import { readPixels } from '@/components/features/tools/armor/mtca/pixels';

import type { LayerReader } from '@/components/features/tools/armor/mtca/pixels';
import type {
  DamageModule,
  RawArmorData,
} from '@/components/features/tools/armor/mtca/types';

const LAYER_READER: LayerReader = {
  size: 11,
  read: (view, offset) => ({
    depth: view.getFloat64(offset + 3),
    moduleIndex: view.getUint8(offset),
    thickness: view.getUint16(offset + 1),
  }),
};

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

  return {
    cols,
    modules,
    pixels: readPixels(view, offset, rows, cols, LAYER_READER),
    rows,
    version: 2,
  };
}
