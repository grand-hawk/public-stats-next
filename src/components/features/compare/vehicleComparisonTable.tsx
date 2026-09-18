import { Text } from '@chakra-ui/react';
import React from 'react';

import AddColumn from '@/components/features/compare/addColumn';
import { buildAddonsSection } from '@/components/features/compare/addonsSection';
import ColumnHeader from '@/components/features/compare/columnHeader';
import ComparisonTable from '@/components/features/compare/comparisonTable';
import {
  MAX_COMPARE_ITEMS,
  VEHICLE_LIST_ITEM_HEIGHT_PX,
} from '@/components/features/compare/constants';
import VehicleColumnConfig from '@/components/features/compare/vehicleColumnConfig';
import { buildVehicleSections } from '@/components/features/compare/vehicleStats';
import VehicleIcon from '@/components/features/vehicles/vehicleIcon';
import VehicleImage from '@/components/features/vehicles/vehicleImage';
import { usePlace } from '@/hooks/usePlace';
import { assembleModules } from '@/utils/alterations';
import { simplifyString } from '@/utils/simplifyString';

import type { SectionDef } from '@/components/features/compare/types';
import type { AssembledVehicle } from '@/components/features/compare/vehicleStats';
import type {
  DetailedVehicle,
  ListVehicle,
} from '@/server/api/trpc/routers/vehicles';

export default function VehicleComparisonTable({
  allVehicles,
  loadingCount = 0,
  onAdd,
  onRemove,
  vehicles,
}: {
  allVehicles: ListVehicle[];
  loadingCount?: number;
  vehicles: DetailedVehicle[];
  onAdd: (slug: string) => void;
  onRemove: (slug: string) => void;
}) {
  const place = usePlace()!;
  const [alterationsMap, setAlterationsMap] = React.useState<
    Record<string, Record<string, boolean>>
  >({});

  const handleAlterationsChange = React.useCallback(
    (slug: string, alterations: Record<string, boolean>) => {
      setAlterationsMap((prev) => ({ ...prev, [slug]: alterations }));
    },
    [],
  );

  const assembled = React.useMemo<AssembledVehicle[]>(
    () =>
      vehicles.map((vehicle) => {
        const enabled = alterationsMap[vehicle.info.slug] ?? {};
        return {
          vehicle,
          modules: assembleModules(vehicle, enabled),
          enabledAlterations: enabled,
          onAlterationsChange: (alts: Record<string, boolean>) =>
            handleAlterationsChange(vehicle.info.slug, alts),
        };
      }),
    [vehicles, alterationsMap, handleAlterationsChange],
  );

  const statSections = React.useMemo(() => buildVehicleSections(), []);
  const selectedSlugs = React.useMemo(
    () => vehicles.map((vehicle) => vehicle.info.slug),
    [vehicles],
  );

  const matchesVehicleQuery = React.useCallback(
    (vehicle: ListVehicle, simplified: string) =>
      simplifyString(vehicle.name).includes(simplified),
    [],
  );

  const allAddonNames = React.useMemo(() => {
    const names = new Set<string>();
    for (const vehicle of vehicles) {
      for (const name of Object.keys(vehicle.alterations.addons)) {
        names.add(name);
      }
    }
    return [...names].sort();
  }, [vehicles]);

  const sections = React.useMemo(() => {
    const [generalSection, ...restSections] = statSections;
    const result: SectionDef<AssembledVehicle>[] = [generalSection];

    if (allAddonNames.length > 0) {
      result.push(buildAddonsSection(allAddonNames));
    }

    return [...result, ...restSections];
  }, [statSections, allAddonNames]);

  const isFull = vehicles.length + loadingCount >= MAX_COMPARE_ITEMS;

  return (
    <ComparisonTable<AssembledVehicle>
      addAction={
        isFull ? undefined : (
          <AddColumn
            addLabel="Add vehicle"
            emptyMessage="No vehicles found"
            itemHeight={VEHICLE_LIST_ITEM_HEIGHT_PX}
            items={allVehicles}
            matchesQuery={matchesVehicleQuery}
            placeholder="Search vehicles"
            renderItem={(vehicle) => (
              <>
                <VehicleIcon size={18} slug={vehicle.slug} />
                <Text as="span" overflow="hidden" textOverflow="ellipsis">
                  {vehicle.name}
                </Text>
              </>
            )}
            selectedSlugs={selectedSlugs}
            onAdd={onAdd}
          />
        )
      }
      emptyMessage="Add two or more vehicles to compare them."
      headerCells={assembled.map((item) => ({
        key: item.vehicle.info.slug,
        content: (
          <ColumnHeader
            href={`/${place.initials}/vehicles/${item.vehicle.info.slug}`}
            media={
              <VehicleImage
                fill
                name={item.vehicle.info.name}
                placeholder="empty"
                sizes="300px"
                slug={item.vehicle.info.slug}
              />
            }
            name={item.vehicle.info.name}
            removeLabel={`Remove ${item.vehicle.info.name}`}
            subtitle={item.vehicle.info.role}
            onRemove={() => onRemove(item.vehicle.info.slug)}
          >
            <VehicleColumnConfig
              enabledAlterations={item.enabledAlterations}
              vehicle={item.vehicle}
              onAlterationsChange={item.onAlterationsChange}
            />
          </ColumnHeader>
        ),
      }))}
      items={assembled}
      loadingCount={loadingCount}
      sections={sections}
    />
  );
}
