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

export default function PlaceSelect() {
  const setPlaceId = useSessionStore((s) => s.setPlaceId);
  const { isLoading, data } = trpc.data.places.useQuery();

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

  if (isLoading) return <Spinner />;

  return (
    <SelectRoot
      collection={places}
      size="md"
      width="50%"
      onValueChange={({ value }) => setPlaceId(Number(value[0]))}
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
