import { Stack } from '@chakra-ui/react';
import React from 'react';

import VehicleSearchConfigCheckbox from '@/components/features/vehicles/searchSidebar/config/checkbox';

export default function VehicleSearchConfig() {
  return (
    <Stack backgroundColor="bg.panel" padding={2}>
      <VehicleSearchConfigCheckbox
        label="Group by team"
        setValueKey="setGroupByTeam"
        valueKey="groupByTeam"
      />
      <VehicleSearchConfigCheckbox
        label="Group by role"
        setValueKey="setGroupByRole"
        valueKey="groupByRole"
      />
    </Stack>
  );
}
