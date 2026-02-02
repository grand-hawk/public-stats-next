import { Stat as ChakraStat } from '@chakra-ui/react';
import React from 'react';

export interface StatProps {
  children: React.ReactNode;
  label: React.ReactNode;
  rootProps?: ChakraStat.RootProps;
  labelProps?: ChakraStat.LabelProps;
  valueProps?: ChakraStat.ValueTextProps;
}

export default function Stat({
  children,
  label,
  labelProps,
  rootProps,
  valueProps,
}: StatProps) {
  return (
    <ChakraStat.Root {...rootProps}>
      <ChakraStat.Label {...labelProps}>{label}</ChakraStat.Label>
      <ChakraStat.ValueText fontSize="xl" {...valueProps}>
        {children}
      </ChakraStat.ValueText>
    </ChakraStat.Root>
  );
}
