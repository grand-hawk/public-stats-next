import { Box, Link, Text } from '@chakra-ui/react';
import React from 'react';

import type { BoxProps } from '@chakra-ui/react';

export interface SidebarLicenseProps extends BoxProps {}

export default function SidebarLicense(props: SidebarLicenseProps) {
  return (
    <Box paddingX={3} paddingY={2} {...props}>
      <Text fontSize="xs" color="fg.subtle" lineHeight="tall">
        <Link
          href="https://creativecommons.org/licenses/by-nc-nd/4.0/deed"
          target="_blank"
          rel="noopener noreferrer"
          color="fg.muted"
          _hover={{ color: 'fg' }}
        >
          CC BY-NC-ND 4.0
        </Link>
        <br />
        by{' '}
        <Link
          href="https://www.multicrew.dev"
          target="_blank"
          rel="noopener noreferrer"
          color="fg.muted"
          _hover={{ color: 'fg' }}
        >
          multicrew.dev
        </Link>
      </Text>
    </Box>
  );
}
