import {
  createListCollection,
  Flex,
  Portal,
  Select,
  Span,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { useCurrentTab } from '@/hooks/useCurrentTab';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';
import { useSuspenseConfig } from '@/hooks/useSuspenseConfig';

export default function PlaceSwitchBar() {
  const router = useRouter();
  const config = useSuspenseConfig();
  const currentInitials = usePlaceInitials();
  const currentTab = useCurrentTab();

  const placeCollection = createListCollection({
    items: Object.entries(config.placeNameInitials).map(
      ([placeName, initials]) => ({
        value: initials,
        label: placeName,
      }),
    ),
    itemToString: (item) => `${item.label} stats`,
  });

  return (
    <Flex
      borderBottomWidth="1px"
      justifyContent="space-between"
      padding={{
        base: 4,
        md: 2,
      }}
      role="menubar"
    >
      <Span fontSize="sm" fontWeight="bold" hideBelow="md" lineHeight="short">
        {currentTab?.label}
      </Span>

      <Select.Root
        collection={placeCollection}
        lazyMount
        marginLeft="auto"
        size={{
          base: 'md',
          sm: 'sm',
        }}
        value={[currentInitials || 'MTC']}
        width={{
          base: '100%',
          md: 'min(100%, var(--chakra-sizes-xs))',
        }}
        onValueChange={(details) => {
          const selectedInitials = details.value[0];
          if (selectedInitials !== currentInitials)
            router.push({
              pathname: router.pathname,
              query: {
                ...router.query,
                place: selectedInitials,
              },
            });
        }}
      >
        <Select.HiddenSelect />

        <Select.Control>
          <Select.Trigger
            border="none"
            borderRadius="none"
            minHeight="unset"
            paddingInline="unset"
          >
            <Select.ValueText maxWidth="calc(100% - 20px)" />
          </Select.Trigger>
          <Select.IndicatorGroup paddingInline="unset">
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>

        <Portal>
          <Select.Positioner>
            <Select.Content borderRadius="none">
              {placeCollection.items.map((place) => (
                <Select.Item key={place.value} borderRadius="none" item={place}>
                  {place.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    </Flex>
  );
}
