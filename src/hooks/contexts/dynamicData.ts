import React from 'react';

import type { assembleModules } from '@/utils/alterations';

export interface DynamicDataContext {
  assembledModules: ReturnType<typeof assembleModules>;
  enabledAlterations: Record<string, boolean>;
}

export const DynamicDataContext = React.createContext<DynamicDataContext>(
  {} as DynamicDataContext,
);

export function useDynamicData() {
  return React.useContext(DynamicDataContext);
}
