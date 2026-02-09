import { FormatNumber, Stack } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { TbChevronRight } from 'react-icons/tb';

import { Button } from '@/components/ui/button';
import SectionMarker from '@/components/wiki/sectionMarker';
import { StatsCell, StatsRoot, StatsRow } from '@/components/wiki/stats';
import TitledCard from '@/components/wiki/titledCard';
import { useVehicle } from '@/hooks/providers/vehicle';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';

export default function VehicleArmor() {
  const vehicle = useVehicle();
  const initials = usePlaceInitials()!;

  const armor = vehicle.content?.Armor;
  const fields = React.useMemo(() => {
    if (!armor) return;

    const fields: Record<string, number> = {};

    for (const line of armor.split('\n')) {
      const [key, value] = line.split(': ');
      fields[key] = Number(value);
    }

    return fields;
  }, [armor]);

  if (!fields) return null;
  return (
    <>
      <SectionMarker name="Armor" />

      <TitledCard as="section" title="Armor" withAnchor innerPadding={4}>
        <Stack gap={4}>
          <StatsRoot>
            {Object.entries(fields).map(([key, value]) => (
              <StatsRow key={key}>
                <StatsCell asTitle>{key}</StatsCell>
                <StatsCell>
                  <FormatNumber style="unit" unit="millimeter" value={value} />
                </StatsCell>
              </StatsRow>
            ))}
          </StatsRoot>

          <Button asChild variant="surface" alignSelf="start">
            <NextLink href={`/${initials}/armor?vehicle=${vehicle.info.slug}`}>
              Open armor visualizer
              <TbChevronRight />
            </NextLink>
          </Button>
        </Stack>
      </TitledCard>
    </>
  );
}
