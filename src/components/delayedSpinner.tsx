import { Spinner } from '@chakra-ui/react';
import React from 'react';

import type { SpinnerProps } from '@chakra-ui/react';

export default function DelayedSpinner({
  delay = 250,
  ...props
}: SpinnerProps & { delay?: number }) {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  return show && <Spinner {...props} />;
}
