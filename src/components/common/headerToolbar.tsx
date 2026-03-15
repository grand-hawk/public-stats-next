import { HStack } from '@chakra-ui/react';
import React from 'react';

export interface HeaderToolbarProps {
  children: React.ReactNode;
  placement?: 'top' | 'bottom';
  uniformSize?: boolean;
}

export default function HeaderToolbar({
  children,
  placement = 'top',
  uniformSize = false,
}: HeaderToolbarProps) {
  return (
    <HStack
      bottom={placement === 'bottom' ? 2 : undefined}
      css={
        uniformSize
          ? {
              '& > *': {
                height: 9,
                width: 9,
              },
            }
          : undefined
      }
      flexDirection="row-reverse"
      position="absolute"
      right={2}
      role="toolbar"
      top={placement === 'top' ? 2 : undefined}
    >
      {children}
    </HStack>
  );
}
