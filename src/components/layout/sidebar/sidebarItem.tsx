import { Flex, Icon, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import { TbChevronRight } from 'react-icons/tb';

import type { IconProps } from '@chakra-ui/react';
import type { IconType } from 'react-icons/lib';

export interface SidebarItemProps {
  label: string;
  href: string;
  icon: IconType | ((props: IconProps) => React.ReactNode);
  color?: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

export default function SidebarItem({
  active = false,
  collapsed = false,
  color = 'fg',
  href,
  icon: IconComponent,
  label,
  onClick,
}: SidebarItemProps) {
  return (
    <NextLink href={href} onClick={onClick} style={{ textDecoration: 'none' }}>
      <Flex
        alignItems="center"
        gap={3}
        paddingX={3}
        paddingY={2}
        position="relative"
        cursor="pointer"
        transition="all 0.15s"
        borderLeftWidth="2px"
        borderLeftColor={active ? color : 'transparent'}
        background={active ? 'whiteAlpha.50' : 'transparent'}
        _hover={{
          background: 'whiteAlpha.100',
          borderLeftColor: color,
          '& .sidebar-item-text': { color: 'fg' },
          '& .sidebar-item-icon': {
            borderColor: `color-mix(in srgb, ${color} 40%, transparent)`,
            background: `color-mix(in srgb, ${color} 10%, transparent)`,
            color: color,
          },
          '& .sidebar-item-chevron': {
            opacity: 1,
            transform: 'translateX(0)',
            color: 'fg.muted',
          },
        }}
      >
        <Flex
          className="sidebar-item-icon"
          alignItems="center"
          justifyContent="center"
          width={8}
          height={8}
          flexShrink={0}
          borderWidth="1px"
          borderColor={
            active
              ? `color-mix(in srgb, ${color} 40%, transparent)`
              : 'whiteAlpha.100'
          }
          background={
            active
              ? `color-mix(in srgb, ${color} 10%, transparent)`
              : 'transparent'
          }
          transition="all 0.15s"
          color={active ? color : 'fg.muted'}
        >
          <IconComponent />
        </Flex>

        {!collapsed && (
          <>
            <Text
              className="sidebar-item-text"
              fontSize="sm"
              fontWeight={active ? 'medium' : 'normal'}
              color={active ? 'fg' : 'fg.muted'}
              flex={1}
              whiteSpace="nowrap"
              transition="color 0.15s"
            >
              {label}
            </Text>

            <Icon
              className="sidebar-item-chevron"
              as={TbChevronRight}
              boxSize={4}
              color="fg.subtle"
              opacity={0}
              transform="translateX(-4px)"
              transition="all 0.15s"
            />
          </>
        )}
      </Flex>
    </NextLink>
  );
}
