'use client';

import {
  createListCollection,
  Flex,
  Portal,
  Select,
  Span,
} from '@chakra-ui/react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

import { useCurrentTab } from '@/hooks/useCurrentTab';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';
import { useSuspenseConfig } from '@/hooks/useSuspenseConfig';

export default function PlaceSwitchBar({
  hideDropdown,
  overwriteTabLabel,
}: {
  hideDropdown?: boolean;
  overwriteTabLabel?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
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
      display={hideDropdown ? { base: 'none', md: 'flex' } : undefined}
      justifyContent="space-between"
      padding={{
        base: 4,
        md: 2,
      }}
    >
      <Span fontSize="sm" fontWeight="bold" hideBelow="md" lineHeight="short">
        {overwriteTabLabel !== undefined
          ? overwriteTabLabel
          : currentTab?.label}
      </Span>

      {!hideDropdown && (
        <Select.Root
          borderWidth={0}
          collection={placeCollection}
          lazyMount
          marginLeft="auto"
          size={{
            base: 'md',
            sm: 'sm',
          }}
          value={[currentInitials]}
          width={{
            base: '100%',
            md: 'min(100%, var(--chakra-sizes-xs))',
          }}
          onValueChange={(details) => {
            const selectedInitials = details.value[0];
            if (selectedInitials !== currentInitials) {
              const newPath = pathname.replace(
                `/${currentInitials}`,
                `/${selectedInitials}`,
              );
              router.push(newPath);
            }
          }}
        >
          <Select.HiddenSelect />

          <Select.Control padding={0}>
            <Select.Trigger aria-label="Select place">
              <Select.ValueText maxWidth="calc(100% - 20px)" />
            </Select.Trigger>

            <Select.IndicatorGroup paddingInline="unset">
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>

          <Portal>
            <Select.Positioner>
              <Select.Content>
                {placeCollection.items.map((place) => (
                  <Select.Item key={place.value} item={place}>
                    {place.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
      )}
    </Flex>
  );
}
