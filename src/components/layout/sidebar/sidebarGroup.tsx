import { Box, Text } from '@chakra-ui/react';
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
    <div>
      {label && (
        <Box
          height={collapsed ? '16px' : '28px'}
          display="flex"
          alignItems="center"
          paddingX={3}
          position="relative"
          transition="height 0.15s"
        >
          <Text
            fontSize="xs"
            fontWeight="medium"
            color="fg.subtle"
            textTransform="uppercase"
            letterSpacing="wide"
            whiteSpace="nowrap"
            opacity={collapsed ? 0 : 1}
            transition="opacity 0.15s"
          >
            {label}
          </Text>

          <Box
            position="absolute"
            left={3}
            right={3}
            height="1px"
            background="whiteAlpha.100"
            opacity={collapsed ? 1 : 0}
            transition="opacity 0.15s"
          />
        </Box>
      )}

      <div>{children}</div>
    </div>
  );
}
