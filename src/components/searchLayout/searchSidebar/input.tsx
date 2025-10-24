import { Group, IconButton, Input, Presence } from '@chakra-ui/react';
import React from 'react';
import { MdExpandLess } from 'react-icons/md';
import { MdOutlineExpandMore } from 'react-icons/md';

import { useRouterQuery } from '@/hooks/useRouterQuery';
import { usePersistStoreIsHydrated } from '@/hooks/usePersistStoreIsHydrated';
import { useSidebarStore } from '@/stores/sidebar';ebar';

import type { InputProps } from '@chakra-ui/react';

export const SEARCH_INPUT_HEIGHT = '48pxexport default function SearchInput({
  noButton,
  onChange,
  queryKey,
  value,
}: {
  value: InputProps['value'];
  onChange: InputProps['onChange'];
  queryKey: string;
  noButton?: boolean;
}) {
  const queryValue = useRouterQuery(queryKey);
  const isOpen = useSidebarStore((s) => s.open);
  const setOpen = useSidebarStore((s) => s.setOpen);
  const isHydrated = usePersistStoreIsHydrated(useSidebarStore);

  React.useEffect(() => {
    // Only close sidebar if we have a query value (meaning we're on a specific item page)
    // and the store has been hydrated (to avoid interfering with persisted state)
    if (isHydrated && queryValue && isOpen) {
      setOpen(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryValue, isHydrated]);deps
  }, [queryValue]);

  return (
    <Group gap={0} height={SEARCH_INPUT_HEIGHT} width="100%">
      <Input
        borderRadius="none"
        height="100%"
        placeholder="Search..."
        value={value}
        variant="subtle"
        onChange={onChange}
        onSelect={() => {
          if (!isOpen) setOpen(true);
        }}
      />

      <Presence present={!noButton}>
        <IconButton
          aria-label={isOpen ? 'Collapse search' : 'Expand search'}
          borderRadius="none"
          height={SEARCH_INPUT_HEIGHT}
          hideFrom="md"
          variant="subtle"
          width={SEARCH_INPUT_HEIGHT}
          onClick={() => setOpen(!isOpen)}
        >
          {isOpen ? <MdOutlineExpandMore /> : <MdExpandLess />}
        </IconButton>
      </Presence>
    </Group>
  );
}
