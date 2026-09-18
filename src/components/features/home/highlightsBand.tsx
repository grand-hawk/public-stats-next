import React from 'react';

import ClassesCard from '@/components/features/home/classesCard';
import FeaturedCard from '@/components/features/home/featuredCard';
import { Band, BandGrid, BandInner } from '@/components/features/home/grid';

export default function HighlightsBand({
  classCounts,
  initials,
  newest,
}: {
  classCounts: Record<string, number>;
  initials: string;
  newest: { name: string; role: string; slug: string } | null;
}) {
  return (
    <Band css={{ marginTop: '-32px', paddingBlockEnd: '16px', zIndex: 2 }}>
      <BandInner>
        <BandGrid>
          {newest && (
            <FeaturedCard
              initials={initials}
              name={newest.name}
              role={newest.role}
              slug={newest.slug}
            />
          )}

          <ClassesCard classCounts={classCounts} initials={initials} />
        </BandGrid>
      </BandInner>
    </Band>
  );
}
