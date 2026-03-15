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
      height={HEADER_ROW_HEIGHT}
      paddingLeft={2}
      paddingRight={1}
      paddingY={2.5}
    >
      <Flex
        alignItems="center"
        flex={1}
        gap={2}
        justifyContent="center"
        minWidth={0}
      >
        {children}
      </Flex>

      <Flex
        _hover={{ color: 'fg', background: 'whiteAlpha.200' }}
        alignItems="center"
        as="button"
        color="fg.muted"
        cursor="pointer"
        flexShrink={0}
        justifyContent="center"
        marginLeft={1}
        padding={0.5}
        onClick={onRemove}
      >
        <LuX size={14} />
      </Flex>
    </Flex>
  );
}
