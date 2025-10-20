import { Box } from '@chakra-ui/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import React from 'react';
import slug from 'slug';

import {
  VehicleSearchListDividerItem,
  VehicleSearchListVehicleItem,
} from '@/components/vehicles/search/list/item';
import { usePlace } from '@/hooks/usePlace';
import { useRouterQuery } from '@/hooks/useRouterQuery';
import { useVehicleSearchStore } from '@/stores/vehicles/search';
import { simplifyString } from '@/utils/simplifyString';
import { trpc } from '@/utils/trpc';

import type { ListVehicle } from '@/server/api/trpc/routers/vehicles';

type DividerListItem = {
  type: 'divider';
  label: string;
  isTeam?: boolean;
};

type VehicleListItem = {
  type: 'vehicle';
  vehicle: ListVehicle;
};

type ListItem = DividerListItem | VehicleListItem;

export default function VehicleSearchList() {
  const place = usePlace()!;
  const vehicleQuery = useRouterQuery('vehicle');
  const vehicleSlug = vehicleQuery ? slug(vehicleQuery) : null;
  const query = useVehicleSearchStore((s) => s.query);
  const groupByTeam = useVehicleSearchStore((s) => s.groupByTeam);
  const groupByRole = useVehicleSearchStore((s) => s.groupByRole);

  const [vehicleList] = trpc.vehicles.list.useSuspenseQuery({
    placeId: place.placeId,
  });

  const filteredVehicleList = React.useMemo(() => {
    if (query === '') return vehicleList;

    const simplifiedQuery = simplifyString(query);

    return vehicleList.filter((vehicle) =>
      simplifyString(vehicle.name).includes(simplifiedQuery),
    );
  }, [vehicleList, query]);

  const list: ListItem[] = React.useMemo(() => {
    type Group = { label: string; isTeam?: boolean; vehicles?: ListVehicle[] };
    const groups: Group[] = [];

    if (!groupByTeam && !groupByRole)
      return filteredVehicleList.map((vehicle) => ({
        type: 'vehicle',
        vehicle,
      }));

    if (!groupByTeam && groupByRole) {
      const roles: Record<string, ListVehicle[]> = {};

      for (const vehicle of filteredVehicleList) {
        if (!roles[vehicle.role]) roles[vehicle.role] = [];

        roles[vehicle.role].push(vehicle);
      }

      for (const role of Object.keys(roles).sort((a, b) => a.localeCompare(b)))
        groups.push({
          label: role,
          isTeam: false,
          vehicles: roles[role].sort((a, b) => a.name.localeCompare(b.name)),
        });
    } else if (groupByTeam && !groupByRole) {
      const teams: Record<string, ListVehicle[]> = {};

      for (const vehicle of filteredVehicleList) {
        if (!teams[vehicle.team]) teams[vehicle.team] = [];

        teams[vehicle.team].push(vehicle);
      }

      for (const team of Object.keys(teams).sort((a, b) => a.localeCompare(b)))
        groups.push({
          label: team,
          isTeam: true,
          vehicles: teams[team].sort((a, b) => a.name.localeCompare(b.name)),
        });
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
        ))
          groups.push({
            label: role,
            isTeam: false,
            vehicles: roles[role].sort((a, b) => a.name.localeCompare(b.name)),
          });
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
        for (const v of group.vehicles)
            const initialOffset = React.useMemo(() => {
    if (!vehicleSlug) return 0;

    const index = list.findIndex(
      (item) => item.type === 'vehicle' && item.vehicle.slug === vehicleSlug,
    );
    if (index !== -1) return index * 35;

    return 0;
  }, [list, vehicleSlug]);ehicle.slug === vehicleSlug,
    );
    if (index !== -1) return index * 35;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const parentRef = React.useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: list.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 5,
    initialRect: {
      height: 25 * 35,
      width: 0,
    },
    initialOffset,
  });

  return (
    <Box ref={parentRef} height="100%" overflow="auto" scrollBehavior="unset">
      <Box
        height={`${rowVirtualizer.getTotalSize()}px`}
        position="relative"
        scrollBehavior="revert"
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const listItem = list[virtualItem.index];

          const baseProps = {
            height: `${virtualItem.size}px`,
            transform: `translateY(${virtualItem.start}px)`,
          } as const;

          if (listItem.type === 'divider')
            return (
              <VehicleSearchListDividerItem
                key={virtualItem.index}
                isTeam={listItem.isTeam}
                label={listItem.label}
                {...baseProps}
              />
            );
          return (
            <VehicleSearchListVehicleItem
              key={virtualItem.index}
              active={vehicleSlug === listItem.vehicle.slug}
              placeInitials={place.initials}
              slug={listItem.vehicle.slug}
              {...baseProps}
            >
              {listItem.vehicle.name}
            </VehicleSearchListVehicleItem>
          );
        })}
      </Box>
    </Box>
  );
}
