import { Box, Container } from '@chakra-ui/react';
import React from 'react';

import type { BoxProps } from '@chakra-ui/react';

export default function Layout(props: BoxProps) {
  return (
    <Container
      display="flex"
      height="100vh"
      justifyContent="center"
      paddingX={8}
      width="100vw"
    >
      <Box
        as="main"
        display="grid"
        gridRowGap={4}
        gridTemplateColumns="1fr"
        gridTemplateRows="max-content 1fr"
        maxWidth="600px"
        paddingY={8}
        width="100%"
        {...props}
      >
        {props.children}
      </Box>
    </Container>
  );
}
