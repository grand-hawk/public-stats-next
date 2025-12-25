import React from 'react';

import { useDevelopmentStore } from '@/stores/development';

interface ContextCapturerProps {
  contextKey: string;
  data: unknown;
}

export function ContextCapturer({ contextKey, data }: ContextCapturerProps) {
  const setDebugData = useDevelopmentStore((s) => s.setDebugData);

  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    setDebugData(contextKey, data);
    return () => setDebugData(contextKey, undefined);
  }, [contextKey, data, setDebugData]);

  return null;
}
