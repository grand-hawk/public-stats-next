import React from 'react';

import buildVehicleList from '@/components/features/vehicles/searchSidebar/buildList';
import VehicleSearchConfig from '@/components/features/vehicles/searchSidebar/config';
import SearchSidebar from '@/components/layout/searchLayout/searchSidebar';
import SearchInput from '@/components/layout/searchLayout/searchSidebar/input';
import { usePlace } from '@/hooks/usePlace';
import { useRouterQuery } from '@/hooks/useRouterQuery';
import { useVehicleSearchStore } from '@/stores/vehicles/search';
import { simplifyString } from '@/utils/simplifyString';
import { trpc } from '@/utils/trpc';

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

  const list = React.useMemo(
    () => buildVehicleList(filteredVehicleList, groupByTeam, groupByRole),
    [groupByTeam, groupByRole, filteredVehicleList],
  );

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
        placeholder="Filter vehicles"
        queryKey="vehicle"
        value={query}
        onChange={setQuery}
      />
      <VehicleSearchConfig />
    </SearchSidebar>
  );
}
