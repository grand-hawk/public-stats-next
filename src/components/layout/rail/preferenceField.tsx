import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

export default function PreferenceField({
  children,
  id,
  label,
  readout,
}: {
  children: React.ReactNode;
  id?: string;
  label: string;
  readout?: string;
}) {
  return (
    <Box>
      <Flex
        alignItems="baseline"
        gap="8px"
        justifyContent="space-between"
        paddingBottom="8px"
      >
        <Box
          id={id}
          color="fg"
          fontSize="sm"
          fontWeight="medium"
          lineHeight="sm"
        >
          {label}
        </Box>
        {readout && (
          <Box
            aria-hidden
            color="fg.muted"
            fontSize="sm"
            lineHeight="sm"
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            {readout}
          </Box>
        )}
      </Flex>

      {children}
    </Box>
  );
}
