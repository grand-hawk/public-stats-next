import { Box, Center } from '@chakra-ui/react';
import React from 'react';
import { GrDocumentMissing } from 'react-icons/gr';

import VehicleTable from '@/components/kdr/vehicleTable';
import { EmptyState } from '@/components/ui/empty-state';
import { useSessionStore } from '@/stores/session';

export default function VehicleTableRoot() {
  const placeId = useSessionStore((s) => s.placeId);

  return (
    <Box
      borderColor="border.muted"
      borderRadius="lg"
      borderWidth="1px"
      padding={3}
    >
      <Center height="100%">
        {placeId ? (
          <VehicleTable placeId={placeId} />
        ) : (
          <EmptyState
            description="Start by selecting the place you want to see the vehicle KDR for"
            icon={<GrDocumentMissing />}
            title="Select a place"
          />
        )}
      </Center>
    </Box>
  );
}
