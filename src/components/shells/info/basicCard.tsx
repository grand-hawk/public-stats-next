import { Card, Heading } from '@chakra-ui/react';
import React from 'react';

import type { HeadingProps } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';

export default function BasicCard({
  heading,
  headingProps,
  children,
}: PropsWithChildren<{
  heading?: React.ReactNode;
  headingProps?: HeadingProps;
}>) {
  return (
    <div>
      {heading && (
        <Heading size="lg" {...headingProps} paddingBottom={1}>
          {heading}
        </Heading>
      )}

      <Card.Root size="sm" variant="subtle" width="100%">
        <Card.Body>{children}</Card.Body>
      </Card.Root>
    </div>
  );
}
