import { closeSync, existsSync, openSync, readSync } from 'node:fs';
import path from 'node:path';

import { createContentCollection } from '@/server/utils/contentCollection';

export interface PlaceableMeta {
  imageAlt?: string;
  imageCaption?: string;
}

export interface PlaceableImage {
  alt: string;
  caption?: string;
  height: number;
  path: string;
  turntable?: string;
  width: number;
}

export const PLACEABLE_IMAGES_DIR = 'public/assets/placeables';

const PNG_HEADER_BYTES = 24;
const PNG_WIDTH_OFFSET = 16;
const PNG_HEIGHT_OFFSET = 20;

const placeableCollection = createContentCollection<PlaceableMeta>({
  dir: 'content/placeables',
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

export function getPlaceableContent(placeableSlug: string, name: string) {
  const entry = placeableCollection.get(placeableSlug);
  const description = entry ? stripTitle(entry.body) : '';

  const file = path.join(PLACEABLE_IMAGES_DIR, `${placeableSlug}.png`);
  const size = existsSync(file) ? readPngSize(file) : null;
  const turntable = path.join(PLACEABLE_IMAGES_DIR, `${placeableSlug}.webm`);

  const image: PlaceableImage | undefined = size
    ? {
        ...size,
        alt: entry?.meta.imageAlt ?? name,
        caption: entry?.meta.imageCaption,
        path: `/assets/placeables/${placeableSlug}.png`,
        turntable: existsSync(turntable)
          ? `/assets/placeables/${placeableSlug}.webm`
          : undefined,
      }
    : undefined;

  return { description: description || undefined, image };
}
