import { parseMtcaV1 } from './v1';
import { parseMtcaV2 } from './v2';

import type { RawArmorData } from './types';

export type { DamageModule, Layer, PixelData, RawArmorData } from './types';

export function parseMtca(view: DataView): RawArmorData {
  const magic = String.fromCharCode(
    view.getUint8(0),
    view.getUint8(1),
    view.getUint8(2),
    view.getUint8(3),
  );
  if (magic !== 'MTCA') throw new Error('Invalid armour data format');

  const version = view.getUint8(4);

  switch (version) {
    case 1:
      return parseMtcaV1(view);
    case 2:
      return parseMtcaV2(view);
    default:
      throw new Error(`Unsupported armour data version: ${version}`);
  }
}
