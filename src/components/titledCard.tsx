import { Box, Heading, Separator } from '@chakra-ui/react';
import React from 'react';

import type { BoxProps } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';

export default function TitledCard({
  children,
  noPadding,
  title,
  ...props
}: PropsWithChildren<BoxProps & { title: string; noPadding?: boolean }>) {
  return (
    <Box
      backgroundColor="bg.panel"
      borderRadius="none"
      borderWidth="1px"
      {...props}
    >
      <Heading fontWeight="medium" marginX={3} marginY={2} size="sm">
        {title}
      </Heading>
      <Separator />
      <Box padding={noPadding ? undefined : 6}>{children}</Box>
    </Box>
  );
}
