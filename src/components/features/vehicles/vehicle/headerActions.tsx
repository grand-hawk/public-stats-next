import React from 'react';
import { LuGitCompareArrows } from 'react-icons/lu';

import { PageActionLink } from '@/components/common/pageActions';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';

import type { DetailedVehicle } from '@/server/api/trpc/routers/vehicles';

export default function VehicleHeaderActions({
  vehicle,
}: {
  vehicle: DetailedVehicle;
}) {
  const initials = usePlaceInitials();

  return (
    <PageActionLink
      href={`/${initials}/compare?tab=vehicles&vehicles=${vehicle.info.slug}`}
      label="Compare"
    >
      <LuGitCompareArrows />
    </PageActionLink>
  );
}
