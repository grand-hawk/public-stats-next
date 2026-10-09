import { Kbd as ChakraKbd } from '@chakra-ui/react';
import React from 'react';

export default function Kbd({ children }: { children: React.ReactNode }) {
  return <ChakraKbd wordSpacing="normal">{children}</ChakraKbd>;
}
