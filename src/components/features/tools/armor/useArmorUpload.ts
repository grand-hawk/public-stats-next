import React from 'react';

import { parseMtca } from '@/components/features/tools/armor/mtca';

import type { RawArmorData } from '@/components/features/tools/armor/mtca';

export function useArmorUpload(onLoaded: () => void) {
  const [data, setData] = React.useState<RawArmorData | null>(null);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const clear = React.useCallback(() => {
    setData(null);
    setFileName(null);
    setError(null);
  }, []);

  const upload = React.useCallback(
    async (file: File) => {
      try {
        const view = new DataView(await file.arrayBuffer());
        setData(parseMtca(view));
        setFileName(file.name);
        setError(null);
        onLoaded();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse file');
        setData(null);
        setFileName(null);
      }
    },
    [onLoaded],
  );

  return { clear, data, error, fileName, upload };
}
