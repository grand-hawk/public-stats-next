import { Flex } from '@chakra-ui/react';
import React from 'react';

export interface ModeButtonProps {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}

export default function ModeButton({
  active,
  children,
  onClick,
}: ModeButtonProps) {
  return (
    <Flex
      _hover={{ color: 'fg', background: 'whiteAlpha.100' }}
      alignItems="center"
      as="button"
      background={active ? 'whiteAlpha.200' : 'transparent'}
      color={active ? 'fg' : 'fg.muted'}
      cursor="pointer"
      fontSize="sm"
      fontWeight={active ? 'medium' : 'normal'}
      gap={2}
      paddingX={4}
      paddingY={2.5}
      transition="all 0.1s"
      onClick={onClick}
    >
      {children}
    </Flex>
  );
}
