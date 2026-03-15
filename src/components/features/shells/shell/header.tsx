import { Box, Heading, Span, Stack } from '@chakra-ui/react';
import React from 'react';
import { LuGitCompareArrows } from 'react-icons/lu';

import IconLink from '@/components/common/buttonIconLink';
import ButtonMarkdownLink from '@/components/common/buttonMarkdownLink';
import HeaderToolbar from '@/components/common/headerToolbar';
import ShellIcon from '@/components/features/shells/shellIcon';
import { getShellIcon } from '@/components/icons/shells';
import Stat from '@/components/wiki/stat';
import { useShell } from '@/hooks/providers/shell';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';

export default function ShellHeader() {
  const shell = useShell();
  const initials = usePlaceInitials();

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
        <HeaderToolbar uniformSize>
          <ButtonMarkdownLink />
          <IconLink
            href={`/${initials}/compare?tab=shells&shells=${shell.slug}`}
            size="sm"
            title="Compare"
            variant="surface"
          >
            <LuGitCompareArrows />
          </IconLink>
        </HeaderToolbar>

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
