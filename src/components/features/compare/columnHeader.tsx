import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import { LuX } from 'react-icons/lu';

import { HEADER_ROW_HEIGHT } from '@/components/features/compare';

export interface ColumnHeaderProps {
  children: React.ReactNode;
  extra?: React.ReactNode;
  onRemove: () => void;
}

export default function ColumnHeader({
  children,
  extra,
  onRemove,
}: ColumnHeaderProps) {
  return (
    <Box height={HEADER_ROW_HEIGHT} position="relative">
      <Flex
        gap={0.5}
        justifyContent="flex-end"
        paddingRight={1}
        paddingTop={1}
        position="absolute"
        right={0}
        top={0}
        zIndex={1}
      >
        {extra}

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

      <Flex
        alignItems="center"
        gap={2}
        height="100%"
        justifyContent="center"
        paddingX={2}
        paddingY={2.5}
      >
        {children}
      </Flex>
    </Box>
  );
}
