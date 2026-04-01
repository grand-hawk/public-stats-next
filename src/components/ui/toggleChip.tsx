import { Box } from '@chakra-ui/react';
import React from 'react';

const ACCENT = {
  blue: {
    activeBg: 'blue.600/12',
    activeBorder: 'blue.600/50',
    activeColor: 'blue.300',
    hoverActiveBg: 'blue.600/18',
    hoverActiveColor: 'blue.200',
  },
  orange: {
    activeBg: 'orange.700/12',
    activeBorder: 'orange.700/50',
    activeColor: 'orange.300',
    hoverActiveBg: 'orange.700/18',
    hoverActiveColor: 'orange.200',
  },
} as const;

export type ToggleChipAccent = keyof typeof ACCENT;

export default function ToggleChip({
  accent = 'blue',
  active,
  children,
  onClick,
}: {
  accent?: ToggleChipAccent;
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  const a = ACCENT[accent];
  return (
    <Box
      as="button"
      alignItems="center"
      backgroundColor={active ? a.activeBg : 'transparent'}
      borderColor={active ? a.activeBorder : 'whiteAlpha.100'}
      borderWidth="1px"
      color={active ? a.activeColor : 'fg.muted'}
      cursor="pointer"
      display="flex"
      fontSize="2xs"
      gap={1}
      justifyContent="center"
      paddingX={1.5}
      paddingY={1}
      transition="all 0.1s"
      _hover={{
        backgroundColor: active ? a.hoverActiveBg : 'whiteAlpha.50',
        color: active ? a.hoverActiveColor : 'fg',
      }}
      onClick={onClick}
    >
      {children}
    </Box>
  );
}
