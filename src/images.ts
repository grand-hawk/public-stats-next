import { env } from '@/env';

import type { ImageLoaderProps } from 'next/image';

export default function imageLoader({ quality, src, width }: ImageLoaderProps) {
  const path = new URL(src).pathname;
  return `${env.NEXT_PUBLIC_IMAGE_LOADER!}${path}?w=${width}${quality !== undefined ? `&q=${quality}` : ''}`;
}
