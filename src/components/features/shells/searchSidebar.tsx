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

export default function ShellsSearchSidebar() {
  const place = usePlace()!;
  const shellQuery = useRouterQuery('shell');
  const query = useShellsSearchStore((s) => s.query);
  const setQuery = useShellsSearchStore((s) => s.setQuery);

  const [shellsList] = trpc.shells.list.useSuspenseQuery({
    placeId: place.placeId,
  });

  const filteredShellsList = React.useMemo(() => {
    if (query === '') return shellsList;

    const simplifiedQuery = simplifyString(query);
    const filtered: typeof shellsList = {};

    const vehicleCache = new Map<string, string>();
    const simplifyVehicle = (vehicle: string) => {
      const cached = vehicleCache.get(vehicle);
      if (cached) return cached;

      const simplified = simplifyString(vehicle);
      vehicleCache.set(vehicle, simplified);

      return simplified;
    };

    for (const [weapon, shells] of Object.entries(shellsList)) {
      const simplifiedWeapon = simplifyString(weapon);

      if (simplifiedWeapon.includes(simplifiedQuery)) filtered[weapon] = shells;
      else {
        const matchingShells = shells.filter((shell) => {
          const simplifiedShellName = simplifyString(shell.name);

          if (simplifiedShellName.includes(simplifiedQuery)) return true;

          return shell.vehicles.some((vehicle) =>
            simplifyVehicle(vehicle).includes(simplifiedQuery),
          );
        });

        if (matchingShells.length > 0) filtered[weapon] = matchingShells;
      }
    }

    return filtered;
  }, [shellsList, query]);

  const list: ListItem[] = React.useMemo(() => {
    const result: ListItem[] = [];

    for (const [weapon, shells] of Object.entries(filteredShellsList)) {
      result.push({
        type: 'divider',
        label: weapon,
        emphasized: true,
      });

      for (const shell of shells) {
        const shellIcon = getShellIcon(shell.displayType);

        result.push({
          type: 'item',
          value: {
            name: shellIcon ? (
              <HStack justifyContent="space-between" width="100%">
                {shell.name}

                <ShellIcon alt={shell.type} src={shellIcon} />
              </HStack>
            ) : (
              shell.name
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
