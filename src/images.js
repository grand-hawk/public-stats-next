export default function imageLoader({ quality, src, width }) {
  const prefix = process.env.NEXT_PUBLIC_MEDIA_PREFIX ?? '';
  const isAbsolute = /^https?:\/\//.test(src);
  let path;
  if (isAbsolute) {
    path = new URL(src).pathname;
  } else {
    const normalized = src.startsWith('/') ? src : `/${src}`;
    path = prefix ? new URL(`${prefix}${normalized}`).pathname : normalized;
  }
  return `${process.env.NEXT_PUBLIC_IMAGE_LOADER}${path}?w=${width}&q=${quality ?? 75}`;
}
