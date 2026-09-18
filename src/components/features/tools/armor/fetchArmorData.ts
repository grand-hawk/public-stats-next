import { parseMtca } from '@/components/features/tools/armor/mtca';

import type { RawArmorData } from '@/components/features/tools/armor/mtca';

export function maxLayerDepth(data: RawArmorData): number {
  let max = 0;
  for (const pixel of data.pixels) {
    if (!pixel) continue;
    for (const layer of pixel.layers) {
      if (layer.depth > max) max = layer.depth;
    }
  }
  return max;
}

export async function fetchArmorData(
  url: string,
  onProgress: (percent: number) => void,
): Promise<RawArmorData> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch armour data (${response.status})`);
  }

  const contentLength = response.headers.get('Content-Length');
  const total = contentLength ? parseInt(contentLength, 10) : null;
  const reader = response.body!.getReader();

  const chunks: Uint8Array[] = [];
  let receivedLength = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    chunks.push(value);
    receivedLength += value.length;

    onProgress(
      total && total > 0
        ? Math.round((receivedLength / total) * 100)
        : Math.min(95, Math.round((receivedLength / 500_000) * 90)),
    );
  }

  onProgress(100);

  const combined = new Uint8Array(receivedLength);
  let position = 0;
  for (const chunk of chunks) {
    combined.set(chunk, position);
    position += chunk.length;
  }

  return parseMtca(
    new DataView(combined.buffer, combined.byteOffset, combined.byteLength),
  );
}
