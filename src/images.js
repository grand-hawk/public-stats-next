export default function imageLoader({ quality, src, width }) {
  const path = new URL(src).pathname;
  return `${process.env.NEXT_PUBLIC_IMAGE_LOADER}${path}?w=${width}&q=${quality ?? 75}`;
}
