import React from 'react';

import { useDebugEnabled } from '@/hooks/useDebugEnv';
import { useDevelopmentStore } from '@/stores/development';

interface ContextCapturerProps {
  contextKey: string;
  data: unknown;
}

export function ContextCapturer({ contextKey, data }: ContextCapturerProps) {
  const debugEnabled = useDebugEnabled();
  const setDebugData = useDevelopmentStore((s) => s.setDebugData);

  React.useEffect(() => {
    if (!debugEnabled) return;

    setDebugData(contextKey, data);
    return () => setDebugData(contextKey, undefined);
  }, [contextKey, data, debugEnabled, setDebugData]);

  return null;
}
