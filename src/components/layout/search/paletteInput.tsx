import { Flex, Input } from '@chakra-ui/react';
import React from 'react';
import { LuSearch } from 'react-icons/lu';

import {
  SEARCH_INPUT_ID,
  SEARCH_LISTBOX_ID,
} from '@/components/layout/search/useSiteSearch';

import type { SiteSearchController } from '@/components/layout/search/useSiteSearch';

export default function PaletteInput({
  inputRef,
  search,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  search: SiteSearchController;
}) {
  const { activeId, enabled, handleKeyDown, query, results, setQuery } = search;

  return (
    <Flex
      alignItems="center"
      flexWrap="nowrap"
      gap="4px"
      css={{
        height: '56px',
        paddingBlock: '12px',
        paddingInline: '8px',
        fontSize: '16px',
        lineHeight: '26px',
      }}
    >
      <Flex
        alignItems="center"
        color="fg.subtle"
        flexShrink={0}
        height="40px"
        justifyContent="center"
        width="40px"
      >
        <LuSearch size={20} />
      </Flex>
      <Input
        ref={inputRef}
        aria-activedescendant={activeId}
        aria-autocomplete="list"
        aria-controls={SEARCH_LISTBOX_ID}
        aria-expanded={enabled && results.length > 0}
        aria-label="Search the MTC wiki"
        autoComplete="off"
        background="transparent"
        border="none"
        borderRadius={0}
        boxShadow="none"
        color="fg.emphasized"
        flexGrow={1}
        fontSize="16px"
        height="26px"
        id={SEARCH_INPUT_ID}
        lineHeight="26px"
        minWidth={0}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={handleKeyDown}
        outline="none"
        padding={0}
        placeholder="Search the MTC wiki"
        role="combobox"
        spellCheck={false}
        value={query}
        _focus={{ boxShadow: 'none', outline: 'none' }}
        _placeholder={{ color: 'fg.subtle' }}
      />
    </Flex>
  );
}
