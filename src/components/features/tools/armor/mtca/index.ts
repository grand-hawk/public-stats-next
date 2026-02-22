import { parseMtcaV1 } from './v1';

import type { RawArmorData } from './types';

export const SUPPORTED_MTCA_VERSIONS = [1] as const;

export type { Layer, PixelData, RawArmorData } from './types';

export function parseMtca(view: DataView): RawArmorData {
  const magic = String.fromCharCode(
    view.getUint8(0),
    view.getUint8(1),
    view.getUint8(2),
    view.getUint8(3),
  );
  if (magic !== 'MTCA') throw new Error('Invalid armour data format');

  const version = view.getUint8(4);
  if (
    !SUPPORTED_MTCA_VERSIONS.includes(
      version as (typeof SUPPORTED_MTCA_VERSIONS)[number],
    )
  ) {
    throw new Error(
      `Incompatible armour data version (file: ${version}, supported: ${SUPPORTED_MTCA_VERSIONS.join(', ')})`,
    );
  }

  switch (version) {
    case 1:
      return parseMtcaV1(view);
    default:
      throw new Error(`Unsupported armour data version: ${version}`);
  }
}
