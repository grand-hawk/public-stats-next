import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

export default function PreferencesSection({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <Box as="section" marginInline="16px">
      <Box
        color="fg.muted"
        fontSize="sm"
        fontWeight="medium"
        lineHeight="sm"
        marginBottom="12px"
      >
        {label}
      </Box>

      <Flex direction="column" rowGap="12px">
        {children}
      </Flex>
    </Box>
  );
}
