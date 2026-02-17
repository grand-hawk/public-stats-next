import { Flex } from '@chakra-ui/react';
import React from 'react';
import { LuX } from 'react-icons/lu';

import { HEADER_ROW_HEIGHT } from '@/components/features/compare';

export interface ColumnHeaderProps {
  children: React.ReactNode;
  onRemove: () => void;
}

export default function ColumnHeader({
  children,
  onRemove,
}: ColumnHeaderProps) {
  return (
    <Flex
      alignItems="center"
      flexShrink={0}
      gap={2}
      height={HEADER_ROW_HEIGHT}
      justifyContent="center"
      paddingX={2}
      paddingY={2.5}
      position="relative"
    >
      {children}

      <Flex
        _hover={{ color: 'fg', background: 'whiteAlpha.200' }}
        alignItems="center"
        as="button"
        color="fg.muted"
        cursor="pointer"
        flexShrink={0}
        justifyContent="center"
        padding={0.5}
        onClick={onRemove}
      >
        <LuX size={14} />
      </Flex>
    </Flex>
  );
}
