import { Badge, HStack } from '@chakra-ui/react';
import React from 'react';

import VehicleSearchConfig from '@/components/features/vehicles/searchSidebar/config';
import VehicleIcon from '@/components/features/vehicles/vehicleIcon';
import SearchSidebar from '@/components/layout/searchLayout/searchSidebar';
import SearchInput from '@/components/layout/searchLayout/searchSidebar/input';
import { usePlace } from '@/hooks/usePlace';
import { useRouterQuery } from '@/hooks/useRouterQuery';
import { useVehicleSearchStore } from '@/stores/vehicles/search';
import { simplifyString } from '@/utils/simplifyString';
import { trpc } from '@/utils/trpc';

import type { ListItem } from '@/components/layout/searchLayout/searchSidebar/list';
import type { ListVehicle } from '@/server/api/trpc/routers/vehicles';

const VehicleListName = React.memo(function VehicleListName({
  isNew,
  name,
  slug,
}: {
  name: string;
  slug: string;
  isNew?: boolean;
}) {
  return (
    <HStack justifyContent="space-between" width="100%">
      {isNew ? (
        <HStack>
          {name} <Badge colorPalette="blue">NEW</Badge>
        </HStack>
      ) : (
        name
      )}
      <VehicleIcon slug={slug} />
    </HStack>
  );
});

export default function VehiclesSearchSidebar() {
  const place = usePlace()!;
  const vehicleQuery = useRouterQuery('vehicle');
  const query = useVehicleSearchStore((s) => s.query);
  const deferredQuery = React.useDeferredValue(query);
  const setQuery = useVehicleSearchStore((s) => s.setQuery);
  const groupByTeam = useVehicleSearchStore((s) => s.groupByTeam);
  const groupByRole = useVehicleSearchStore((s) => s.groupByRole);

  const [vehicleList] = trpc.vehicles.list.useSuspenseQuery({
    placeId: place.placeId,
  });

  const simplifiedNames = React.useMemo(() => {
    const map = new Map<string, string>();
    for (const vehicle of vehicleList) {
      map.set(vehicle.slug, simplifyString(vehicle.name));
    }
    return map;
  }, [vehicleList]);

  const filteredVehicleList = React.useMemo(() => {
    if (deferredQuery === '') return vehicleList;

    const simplifiedQuery = simplifyString(deferredQuery);

    return vehicleList.filter((vehicle) =>
      simplifiedNames.get(vehicle.slug)!.includes(simplifiedQuery),
    );
  }, [vehicleList, deferredQuery, simplifiedNames]);

  const list: ListItem[] = React.useMemo(() => {
    type Group = { label: string; isTeam?: boolean; vehicles?: ListVehicle[] };
    const groups: Group[] = [];

    if (!groupByTeam && !groupByRole) {
      return filteredVehicleList.map((vehicle) => ({
        type: 'item',
        value: {
          ...vehicle,
          name: (
            <VehicleListName
              name={vehicle.name}
              slug={vehicle.slug}
              isNew={vehicle.new}
            />
          ),
        },
      }));
    }

    if (!groupByTeam && groupByRole) {
      const roles: Record<string, ListVehicle[]> = {};

      for (const vehicle of filteredVehicleList) {
        if (!roles[vehicle.role]) roles[vehicle.role] = [];

        roles[vehicle.role].push(vehicle);
      }

      for (const role of Object.keys(roles).sort((a, b) =>
        a.localeCompare(b),
      )) {
        groups.push({
          label: role,
          isTeam: false,
          vehicles: roles[role].sort((a, b) => a.name.localeCompare(b.name)),
        });
      }
    } else if (groupByTeam && !groupByRole) {
      const teams: Record<string, ListVehicle[]> = {};

      for (const vehicle of filteredVehicleList) {
        if (!teams[vehicle.team]) teams[vehicle.team] = [];

        teams[vehicle.team].push(vehicle);
      }

      for (const team of Object.keys(teams).sort((a, b) =>
        a.localeCompare(b),
      )) {
        groups.push({
          label: team,
          isTeam: true,
          vehicles: teams[team].sort((a, b) => a.name.localeCompare(b.name)),
        });
      }
    } else {
      const teams: Record<string, ListVehicle[]> = {};

      for (const vehicle of filteredVehicleList) {
        if (!teams[vehicle.team]) teams[vehicle.team] = [];

        teams[vehicle.team].push(vehicle);
      }

      for (const team of Object.keys(teams).sort((a, b) =>
        a.localeCompare(b),
      )) {
        groups.push({ label: team, isTeam: true, vehicles: [] });

        const roles: Record<string, ListVehicle[]> = {};

        for (const v of teams[team]) {
          if (!roles[v.role]) roles[v.role] = [];

          roles[v.role].push(v);
        }

        for (const role of Object.keys(roles).sort((a, b) =>
          a.localeCompare(b),
        )) {
          groups.push({
            label: role,
            isTeam: false,
            vehicles: roles[role].sort((a, b) => a.name.localeCompare(b.name)),
          });
        }
      }
    }

    const result: ListItem[] = [];

    for (const group of groups) {
      result.push({
        type: 'divider',
        label: group.label,
        isTeam: group.isTeam,
      });

      if (group.vehicles && group.vehicles.length > 0) {
        for (const vehicle of group.vehicles) {
          result.push({
            type: 'item',
            value: {
              ...vehicle,
              name: (
                <VehicleListName
                  name={vehicle.name}
                  slug={vehicle.slug}
                  isNew={vehicle.new}
                />
              ),
            },
          });
        }
      }
    }

    return result;
  }, [groupByTeam, groupByRole, filteredVehicleList]);

  const isSearching = !vehicleQuery;

  return (
    <SearchSidebar
      isSearching={isSearching}
      searchListProps={{
        queryKey: 'vehicle',
        listItems: list,
        queryKeyPlural: 'vehicles',
      }}
    >
      <SearchInput
        noButton={isSearching}
        queryKey="vehicle"
        value={query}
        onChange={(details) => setQuery(details.target.value)}
      />
      <VehicleSearchConfig />
    </SearchSidebar>
  );
}
