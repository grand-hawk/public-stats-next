import { env } from '@/env';

export default function imageLoader({ quality, src, width }) {
  const path = new URL(src).pathname;
  return `${env.NEXT_PUBLIC_IMAGE_LOADER}${path}?w=${width}&q=${quality ?? 75}`;
}
