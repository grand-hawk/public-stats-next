import React from 'react';

import LineageGrid from '@/components/features/vehicles/lineageGrid';
import SectionMarker from '@/components/wiki/sectionMarker';
import TitledCard from '@/components/wiki/titledCard';
import { useVehicle } from '@/hooks/providers/vehicle';

export default function VehicleVariants() {
  const { variants } = useVehicle().info.lineage;

  if (variants.length === 0) return null;
  return (
    <>
      <SectionMarker name="Variants" />

      <TitledCard as="section" title="Variants" withAnchor>
        <LineageGrid vehicles={variants} />
      </TitledCard>
    </>
  );
}
