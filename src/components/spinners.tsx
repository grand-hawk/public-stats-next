import { Center, Spinner } from '@chakra-ui/react';
import React from 'react';

import type { SpinnerProps } from '@chakra-ui/react';

export function CenterSpinner({ ...props }: SpinnerProps) {
  return (
    <Center height="100%">
      <Spinner {...props} />
    </Center>
  );
}

export function XSSpinner({ ...props }: SpinnerProps) {
  return (
    <Center height="xs">
      <Spinner {...props} />
    </Center>
  );
}
