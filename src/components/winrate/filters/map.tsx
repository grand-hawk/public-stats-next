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
import { useNavigationStore } from '@/stores/navigation';
import { useFilterStore } from '@/stores/winrate/filters';
import { trpc } from '@/utils/trpc';

import type { SelectRootProps } from '@chakra-ui/react';

export default function MapFilter({
  ...props
}: Omit<SelectRootProps, 'collection'>) {
  const placeId = useNavigationStore((s) => s.placeId);
  const map = useFilterStore((s) => s.map);
  const setMap = useFilterStore((s) => s.setMap);
  const { isFetching, error, data } = trpc.winrate.metadata.useQuery(
    { placeId },
    { refetchOnWindowFocus: false },
  );
  const maps = data?.maps;

  const collection = React.useMemo(
    () =>
      createListCollection({
        items: maps ?? [],
      }),
    [maps],
  );

  if (isFetching || error)
    return (
      <div>
        <Spinner />
      </div>
    );

  if (maps && typeof map === 'string' && !maps.includes(map)) setMap(undefined);

  return (
    <SelectRoot
      collection={collection}
      disabled={!placeId}
      size="md"
      value={map ? [map] : undefined}
      width="100%"
      onValueChange={({ value }) => setMap(value[0])}
      {...props}
    >
      <SelectLabel>Map</SelectLabel>
      <SelectTrigger clearable>
        <SelectValueText placeholder="Select map" />
      </SelectTrigger>
      <SelectContent>
        {maps?.map((item) => (
          <SelectItem key={item} item={item}>
            {item}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
}
