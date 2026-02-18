import { HStack } from '@chakra-ui/react';
import React from 'react';

import ShellIcon from '@/components/features/shells/shellIcon';
import { getShellIcon } from '@/components/icons/shells';
import SearchSidebar from '@/components/layout/searchLayout/searchSidebar';
import SearchInput from '@/components/layout/searchLayout/searchSidebar/input';
import { usePlace } from '@/hooks/usePlace';
import { useRouterQuery } from '@/hooks/useRouterQuery';
import { useShellsSearchStore } from '@/stores/shells/search';
import { simplifyString } from '@/utils/simplifyString';
import { trpc } from '@/utils/trpc';

import type { ListItem } from '@/components/layout/searchLayout/searchSidebar/list';

const ShellListName = React.memo(function ShellListName({
  displayType,
  name,
}: {
  name: string;
  displayType: string;
}) {
  const shellIcon = getShellIcon(displayType);

  if (!shellIcon) return name;

  return (
    <HStack justifyContent="space-between" width="100%">
      {name}
      <ShellIcon alt={name} src={shellIcon} />
    </HStack>
  );
});

export default function ShellsSearchSidebar() {
  const place = usePlace()!;
  const shellQuery = useRouterQuery('shell');
  const query = useShellsSearchStore((s) => s.query);
  const deferredQuery = React.useDeferredValue(query);
  const setQuery = useShellsSearchStore((s) => s.setQuery);

  const [shellsList] = trpc.shells.list.useSuspenseQuery({
    placeId: place.placeId,
  });

  const simplifiedStrings = React.useMemo(() => {
    const map = new Map<string, string>();
    for (const [weapon, shells] of Object.entries(shellsList)) {
      map.set(weapon, simplifyString(weapon));
      for (const shell of shells) {
        if (!map.has(shell.name)) {
          map.set(shell.name, simplifyString(shell.name));
        }
        for (const vehicle of shell.vehicles) {
          if (!map.has(vehicle)) map.set(vehicle, simplifyString(vehicle));
        }
      }
    }
    return map;
  }, [shellsList]);

  const filteredShellsList = React.useMemo(() => {
    if (deferredQuery === '') return shellsList;

    const simplifiedQuery = simplifyString(deferredQuery);
    const filtered: typeof shellsList = {};

    for (const [weapon, shells] of Object.entries(shellsList)) {
      if (simplifiedStrings.get(weapon)!.includes(simplifiedQuery)) {
        filtered[weapon] = shells;
      } else {
        const matchingShells = shells.filter((shell) => {
          if (simplifiedStrings.get(shell.name)!.includes(simplifiedQuery)) {
            return true;
          }

          return shell.vehicles.some((vehicle) =>
            simplifiedStrings.get(vehicle)!.includes(simplifiedQuery),
          );
        });

        if (matchingShells.length > 0) filtered[weapon] = matchingShells;
      }
    }

    return filtered;
  }, [shellsList, deferredQuery, simplifiedStrings]);

  const list: ListItem[] = React.useMemo(() => {
    const result: ListItem[] = [];

    for (const [weapon, shells] of Object.entries(filteredShellsList)) {
      result.push({
        type: 'divider',
        label: weapon,
        emphasized: true,
      });

      for (const shell of shells) {
        result.push({
          type: 'item',
          value: {
            name: (
              <ShellListName
                name={shell.name}
                displayType={shell.displayType}
              />
            ),
            slug: shell.slug,
          },
        });
      }
    }

    return result;
  }, [filteredShellsList]);

  const isSearching = !shellQuery;

  return (
    <SearchSidebar
      isSearching={isSearching}
      searchListProps={{
        queryKey: 'shell',
        listItems: list,
        queryKeyPlural: 'shells',
      }}
    >
      <SearchInput
        noButton={isSearching}
        queryKey="shell"
        value={query}
        onChange={(details) => setQuery(details.target.value)}
      />
    </SearchSidebar>
  );
}
