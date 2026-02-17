import { Text } from '@chakra-ui/react';
import React from 'react';

import {
  COMPARE_MAX_WIDTH_MEDIUM,
  COMPARE_MAX_WIDTH_SMALL,
  MAX_COMPARE_ITEMS,
  VEHICLE_LIST_ITEM_HEIGHT_PX,
} from '@/components/features/compare';
import AddColumnHeader from '@/components/features/compare/addColumnHeader';
import ColumnHeader from '@/components/features/compare/columnHeader';
import ComparisonGrid from '@/components/features/compare/comparisonGrid';
import VehicleColumnConfig from '@/components/features/compare/vehicleColumnConfig';
import { buildVehicleSections } from '@/components/features/compare/vehicleStats';
import VehicleIcon from '@/components/features/vehicles/vehicleIcon';
import { assembleModules } from '@/utils/alterations';
import { simplifyString } from '@/utils/simplifyString';

import type { AssembledVehicle } from '@/components/features/compare/vehicleStats';
import type { DetailedVehicle } from '@/server/api/trpc/routers/vehicles';
import type { ListVehicle } from '@/server/api/trpc/routers/vehicles';

export interface VehicleComparisonTableProps {
  vehicles: DetailedVehicle[];
  allVehicles: ListVehicle[];
  onAdd: (slug: string) => void;
  onRemove: (slug: string) => void;
}

export default function VehicleComparisonTable({
  allVehicles,
  onAdd,
  onRemove,
  vehicles,
}: VehicleComparisonTableProps) {
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
        };
      }),
    [vehicles, alterationsMap],
  );

  const sections = React.useMemo(() => buildVehicleSections(), []);
  const selectedSlugs = React.useMemo(
    () => vehicles.map((vehicle) => vehicle.info.slug),
    [vehicles],
  );
  const isFull = vehicles.length >= MAX_COMPARE_ITEMS;
  const hasAddColumn = !isFull;
  const totalColumns = vehicles.length + (hasAddColumn ? 1 : 0);

  const maxWidth =
    totalColumns <= 1
      ? COMPARE_MAX_WIDTH_SMALL
      : totalColumns <= 2
        ? COMPARE_MAX_WIDTH_MEDIUM
        : undefined;

  const matchesVehicleQuery = React.useCallback(
    (vehicle: ListVehicle, simplified: string) =>
      simplifyString(vehicle.name).includes(simplified),
    [],
  );

  const gridSections = React.useMemo(
    () =>
      sections.map((s) => ({
        title: s.title,
        stats: s.stats.map((st) => ({
          label: st.label,
          getter: (a: AssembledVehicle) => st.getter(a),
        })),
      })),
    [sections],
  );

  return (
    <ComparisonGrid<AssembledVehicle>
      addColumn={
        <AddColumnHeader
          addLabel="Add"
          emptyMessage="No vehicles found"
          itemHeight={VEHICLE_LIST_ITEM_HEIGHT_PX}
          items={allVehicles}
          matchesQuery={matchesVehicleQuery}
          placeholder="Search..."
          renderItem={(vehicle) => (
            <>
              <VehicleIcon size={18} slug={vehicle.slug} />
              <Text fontSize="sm" overflow="hidden" textOverflow="ellipsis">
                {vehicle.name}
              </Text>
            </>
          )}
          selectedSlugs={selectedSlugs}
          onAdd={onAdd}
        />
      }
      hasAddColumn={hasAddColumn}
      headerCells={vehicles.map((vehicle) => ({
        key: vehicle.info.slug,
        content: (
          <ColumnHeader
            extra={
              <VehicleColumnConfig
                enabledAlterations={alterationsMap[vehicle.info.slug] ?? {}}
                vehicle={vehicle}
                onAlterationsChange={(alts) =>
                  handleAlterationsChange(vehicle.info.slug, alts)
                }
              />
            }
            onRemove={() => onRemove(vehicle.info.slug)}
          >
            <VehicleIcon size={20} slug={vehicle.info.slug} />
            <Text fontSize="sm" fontWeight="medium" lineHeight="tight" truncate>
              {vehicle.info.name}
            </Text>
          </ColumnHeader>
        ),
      }))}
      itemCount={vehicles.length}
      items={assembled}
      maxWidth={maxWidth}
      sections={gridSections}
    />
  );
}
