import { createListCollection, Spinner } from '@chakra-ui/react';
import React from 'react';

import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '@/components/ui/select';
import { useNavStore } from '@/stores/nav';
import { useFilterStore } from '@/stores/winrate/filters';
import { trpc } from '@/utils/trpc';

import type { SelectRootProps } from '@chakra-ui/react';

export default function LoadoutFilter({
  ...props
}: Omit<SelectRootProps, 'collection'>) {
  const placeId = useNavStore((s) => s.placeId);
  const loadout = useFilterStore((s) => s.loadout);
  const setLoadout = useFilterStore((s) => s.setLoadout);
  const { isFetching, error, data } = trpc.winrate.metadata.useQuery(
    { placeId },
    { refetchOnWindowFocus: false },
  );
  const loadouts = data?.loadouts;

  const collection = React.useMemo(
    () =>
      createListCollection({
        items: loadouts ?? [],
      }),
    [loadouts],
  );

  if (isFetching || error)
    return (
      <div>
        <Spinner />
      </div>
    );

  if (loadouts && typeof loadout === 'string' && !loadouts.includes(loadout))
    setLoadout(undefined);

  return (
    <SelectRoot
      collection={collection}
      disabled={!placeId}
      size="md"
      value={loadout ? [loadout] : undefined}
      width="100%"
      onValueChange={({ value }) => setLoadout(value[0])}
      {...props}
    >
      <SelectLabel>Loadout</SelectLabel>
      <SelectTrigger clearable>
        <SelectValueText placeholder="Select loadout" />
      </SelectTrigger>
      <SelectContent>
        {loadouts?.map((item) => (
          <SelectItem key={item} item={item}>
            {item}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
}
