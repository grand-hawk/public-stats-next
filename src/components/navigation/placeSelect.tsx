import { Box, createListCollection, Spinner } from '@chakra-ui/react';
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
import { trpc } from '@/utils/trpc';

import type { SelectRootProps } from '@chakra-ui/react';

export default function PlaceSelect({
  noLabel = false,
  ...props
}: Omit<SelectRootProps, 'collection'> & { noLabel?: boolean }) {
  const placeId = useNavigationStore((s) => s.placeId);
  const setPlaceId = useNavigationStore((s) => s.setPlaceId);
  const { isFetching, error, data } = trpc.config.places.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetc  const places = createListCollection({
    items: data ? Object.entries(data) : [],
    itemToString(item) {
      return item[0];
    },
    itemToValue(item) {
      return String(item[1]);
    },
  });       },
      }),
    [data],
  );

  React.useEffect(() => {
    if (!data) return;

    if (typeof placeId === 'number' && !Object.values(data).includes(placeId))
      setPlaceId(undefined);
  }, [data, placeId, setPlaceId]);

  if (isFetching || error)
    return (
      <Box alignItems="center" display="flex" height="100%">
        <Spinner />
      </Box>
    );

  return (
    <SelectRoot
      collection={places}
      size="md"
      value={placeId !== undefined ? [String(placeId)] : []}
      width="100%"
      onValueChange={({ value }) => setPlaceId(Number(value[0]))}
      {...props}
    >
      {!noLabel && <SelectLabel>Place</SelectLabel>}
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
