import { Box } from '@chakra-ui/react';
import React from 'react';

export default function VehicleCellGrid({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      alignItems="start"
      data-md-ignore
      display="grid"
      gap="12px"
      gridTemplateColumns="repeat(auto-fill, minmax(160px, 1fr))"
    >
      {children}
    </Box>
  );
}
