import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

interface SidebarButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  collapsed?: boolean;
}

export default function SidebarButton({
  active = false,
  collapsed = false,
  icon,
  label,
  onClick,
}: SidebarButtonProps) {
  return (
    <Flex
      as="button"
      alignItems="center"
      gap={3}
      paddingX={3}
      paddingY={2}
      cursor="pointer"
      transition="all 0.15s"
      background={active ? 'whiteAlpha.100' : 'transparent'}
      color="fg.muted"
      _hover={{ background: 'whiteAlpha.100', color: 'fg' }}
      onClick={onClick}
      aria-label={label}
    >
      <Flex
        alignItems="center"
        justifyContent="center"
        width={8}
        height={8}
        flexShrink={0}
        borderWidth="1px"
        borderColor="whiteAlpha.100"
        transition="all 0.15s"
      >
        {icon}
      </Flex>
      {!collapsed && (
        <Text fontSize="sm" whiteSpace="nowrap">
          {label}
        </Text>
      )}
    </Flex>
  );
}
