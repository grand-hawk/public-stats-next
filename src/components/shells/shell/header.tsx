import { Box, Heading, Image, Span, Stack } from '@chakra-ui/react';
import NextImage from 'next/image';
import React from 'react';

import { getShellTypeIcon } from '@/components/icons/shells';
import Stat from '@/components/wiki/stat';
import { useShell } from '@/hooks/providers/shell';

export default function ShellHeader() {
  const shell = useShell();

  const shellIcon = React.useMemo(() => {
    return getShellTypeIcon(shell.type);
  }, [shell.type]);

  return (
    <Box
      borderBottomWidth="1px"
      borderLeftWidth={{
        base: 0,
        md: '1px',
      }}
      borderRightWidth={{
        base: 0,
        md: '1px',
      }}
      borderTopWidth={{
        base: 0,
        md: '1px',
      }}
      width="100%"
    >
      <Stack as="section" backgroundColor="bg.subtle" gap={4} padding={6}>
        <div>
          <Span aria-label="Weapon name" color="gray.100">
            {shell.weapon}
          </Span>

          <Heading aria-label="Shell name" as="h1" id="shell-page-title">
            {shell.name}
          </Heading>
        </div>

        <Stat label="Type">
          {shell.type}

          {shellIcon && (
            <Image asChild marginLeft={1}>
              <NextImage
                alt={shell.type}
                height={32}
                quality={75}
                src={shellIcon}
                width={32}
              />
            </Image>
          )}
        </Stat>
      </Stack>
    </Box>
  );
}
