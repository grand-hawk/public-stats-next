import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

export interface SidebarGroupProps {
  label?: string;
  children: React.ReactNode;
  collapsed?: boolean;
}

export default function SidebarGroup({
  children,
  collapsed = false,
  label,
}: SidebarGroupProps) {
  return (
    <Box marginTop={label ? 3 : 0}>
      {label && (
        <Flex
          alignItems="center"
          height={collapsed ? '10px' : '18px'}
          paddingX={3}
          transition="height 0.15s"
        >
          <Text
            color="fg.muted"
            fontSize="9px"
            fontWeight="semibold"
            letterSpacing="0.2em"
            lineHeight="1"
            opacity={collapsed ? 0 : 1}
            textTransform="uppercase"
            transition="opacity 0.15s"
            whiteSpace="nowrap"
          >
            {label}
          </Text>
        </Flex>
      )}

      <Box>{children}</Box>
    </Box>
  );
}
