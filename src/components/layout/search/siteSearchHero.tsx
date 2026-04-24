import { Box, Flex, Input, Spinner, Text } from '@chakra-ui/react';
import React from 'react';
import { LuSearch } from 'react-icons/lu';

import SearchResults from '@/components/layout/search/searchResults';
import { useSiteSearch } from '@/components/layout/search/useSiteSearch';
import { useSearchStore } from '@/stores/search';

export default function SiteSearchHero() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [focused, setFocused] = React.useState(false);
  const setHeroFocus = useSearchStore((s) => s.setHeroFocus);

  const controller = useSiteSearch({
    onSelect: () => {
      setFocused(false);
      inputRef.current?.blur();
    },
  });
  const { enabled, handleKeyDown, isFetching, query, setQuery } = controller;

  React.useEffect(() => {
    setHeroFocus(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
    return () => setHeroFocus(null);
  }, [setHeroFocus]);

  React.useEffect(() => {
    if (!focused) return;
    const onMouseDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setFocused(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setFocused(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [focused]);

  const showPanel = focused && (enabled || query.length > 0);

  return (
    <Box
      ref={containerRef}
      marginX="auto"
      maxWidth="2xl"
      position="relative"
      width="100%"
    >
      <Flex
        alignItems="center"
        backgroundColor="bg.subtle"
        borderColor={focused ? 'border.inverted' : 'border.emphasized'}
        borderWidth="1px"
        color={focused ? 'fg' : 'fg.subtle'}
        gap={3}
        height={{ base: 12, md: 14 }}
        onClick={() => inputRef.current?.focus()}
        paddingX={5}
        transition="all 0.15s"
        _hover={{ borderColor: 'border.inverted', color: 'fg' }}
      >
        <LuSearch size={20} />
        <Input
          ref={inputRef}
          aria-label="Search"
          border="none"
          color="fg"
          flex={1}
          fontSize={{ base: 'sm', md: 'md' }}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
          outline="none"
          padding={0}
          placeholder="Search vehicles, shells, teams..."
          value={query}
          _focus={{ boxShadow: 'none' }}
          _placeholder={{ color: 'fg.subtle' }}
        />
        {isFetching && enabled && <Spinner size="sm" />}
        {!focused && (
          <Text
            color="fg.subtle"
            display={{ base: 'none', md: 'block' }}
            fontFamily="mono"
            fontSize="xs"
            letterSpacing="wider"
          >
            Ctrl K
          </Text>
        )}
      </Flex>

      {showPanel && (
        <Box
          backgroundColor="bg"
          borderColor="border.emphasized"
          borderWidth="1px"
          borderTopWidth={0}
          boxShadow="lg"
          left={0}
          position="absolute"
          right={0}
          top="100%"
          zIndex={10}
        >
          <SearchResults controller={controller} maxHeight="50vh" />
        </Box>
      )}
    </Box>
  );
}
