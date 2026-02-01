import { Stat as ChakraStat } from '@chakra-ui/react';
import React from 'react';

export interface StatProps {
  children: React.ReactNode;
  label: React.ReactNode;
}

export default function Stat({ children, label }: StatProps) {
  return (
    <ChakraStat.Root>
      <ChakraStat.Label>{label}</ChakraStat.Label>
      <ChakraStat.ValueText fontSize="xl">{children}</ChakraStat.ValueText>
    </ChakraStat.Root>
  );
}
