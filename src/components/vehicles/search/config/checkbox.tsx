import { Checkbox } from '@chakra-ui/react';
import React from 'react';
import { MdOutlineCheck } from 'react-icons/md';

import { Skeleton } from '@/components/ui/skeleton';
import { usePersistStoreIsHydrated } from '@/hooks/usePersistStoreIsHydrated';
import { useVehicleSearchStore } from '@/stores/vehicles/search';

import type { VehicleSearchStore } from '@/stores/vehicles/search';

export default function VehicleSearchConfigCheckbox({
  label,
  setValueKey,
  valueKey,
}: {
  label: string;
  valueKey: keyof VehicleSearchStore;
  setValueKey: keyof VehicleSearchStore;
}) {
  const isHydrated = usePersistStoreIsHydrated(useVehicleSearchStore);
  const value = useVehicleSearchStore((s) => s[valueKey]) as boolean;
  const setValue = useVehicleSearchStore((s) => s[setValueKey]) as (
    value: boolean,
  ) => void;

  return (
    <Checkbox.Root
      checked={value}
      onCheckedChange={(details) => setValue(!!details.checked)}
    >
      <Checkbox.HiddenInput />
      {isHydrated ? (
        <Checkbox.Control borderRadius="none">
          {value && <MdOutlineCheck />}
        </Checkbox.Control>
      ) : (
        <Skeleton borderRadius="none" height={5} width={5} />
      )}
      <Checkbox.Label>{label}</Checkbox.Label>
    </Checkbox.Root>
  );
}
