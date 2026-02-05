import React from 'react';

import type { UseBoundStore } from 'zustand';

interface PersistMethods {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (fn: () => void) => () => void;
  };
}

export function usePersistStoreIsHydrated(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store: UseBoundStore<any> & PersistMethods,
) {
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    const unsub = store.persist.onFinishHydration(() => setHydrated(true));

    if (store.persist.hasHydrated()) setHydrated(true);

    return () => unsub();
  }, [store.persist]);

  return hydrated;
}
