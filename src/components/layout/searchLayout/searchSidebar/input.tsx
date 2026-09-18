import { Flex, IconButton, Presence } from '@chakra-ui/react';
import React from 'react';
import { MdExpandLess } from 'react-icons/md';
import { MdOutlineExpandMore } from 'react-icons/md';

import SearchField, { SEARCH_FIELD_HEIGHT } from '@/components/ui/searchField';
import { QUIET_INTERACTIVE_CSS } from '@/components/ui/styles';
import { useRouterQuery } from '@/hooks/useRouterQuery';
import { useSidebarStore } from '@/stores/sidebar';

export const SEARCH_BAR_HEIGHT = '56px';

export default function SearchInput({
  noButton,
  onChange,
  placeholder = 'Filter results',
  queryKey,
  value,
}: {
  value: string;
  onChange: (value: string) => void;
  queryKey: string;
  noButton?: boolean;
  placeholder?: string;
}) {
  const queryValue = useRouterQuery(queryKey);
  const isOpen = useSidebarStore((s) => s.open);
  const setOpen = useSidebarStore((s) => s.setOpen);

  React.useEffect(() => {
    if (isOpen) setOpen(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryValue]);

  return (
    <Flex
      alignItems="center"
      height={SEARCH_BAR_HEIGHT}
      padding="8px"
      width="100%"
    >
      <SearchField
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onSelect={() => {
          if (!isOpen) setOpen(true);
        }}
      />

      <Presence present={!noButton}>
        <IconButton
          aria-label={isOpen ? 'Collapse search' : 'Expand search'}
          color="fg.muted"
          height={SEARCH_FIELD_HEIGHT}
          hideFrom="md"
          marginInlineStart="8px"
          minWidth={SEARCH_FIELD_HEIGHT}
          variant="ghost"
          width={SEARCH_FIELD_HEIGHT}
          css={{
            borderRadius: '4px',
            transition:
              'background-color 100ms var(--transition-timing-function-ease, ease)',
            ...QUIET_INTERACTIVE_CSS,
          }}
          onClick={() => setOpen(!isOpen)}
        >
          {isOpen ? <MdOutlineExpandMore /> : <MdExpandLess />}
        </IconButton>
      </Presence>
    </Flex>
  );
}
