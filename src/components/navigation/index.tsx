import { Box, Flex, IconButton } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { LuBug } from 'react-icons/lu';

import MTC from '@/components/icons/mtc';
import NavigationButton from '@/components/navigation/button';
import { tabs } from '@/components/navigation/tabs';
import { useCurrentTab } from '@/hooks/useCurrentTab';
import { useDebugEnabled } from '@/hooks/useDebugEnv';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';
import { useDevelopmentStore } from '@/stores/development';

export default function Navigation() {
  const debugEnabled = useDebugEnabled();
  const initials = usePlaceInitials();
  const currentTab = useCurrentTab();
  const { isOverlayOpen, toggleOverlay } = useDevelopmentStore();

  return (
    <Flex
      as="nav"
      borderRightWidth={{
        base: '0px',
        md: '1px',
      }}
      borderTopWidth={{
        base: '1px',
        md: '0px',
      }}
      flexDirection={{
        base: 'row',
        md: 'column',
      }}
      gap={2}
      gridRow={{ base: '2', md: 'unset' }}
      padding={2}
    >
      <Box
        aria-label="Homepage"
        asChild
        marginX={{
          base: 2,
          md: 0,
        }}
        marginY={{
          base: 0,
          md: 2,
        }}
      >
        <NextLink href={`/${initials || 'mtc'}`}>
          <MTC height={10} width={10} />
        </NextLink>
      </Box>

      <Flex
        flexDirection="inherit"
        gap={2}
        left={{
          base: '50%',
          md: 'unset',
        }}
        position={{
          base: 'absolute',
          md: 'unset',
        }}
        transform={{
          base: 'translateX(-50%)',
          md: 'unset',
        }}
      >
        {Object.values(tabs).map((tab) => {
          const Icon = tab.icon;

          return (
            <NavigationButton
              key={tab.path}
              active={currentTab?.path === tab.path}
              aria-label={tab.label}
              color={tab.color}
              href={tab.path}
            >
              <Icon />
            </NavigationButton>
          );
        })}
      </Flex>

      <Flex
        flexDirection="inherit"
        gap={2}
        marginTop="auto"
        display={{
          base: 'none',
          md: 'inherit',
        }}
      >
        {debugEnabled && (
          <IconButton
            aria-label="Toggle Development Overlay"
            onClick={() => toggleOverlay()}
            variant={isOverlayOpen ? 'solid' : 'outline'}
          >
            <LuBug />
          </IconButton>
        )}
      </Flex>
    </Flex>
  );
}
