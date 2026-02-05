export function getExtension(path: string) {
  const metadataIndex = path.search(/[?#]/);
  const basePath = metadataIndex !== -1 ? path.slice(0, metadataIndex) : path;

  const lastDot = basePath.lastIndexOf('.');
  const lastSlash = Math.max(
    basePath.lastIndexOf('/'),
    basePath.lastIndexOf('\\'),
  );

  return lastDot > lastSlash ? basePath.slice(lastDot) : '';
}

export function setExtension(path: string, ext: string) {
  const normalizedExt = ext.startsWith('.') ? ext : `.${ext}`;

  const metadataIndex = path.search(/[?#]/);
  const hasMetadata = metadataIndex !== -1;

  const basePath = hasMetadata ? path.slice(0, metadataIndex) : path;
  const metadata = hasMetadata ? path.slice(metadataIndex) : '';

  const lastDot = basePath.lastIndexOf('.');
  const lastSlash = Math.max(
    basePath.lastIndexOf('/'),
    basePath.lastIndexOf('\\'),
  );

  const newPath =
    lastDot > lastSlash
      ? basePath.substring(0, lastDot) + normalizedExt
      : basePath + normalizedExt;

  return newPath + metadata;
}
