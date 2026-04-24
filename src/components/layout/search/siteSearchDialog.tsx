import {
  Box,
  Dialog as ChakraDialog,
  Flex,
  HStack,
  Input,
  Kbd,
  Portal,
  Spinner,
} from '@chakra-ui/react';
import React from 'react';

import SearchResults from '@/components/layout/search/searchResults';
import { useSiteSearch } from '@/components/layout/search/useSiteSearch';

interface SiteSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SiteSearchDialog({
  onOpenChange,
  open,
}: SiteSearchDialogProps) {
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const controller = useSiteSearch({
    onSelect: () => onOpenChange(false),
  });
  const {
    enabled,
    handleKeyDown,
    isFetching,
    query,
    reset,
    results,
    setQuery,
  } = controller;

  React.useEffect(() => {
    if (!open) {
      reset();
      return;
    }
    const raf = requestAnimationFrame(() => searchInputRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, [open, reset]);

  const showResultsArea = results.length > 0 || enabled;

  return (
    <ChakraDialog.Root
      lazyMount
      open={open}
      onOpenChange={(e) => onOpenChange(e.open)}
      placement="top"
    >
      <Portal>
        <ChakraDialog.Backdrop />
        <ChakraDialog.Positioner>
          <ChakraDialog.Content
            asChild={false}
            bg="bg.panel"
            borderRadius="0"
            boxShadow="xl"
            marginTop={{ base: 4, md: 20 }}
            maxWidth="xl"
            overflow="hidden"
          >
            <Flex direction="column">
              <HStack
                backgroundColor="bg.emphasized"
                borderBottomColor="border.emphasized"
                borderBottomWidth={showResultsArea ? '1px' : 0}
                gap={3}
                paddingX={4}
                paddingY={3}
              >
                <Input
                  ref={searchInputRef}
                  border="none"
                  fontSize="md"
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  outline="none"
                  paddingX={0}
                  placeholder="Search vehicles, shells, teams..."
                  value={query}
                  _focus={{ boxShadow: 'none' }}
                />
                {isFetching && enabled ? (
                  <Spinner size="sm" />
                ) : (
                  <Kbd size="sm">Esc</Kbd>
                )}
              </HStack>
              <Box backgroundColor="bg.panel">
                <SearchResults controller={controller} />
              </Box>
            </Flex>
          </ChakraDialog.Content>
        </ChakraDialog.Positioner>
      </Portal>
    </ChakraDialog.Root>
  );
}
