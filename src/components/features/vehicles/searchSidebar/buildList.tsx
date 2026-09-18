import React from 'react';

import VehicleListName from '@/components/features/vehicles/searchSidebar/listName';

import type { ListItem } from '@/components/layout/searchLayout/searchSidebar/list';
import type { ListVehicle } from '@/server/api/trpc/routers/vehicles';

interface Group {
  label: string;
  isTeam: boolean;
  vehicles: ListVehicle[];
}

const byName = (a: ListVehicle, b: ListVehicle) => a.name.localeCompare(b.name);

function bucketBy(vehicles: ListVehicle[], key: 'role' | 'team') {
  const buckets: Record<string, ListVehicle[]> = {};

  for (const vehicle of vehicles) {
    if (!buckets[vehicle[key]]) buckets[vehicle[key]] = [];
    buckets[vehicle[key]].push(vehicle);
  }

  return Object.keys(buckets)
    .sort((a, b) => a.localeCompare(b))
    .map((label) => ({ label, vehicles: buckets[label] }));
}

function toListItem(vehicle: ListVehicle): ListItem {
  return {
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
  };
}

export default function buildVehicleList(
  vehicles: ListVehicle[],
  groupByTeam: boolean,
  groupByRole: boolean,
): ListItem[] {
  if (!groupByTeam && !groupByRole) return vehicles.map(toListItem);

  const groups: Group[] = [];

  if (!groupByTeam) {
    for (const role of bucketBy(vehicles, 'role')) {
      groups.push({
        label: role.label,
        isTeam: false,
        vehicles: role.vehicles.sort(byName),
      });
    }
  } else if (!groupByRole) {
    for (const team of bucketBy(vehicles, 'team')) {
      groups.push({
        label: team.label,
        isTeam: true,
        vehicles: team.vehicles.sort(byName),
      });
    }
  } else {
    for (const team of bucketBy(vehicles, 'team')) {
      groups.push({ label: team.label, isTeam: true, vehicles: [] });

      for (const role of bucketBy(team.vehicles, 'role')) {
        groups.push({
          label: role.label,
          isTeam: false,
          vehicles: role.vehicles.sort(byName),
        });
      }
    }
  }

  const result: ListItem[] = [];

  for (const group of groups) {
    result.push({ type: 'divider', label: group.label, isTeam: group.isTeam });
    result.push(...group.vehicles.map(toListItem));
  }

  return result;
}
