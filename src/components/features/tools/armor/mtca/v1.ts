import { readPixels } from '@/components/features/tools/armor/mtca/pixels';

import type { LayerReader } from '@/components/features/tools/armor/mtca/pixels';
import type { RawArmorData } from '@/components/features/tools/armor/mtca/types';

const LAYER_READER: LayerReader = {
  size: 10,
  read: (view, offset) => ({
    depth: view.getFloat64(offset + 2),
    moduleIndex: 0,
    thickness: view.getUint16(offset),
  }),
};

export function parseMtcaV1(view: DataView): RawArmorData {
  const rows = view.getUint16(5);
  const cols = view.getUint16(7);

  return {
    cols,
    modules: [],
    pixels: readPixels(view, 9, rows, cols, LAYER_READER),
    rows,
    version: 1,
  };
}
