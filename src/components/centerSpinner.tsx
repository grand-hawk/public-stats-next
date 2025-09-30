import { Center, Spinner } from '@chakra-ui/react';
import React from 'react';

import type { SpinnerProps } from '@chakra-ui/react';

export default function CenterSpinner({ ...props }: SpinnerProps) {
  return (
    <Center height="100%">
      <Spinner {...props} />
    </Center>
  );
}
