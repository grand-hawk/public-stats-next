import { closeSync, existsSync, openSync, readSync } from 'node:fs';
import path from 'node:path';

import { createContentCollection } from '@/server/utils/contentCollection';

export interface WeaponMeta {
  imageAlt?: string;
  imageCaption?: string;
}

export interface WeaponImage {
  alt: string;
  caption?: string;
  height: number;
  path: string;
  width: number;
}

export const WEAPON_IMAGES_DIR = 'public/assets/weapons';

const PNG_HEADER_BYTES = 24;
const PNG_WIDTH_OFFSET = 16;
const PNG_HEIGHT_OFFSET = 20;

const weaponCollection = createContentCollection<WeaponMeta>({
  dir: 'content/weapons',
  parseMeta: (raw) => ({
    imageAlt: typeof raw.imageAlt === 'string' ? raw.imageAlt : undefined,
    imageCaption:
      typeof raw.imageCaption === 'string' ? raw.imageCaption : undefined,
  }),
});

function stripTitle(body: string) {
  return body.replace(/^# [^\n]*\n*/, '').trim();
}

function readPngSize(file: string) {
  const header = Buffer.alloc(PNG_HEADER_BYTES);
  const descriptor = openSync(file, 'r');

  try {
    if (
      readSync(descriptor, header, 0, PNG_HEADER_BYTES, 0) < PNG_HEADER_BYTES
    ) {
      return null;
    }
  } finally {
    closeSync(descriptor);
  }

  return {
    height: header.readUInt32BE(PNG_HEIGHT_OFFSET),
    width: header.readUInt32BE(PNG_WIDTH_OFFSET),
  };
}

export function getWeaponContent(weaponSlug: string, name: string) {
  const entry = weaponCollection.get(weaponSlug);
  const description = entry ? stripTitle(entry.body) : '';

  const file = path.join(WEAPON_IMAGES_DIR, `${weaponSlug}.png`);
  const size = existsSync(file) ? readPngSize(file) : null;

  const image: WeaponImage | undefined = size
    ? {
        ...size,
        alt: entry?.meta.imageAlt ?? name,
        caption: entry?.meta.imageCaption,
        path: `/assets/weapons/${weaponSlug}.png`,
      }
    : undefined;

  return { description: description || undefined, image };
}
