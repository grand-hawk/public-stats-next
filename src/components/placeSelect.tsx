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
import { useSessionStore } from '@/stores/session';
import { trpc } from '@/utils/trpc';

import type { SelectRootProps } from '@chakra-ui/react';

export default function PlaceSelect({
  ...props
}: Omit<SelectRootProps, 'collection'>) {
  const placeId = useSessionStore((s) => s.placeId);
  const setPlaceId = useSessionStore((s) => s.setPlaceId);
  const { isFetching, error, data } = trpc.data.places.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const places = React.useMemo(
    () =>
      createListCollection({
        items: data ? Object.entries(data) : [],
        itemToString(item) {
          return item[0];
        },
        itemToValue(item) {
          return String(item[1]);
        },
      }),
    [data],
  );

  if (isFetching || error) return <Spinner />;

  return (
    <SelectRoot
      collection={places}
      size="md"
      value={placeId !== undefined ? [String(placeId)] : undefined}
      width="100%"
      onValueChange={({ value }) => setPlaceId(Number(value[0]))}
      {...props}
    >
      <SelectLabel>Place</SelectLabel>
      <SelectTrigger>
        <SelectValueText placeholder="Select place" />
      </SelectTrigger>
      <SelectContent>
        {places.items.map((item) => (
          <SelectItem key={item[1]} item={item}>
            {item[0]}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
}
