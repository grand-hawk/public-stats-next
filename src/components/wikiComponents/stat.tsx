import { Stat as ChakraStat } from '@chakra-ui/react';
import React from 'react';

import type { PropsWithChildren } from 'react';

export default function Stat({
  children,
  label,
}: PropsWithChildren<{
  label: React.ReactNode;
}>) {
  return (
    <ChakraStat.Root>
      <ChakraStat.Label>{label}</ChakraStat.Label>
      <ChakraStat.ValueText fontSize="xl">{children}</ChakraStat.ValueText>
    </ChakraStat.Root>
  );
}
