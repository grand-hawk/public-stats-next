import { Badge } from '@chakra-ui/react';
import React from 'react';

import VehicleIcon from '@/components/features/vehicles/vehicleIcon';
import SearchRowLabel from '@/components/layout/searchLayout/searchSidebar/rowLabel';

export default React.memo(function VehicleListName({
  isNew,
  name,
  slug,
}: {
  name: string;
  slug: string;
  isNew?: boolean;
}) {
  return (
    <SearchRowLabel
      badge={
        isNew && (
          <Badge colorPalette="blue" flexShrink={0}>
            NEW
          </Badge>
        )
      }
      icon={<VehicleIcon slug={slug} />}
      name={name}
    />
  );
});
