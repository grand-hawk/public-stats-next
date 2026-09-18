import { Box, Flex, IconButton, Input, Presence } from '@chakra-ui/react';
import React from 'react';
import { LuSearch } from 'react-icons/lu';
import { MdExpandLess } from 'react-icons/md';
import { MdOutlineExpandMore } from 'react-icons/md';

import { FOCUS_RING_CSS, QUIET_INTERACTIVE_CSS } from '@/components/ui/styles';
import { useRouterQuery } from '@/hooks/useRouterQuery';
import { useSidebarStore } from '@/stores/sidebar';

import type { InputProps } from '@chakra-ui/react';

const SEARCH_FIELD_HEIGHT = '40px';
export const SEARCH_BAR_HEIGHT = '56px';

export default function SearchInput({
  noButton,
  onChange,
  placeholder = 'Filter results',
  queryKey,
  value,
}: {
  value: InputProps['value'];
  onChange: InputProps['onChange'];
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
      <Box flex="1" minWidth={0} position="relative">
        <Box
          asChild
          color="fg.muted"
          left="12px"
          pointerEvents="none"
          position="absolute"
          top="50%"
          transform="translateY(-50%)"
        >
          <LuSearch size={16} />
        </Box>

        <Input
          placeholder={placeholder}
          unstyled
          value={value}
          css={{
            width: '100%',
            height: SEARCH_FIELD_HEIGHT,
            paddingInlineStart: '36px',
            paddingInlineEnd: '12px',
            fontSize: '0.875rem',
            lineHeight: '1.375rem',
            color: 'var(--color-base)',
            backgroundColor: 'var(--color-surface-1)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'var(--border-color-interactive)',
            borderRadius: '4px',
            boxShadow: 'inset 0 0 0 1px transparent',
            transitionProperty:
              'background-color, color, border-color, box-shadow',
            transitionDuration: '250ms',
            transitionTimingFunction:
              'var(--transition-timing-function-ease, ease)',
            '&::placeholder': { color: 'var(--color-placeholder)' },
            '&:hover': {
              borderColor: 'var(--border-color-interactive--hover)',
            },
            '&:focus, &:focus-visible': {
              ...FOCUS_RING_CSS,
              borderColor: 'var(--border-color-progressive--focus)',
            },
          }}
          onChange={onChange}
          onSelect={() => {
            if (!isOpen) setOpen(true);
          }}
        />
      </Box>

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
