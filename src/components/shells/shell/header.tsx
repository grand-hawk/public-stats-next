import { Box, Heading, HStack, Span, Stack } from '@chakra-ui/react';
import React from 'react';

import ButtonMarkdownLink from '@/components/buttonMarkdownLink';
import { getShellIcon } from '@/components/icons/shells';
import ShellIcon from '@/components/shells/shellIcon';
import Stat from '@/components/wiki/stat';
import { useShell } from '@/hooks/providers/shell';

export default function ShellHeader() {
  const shell = useShell();

  const shellIcon = React.useMemo(() => {
    return getShellIcon(shell.displayType);
  }, [shell.displayType]);

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
      <Stack
        as="section"
        backgroundColor="bg.subtle"
        gap={4}
        padding={6}
        position="relative"
      >
        <HStack position="absolute" right={2} role="toolbar" top={2}>
          <ButtonMarkdownLink />
        </HStack>

        <div>
          {shell.weapon !== shell.name && (
            <Span aria-label="Weapon name" color="gray.100">
              {shell.weapon}
            </Span>
          )}

          <Heading
            size="2xl"
            aria-label="Shell name"
            as="h1"
            id="shell-page-title"
          >
            {shell.name}
          </Heading>
        </div>

        <Stat label="Type">
          {shell.type}

          {shellIcon && (
            <ShellIcon
              alt={shell.type}
              marginLeft={1}
              size={32}
              src={shellIcon}
            />
          )}
        </Stat>
      </Stack>
    </Box>
  );
}
