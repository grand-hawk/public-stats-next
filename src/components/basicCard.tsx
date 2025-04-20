import { Card, Heading } from '@chakra-ui/react';
import React from 'react';

import type { CardRootProps, HeadingProps } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';

export default function BasicCard({
  heading,
  headingProps,
  children,
  ...props
}: PropsWithChildren<{
  heading?: React.ReactNode;
  headingProps?: HeadingProps;
}> &
  CardRootProps) {
  return (
    <div>
      {heading && (
        <Heading size="lg" {...headingProps} paddingBottom={1}>
          {heading}
        </Heading>
      )}

      <Card.Root size="sm" variant="subtle" width="100%" {...props}>
        <Card.Body>{children}</Card.Body>
      </Card.Root>
    </div>
  );
}
