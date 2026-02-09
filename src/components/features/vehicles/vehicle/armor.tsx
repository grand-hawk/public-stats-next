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

const FIELD_ORDER = [
  'Lower front plate',
  'Upper front plate',
  'Left cheek',
  'Right cheek',
  'Mantlet',
  'Hull side',
];

interface ArmorValue {
  value: number;
  approximate: boolean;
}

function parseArmorValue(raw: string): ArmorValue {
  const approximate = raw.startsWith('~');
  return { value: Number(raw.replace('~', '')), approximate };
}

function ArmorNumber({ armor }: { armor: ArmorValue }) {
  return (
    <>
      {armor.approximate && '~'}
      <FormatNumber style="unit" unit="millimeter" value={armor.value} />
    </>
  );
}

export default function VehicleArmor() {
  const vehicle = useVehicle();
  const initials = usePlaceInitials()!;

  const armor = vehicle.content?.Armor;

  const fields = React.useMemo(() => {
    if (!armor) return;

    const parsed: Record<string, ArmorValue | [ArmorValue, ArmorValue]> = {};

    for (const line of armor.split('\n')) {
      const [key, value] = line.split(': ');
      parsed[key] = value.includes('-')
        ? (value.split('-').map(parseArmorValue) as [ArmorValue, ArmorValue])
        : parseArmorValue(value);
    }

    return FIELD_ORDER.filter((key) => key in parsed).map(
      (key) => [key, parsed[key]] as const,
    );
  }, [armor]);

  if (!fields) return null;
  return (
    <>
      <SectionMarker name="Armor" />

      <TitledCard as="section" title="Armor" withAnchor innerPadding={4}>
        <Stack gap={4}>
          <StatsRoot>
            {fields.map(([key, value]) => (
              <StatsRow key={key}>
                <StatsCell asTitle>{key}</StatsCell>
                <StatsCell>
                  {Array.isArray(value) ? (
                    <>
                      <ArmorNumber armor={value[0]} />
                      –
                      <ArmorNumber armor={value[1]} />
                    </>
                  ) : (
                    <ArmorNumber armor={value} />
                  )}
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
