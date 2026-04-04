import { Box, Span, Stack } from '@chakra-ui/react';
import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';

import VehicleCell from '@/components/features/teams/loadouts/vehicleCell';
import { EmptyState } from '@/components/ui/empty-state';
import {
  classificationOrder,
  getClassification,
} from '@/utils/vehicleClassification';

import type { Team, TeamVehicle } from '@/server/api/trpc/routers/teams';

interface LoadoutVehiclesGridProps {
  initials: string;
  vehicles: Team['loadouts'][string];
}

interface OrganizedVehicle {
  name: string;
  premiumType?: NonNullable<TeamVehicle['premiumType']>;
  slug: string;
  vehicle: TeamVehicle;
}

export default React.memo(function LoadoutVehiclesGrid({
  initials,
  vehicles,
}: LoadoutVehiclesGridProps) {
  const vehicleEntries = React.useMemo(
    () => Object.entries(vehicles),
    [vehicles],
  );

  const { classifications, tiers, vehiclesByTierAndClassification } =
    React.useMemo(() => {
      const classificationsSet = new Set<string>();
      const tiersSet = new Set<number>();

      for (const [, vehicle] of vehicleEntries) {
        classificationsSet.add(getClassification(vehicle.role));
        tiersSet.add(vehicle.tier);
      }

      const sortedClassifications = classificationOrder.filter((c) =>
        classificationsSet.has(c),
      );
      const sortedTiers = Array.from(tiersSet).sort((a, b) => a - b);

      const byTierAndClassification: Record<
        number,
        Record<string, OrganizedVehicle[]>
      > = {};

      for (const tier of sortedTiers) {
        byTierAndClassification[tier] = {};
        for (const classification of sortedClassifications) {
          byTierAndClassification[tier][classification] = [];
        }
      }

      for (const [vehicleName, vehicle] of vehicleEntries) {
        const classification = getClassification(vehicle.role);
        byTierAndClassification[vehicle.tier][classification].push({
          name: vehicleName,
          premiumType: vehicle.premiumType,
          slug: vehicle.slug,
          vehicle,
        });
      }

      for (const tier of sortedTiers) {
        for (const classification of sortedClassifications) {
          byTierAndClassification[tier][classification].sort((a, b) =>
            a.name.localeCompare(b.name),
          );
        }
      }

      return {
        classifications: sortedClassifications,
        tiers: sortedTiers,
        vehiclesByTierAndClassification: byTierAndClassification,
      };
    }, [vehicleEntries]);

  if (vehicleEntries.length === 0) {
    return (
      <EmptyState
        icon={<GrDocumentMissing />}
        title="No vehicles found for this loadout"
      />
    );
  }

  return (
    <Box overflowX="auto">
      <Box
        display="grid"
        gap={0}
        gridTemplateColumns={`auto repeat(${classifications.length}, minmax(140px, 1fr))`}
        minWidth="fit-content"
      >
        <Box
          backgroundColor="bg.emphasized"
          borderBottomWidth="1px"
          borderRightWidth="1px"
          left={0}
          padding={3}
          position="sticky"
          zIndex={1}
        >
          <Span color="fg.subtle" fontSize="xs" fontWeight="semibold">
            Tier
          </Span>
        </Box>
        {classifications.map((classification, index) => (
          <Box
            key={classification}
            alignItems="center"
            backgroundColor="bg.emphasized"
            borderBottomWidth="1px"
            borderRightWidth={
              index === classifications.length - 1 ? '0' : '1px'
            }
            display="flex"
            justifyContent="center"
            padding={3}
          >
            <Span fontSize="sm" fontWeight="semibold">
              {classification}
            </Span>
          </Box>
        ))}

        {tiers.map((tier, tierIndex) => (
          <React.Fragment key={tier}>
            <Box
              alignItems="center"
              backgroundColor="bg.muted"
              borderBottomWidth={tierIndex === tiers.length - 1 ? '0' : '1px'}
              borderRightWidth="1px"
              display="flex"
              justifyContent="center"
              left={0}
              padding={3}
              position="sticky"
              zIndex={1}
            >
              <Span color="fg.subtle" fontSize="sm" fontWeight="semibold">
                {tier}
              </Span>
            </Box>

            {classifications.map((classification, classIndex) => {
              const cellVehicles =
                vehiclesByTierAndClassification[tier][classification];

              return (
                <Box
                  key={`${tier}-${classification}`}
                  borderBottomWidth={
                    tierIndex === tiers.length - 1 ? '0' : '1px'
                  }
                  borderRightWidth={
                    classIndex === classifications.length - 1 ? '0' : '1px'
                  }
                  padding={2}
                >
                  <Stack gap={2}>
                    {cellVehicles.map((item) => (
                      <VehicleCell
                        key={item.slug}
                        initials={initials}
                        name={item.name}
                        vehicle={item.vehicle}
                      />
                    ))}
                  </Stack>
                </Box>
              );
            })}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
});
