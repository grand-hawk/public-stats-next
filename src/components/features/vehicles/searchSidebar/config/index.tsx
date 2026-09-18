import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import { Pill, PillGroup } from '@/components/ui/pillGroup';
import { useVehicleSearchStore } from '@/stores/vehicles/search';

export default function VehicleSearchConfig() {
  const groupByTeam = useVehicleSearchStore((s) => s.groupByTeam);
  const setGroupByTeam = useVehicleSearchStore((s) => s.setGroupByTeam);
  const groupByRole = useVehicleSearchStore((s) => s.groupByRole);
  const setGroupByRole = useVehicleSearchStore((s) => s.setGroupByRole);

  return (
    <Box css={{ borderBottom: '1px solid var(--border-color-subtle)' }}>
      <Flex
        alignItems="center"
        gap="8px"
        justifyContent="space-between"
        css={{ paddingInline: '8px', paddingBottom: '8px' }}
      >
        <Text
          as="span"
          color="fg.muted"
          fontSize="0.75rem"
          fontWeight={500}
          lineHeight="1.25rem"
        >
          Group by
        </Text>

        <PillGroup label="Group vehicles by">
          <Pill
            selected={groupByTeam}
            size="sm"
            onClick={() => setGroupByTeam(!groupByTeam)}
          >
            Team
          </Pill>

          <Pill
            selected={groupByRole}
            size="sm"
            onClick={() => setGroupByRole(!groupByRole)}
          >
            Role
          </Pill>
        </PillGroup>
      </Flex>
    </Box>
  );
}
