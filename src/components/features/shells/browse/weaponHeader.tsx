import { Text } from '@chakra-ui/react';
import React from 'react';

export default function WeaponHeader({ weapon }: { weapon: string }) {
  return (
    <Text
      color="fg"
      display="block"
      fontSize="md"
      fontWeight="semibold"
      lineClamp={2}
      lineHeight="short"
      marginBottom={4}
    >
      {weapon}
    </Text>
  );
}
