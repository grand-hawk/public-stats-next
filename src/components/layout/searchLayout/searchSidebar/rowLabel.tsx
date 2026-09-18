import { Box, HStack, Span } from '@chakra-ui/react';
import React from 'react';

import { TRUNCATE_CSS } from '@/components/ui/styles';

export default function SearchRowLabel({
  badge,
  icon,
  name,
}: {
  icon: React.ReactNode;
  name: string;
  badge?: React.ReactNode;
}) {
  return (
    <HStack justifyContent="space-between" minWidth={0} width="100%">
      <HStack minWidth={0}>
        <Span css={TRUNCATE_CSS} minWidth={0} title={name}>
          {name}
        </Span>
        {badge}
      </HStack>
      <Box flexShrink={0}>{icon}</Box>
    </HStack>
  );
}
