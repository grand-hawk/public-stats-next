import { Box, Heading, Separator } from '@chakra-ui/react';
import React from 'react';

import type { BoxProps } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';

export default function TitledCard({
  children,
  innerPadding = 6,
  title,
  ...props
}: PropsWithChildren<
  BoxProps & { title: string; innerPadding?: BoxProps['padding'] }
>) {
  return (
    <Box
      backgroundColor="bg.panel"
      borderLeftWidth={{
        base: 0,
        md: '1px',
      }}
      borderRadius="none"
      borderRightWidth={{
        base: 0,
        md: '1px',
      }}
      borderYWidth="1px"
      {...props}
    >
      <Heading fontWeight="medium" marginX={3} marginY={2} size="sm">
        {title}
      </Heading>
      <Separator />
      <Box padding={innerPadding}>{children}</Box>
    </Box>
  );
}
