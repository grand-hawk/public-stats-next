import dynamic from 'next/dynamic';
import React from 'react';

import SectionMarker from '@/components/wiki/sectionMarker';
import TitledCard from '@/components/wiki/titledCard';
import { useVehicle } from '@/hooks/providers/vehicle';

const VehicleArmorPreview = dynamic(
  () => import('@/components/features/vehicles/vehicle/armorPreview'),
  { ssr: false },
);

export default function VehicleArmor() {
  const vehicle = useVehicle();

  if (!vehicle.info.damageModules) return null;
  return (
    <>
      <SectionMarker name="Armour" />

      <TitledCard as="section" title="Armour" withAnchor>
        <VehicleArmorPreview
          frontArmorDepth={vehicle.info.frontArmorDepth ?? 50}
        />
      </TitledCard>
    </>
  );
}
