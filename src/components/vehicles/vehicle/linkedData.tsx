import React from 'react';

import { trpc } from '@/utils/trpc';

export default function VehicleLinkedData({
  placeId,
  slug,
}: {
  placeId: string;
  slug: string;
}) {
  const [linkedData] = trpc.vehicles.linkedDataBySlug.useSuspenseQuery({
    placeId,
    slug,
  });

  return linkedData ? (
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(linkedData).replace(/</g, '\\u003c'),
      }}
      type="application/ld+json"
    />
  ) : null;
}
