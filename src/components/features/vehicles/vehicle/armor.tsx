import { FormatNumber, Stack } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import React from 'react';

import SectionMarker from '@/components/wiki/sectionMarker';
import { StatsCell, StatsRoot, StatsRow } from '@/components/wiki/stats';
import TitledCard from '@/components/wiki/titledCard';
import { useVehicle } from '@/hooks/providers/vehicle';

const VehicleArmorPreview = dynamic(
  () => import('@/components/features/vehicles/vehicle/armorPreview'),
  { ssr: false },
);

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
  const frontArmorDepth = vehicle.info.frontArmorDepth;

  const armor = vehicle.content?.Armour;

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

  if (!fields && frontArmorDepth == null) return null;
  return (
    <>
      <SectionMarker name="Armour" />

      <TitledCard as="section" title="Armour" withAnchor innerPadding={4}>
        <Stack gap={4}>
          {fields && (
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
          )}

          <VehicleArmorPreview frontArmorDepth={frontArmorDepth} />
        </Stack>
      </TitledCard>
    </>
  );
}
