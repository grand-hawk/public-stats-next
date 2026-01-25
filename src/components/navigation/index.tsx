import { Box, Flex, IconButton, Stack, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { LuBug, LuEllipsis } from 'react-icons/lu';

import MTC from '@/components/icons/mtc';
import NavigationButton from '@/components/navigation/button';
import { secondaryTabKeys, tabs } from '@/components/navigation/tabs';
import {
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useCurrentTab } from '@/hooks/useCurrentTab';
import { useDebugEnabled } from '@/hooks/useDebugEnv';
import { usePlaceInitials } from '@/hooks/usePlaceInitials';
import { useDevelopmentStore } from '@/stores/development';

export default function Navigation() {
  const debugEnabled = useDebugEnabled();
  const initials = usePlaceInitials();
  const currentTab = useCurrentTab();
  const { isOverlayOpen, toggleOverlay } = useDevelopmentStore();

  const isSecondaryTabActive = secondaryTabKeys.some(
    (key) => tabs[key].path === currentTab?.path,
  );

  return (
    <Flex
      alignItems="center"
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
      justifyContent={{
        base: 'center',
        md: 'unset',
      }}
      padding={2}
      position="relative"
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

      <Flex flexDirection="inherit" gap={2}>
        {Object.entries(tabs).map(([key, tab]) => {
          const Icon = tab.icon;
          const isSecondary = (secondaryTabKeys as readonly string[]).includes(
            key,
          );

          return (
            <Box
              key={tab.path}
              display={isSecondary ? { base: 'none', md: 'block' } : 'block'}
            >
              <NavigationButton
                active={currentTab?.path === tab.path}
                aria-label={tab.label}
                color={tab.color}
                href={tab.path}
              >
                <Icon />
              </NavigationButton>
            </Box>
          );
        })}

        <Box display={{ base: 'block', md: 'none' }}>
          <PopoverRoot positioning={{ placement: 'top' }}>
            <PopoverTrigger asChild>
              <IconButton
                aria-label="More navigation options"
                height={10}
                variant={isSecondaryTabActive ? 'solid' : 'outline'}
                width={10}
              >
                <LuEllipsis />
              </IconButton>
            </PopoverTrigger>

            <PopoverContent
              background="transparent"
              borderRadius="0"
              width="auto"
            >
              <PopoverBody padding={0}>
                <Stack gap={0}>
                  {secondaryTabKeys.map((key) => {
                    const tab = tabs[key];
                    const Icon = tab.icon;
                    const isActive = currentTab?.path === tab.path;

                    return (
                      <Flex
                        key={tab.path}
                        _hover={{ bg: 'bg.emphasized' }}
                        alignItems="center"
                        asChild
                        bg={isActive ? 'bg.emphasized' : 'bg'}
                        borderBottomWidth="1px"
                        gap={3}
                        paddingX={3}
                        paddingY={2}
                        _last={{ borderBottomWidth: 0 }}
                      >
                        <NextLink href={`/${initials}${tab.path}`}>
                          <Icon color={tab.color} />
                          <Text fontSize="sm" fontWeight="medium">
                            {tab.label}
                          </Text>
                        </NextLink>
                      </Flex>
                    );
                  })}
                </Stack>
              </PopoverBody>
            </PopoverContent>
          </PopoverRoot>
        </Box>
      </Flex>

      <Flex
        display={{ base: 'none', md: 'inherit' }}
        flexDirection="inherit"
        gap={2}
        marginTop="auto"
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
