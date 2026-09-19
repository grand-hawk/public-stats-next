import { Span } from '@chakra-ui/react';
import React from 'react';

import FamilyLinks from '@/components/features/vehicles/family/familyLinks';
import ArticleTitle from '@/components/wiki/articleTitle';
import SectionMarker from '@/components/wiki/sectionMarker';
import TitledCard from '@/components/wiki/titledCard';

import type { VehicleFamilySummary } from '@/server/api/trpc/routers/vehicles';

export default function VehicleFamilies({
  families,
}: {
  families: VehicleFamilySummary[];
}) {
  const vehicles = families.reduce((total, family) => total + family.count, 0);

  return (
    <>
      <ArticleTitle
        id="vehicle-families-page-title"
        title="Vehicle families"
        meta={
          <>
            <Span>{families.length} families</Span>
            <Span>{vehicles} vehicles</Span>
          </>
        }
      />

      <SectionMarker name="Families" />

      <TitledCard as="section" title="Families" withAnchor>
        <FamilyLinks families={families} />
      </TitledCard>
    </>
  );
}
