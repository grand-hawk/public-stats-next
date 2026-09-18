import React from 'react';

import { usePersistStoreIsHydrated } from '@/hooks/usePersistStoreIsHydrated';
import { useArmorStore } from '@/stores/armor';

export function useArmorTour() {
  const { setTourSeen, tourSeen } = useArmorStore();
  const hydrated = usePersistStoreIsHydrated(useArmorStore);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (hydrated && !tourSeen) setOpen(true);
  }, [hydrated, tourSeen]);

  const onOpenChange = React.useCallback(
    (next: boolean) => {
      setOpen(next);
      if (!next) setTourSeen(true);
    },
    [setTourSeen],
  );

  const openTour = React.useCallback(() => {
    setOpen(true);
  }, []);

  return { onOpenChange, open, openTour };
}
