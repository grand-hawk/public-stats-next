import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

export interface SectionDividerProps {
  label: string;
}

export default function SectionDivider({ label }: SectionDividerProps) {
  return (
    <Flex alignItems="center" gap={3} marginBottom={4}>
      <Box height="1px" flex={1} maxWidth="40px" background="whiteAlpha.300" />
      <Text
        color="fg.muted"
        fontSize="xs"
        fontWeight="medium"
        textTransform="uppercase"
        letterSpacing="wide"
      >
        {label}
      </Text>
      <Box height="1px" flex={1} background="whiteAlpha.100" />
    </Flex>
  );
}
