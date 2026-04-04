import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import ShellIcon from '@/components/features/shells/shellIcon';
import { getShellIcon } from '@/components/icons/shells';

interface ShellCardProps {
  damage: number;
  displayType: string;
  href: string;
  maxPenetration: number;
  name: string;
  velocity: number;
}

export default React.memo(function ShellCard({
  damage,
  displayType,
  href,
  maxPenetration,
  name,
  velocity,
}: ShellCardProps) {
  const shellIcon = getShellIcon(displayType);

  return (
    <Box
      asChild
      display="block"
      overflow="hidden"
      borderWidth="1px"
      borderColor="whiteAlpha.100"
      backgroundColor="bg.subtle/40"
      transition="border-color 0.15s, background-color 0.15s"
      _hover={{
        borderColor: 'orange.600',
        backgroundColor: 'bg.subtle',
        textDecoration: 'none',
      }}
    >
      <NextLink href={href} prefetch={false}>
        <VStack align="stretch" gap={2.5} padding={4}>
          <HStack align="start" gap={3}>
            {shellIcon && (
              <Box flexShrink={0} marginTop={0.5} opacity={0.95}>
                <ShellIcon alt={displayType} size={32} src={shellIcon} />
              </Box>
            )}

            <Box flex={1} minWidth={0}>
              <Text
                as="span"
                color="fg"
                display="block"
                fontSize="sm"
                fontWeight="semibold"
                lineHeight="snug"
                lineClamp={2}
              >
                {name}
              </Text>
              <Text
                color="orange.400"
                display="block"
                fontSize="xs"
                fontWeight="medium"
                marginTop={1}
              >
                {displayType}
              </Text>
            </Box>
          </HStack>

          <HStack
            color="fg"
            flexWrap="wrap"
            fontFamily="mono"
            fontSize="xs"
            gapX={2}
            gapY={1}
            letterSpacing="tight"
          >
            <Text as="span">{maxPenetration} mm pen</Text>
            <Text as="span" color="whiteAlpha.400">
              ·
            </Text>
            <Text as="span">{velocity} m/s</Text>
            <Text as="span" color="whiteAlpha.400">
              ·
            </Text>
            <Text as="span">{damage} dmg</Text>
          </HStack>
        </VStack>
      </NextLink>
    </Box>
  );
});
