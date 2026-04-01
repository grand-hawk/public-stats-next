import { Box, HStack, Text } from '@chakra-ui/react';
import React from 'react';

const ACCENT = {
  blue: { clearHover: 'blue.400' },
  orange: { clearHover: 'orange.400' },
} as const;

export type SectionLabelAccent = keyof typeof ACCENT;

export default function SectionLabel({
  accent = 'blue',
  hasActive,
  onClear,
  title,
}: {
  accent?: SectionLabelAccent;
  hasActive?: boolean;
  onClear?: () => void;
  title: string;
}) {
  const a = ACCENT[accent];
  return (
    <HStack
      justifyContent="space-between"
      paddingBottom={1.5}
      paddingTop={3}
      paddingX={3}
    >
      <Text
        color="fg.subtle"
        fontSize="2xs"
        fontWeight="bold"
        letterSpacing="0.12em"
        textTransform="uppercase"
      >
        {title}
      </Text>
      {hasActive && (
        <Box
          as="button"
          color="fg.muted"
          cursor="pointer"
          fontSize="2xs"
          _hover={{ color: a.clearHover }}
          onClick={onClear}
        >
          clear
        </Box>
      )}
    </HStack>
  );
}
