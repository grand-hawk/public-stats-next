import { IconButton } from '@chakra-ui/react';
import React from 'react';

import { FOCUS_RING_CSS } from '@/components/ui/styles';

import type { IconButtonProps } from '@chakra-ui/react';

export interface RailButtonProps extends IconButtonProps {
  label: string;
  active?: boolean;
}

const RailButton = React.forwardRef<HTMLButtonElement, RailButtonProps>(
  function RailButton({ active = false, label, ...props }, ref) {
    return (
      <IconButton
        ref={ref}
        aria-label={label}
        backgroundColor={active ? 'quiet.active' : 'transparent'}
        borderRadius="4px"
        color={active ? 'fg.emphasized' : 'fg'}
        flexShrink={0}
        fontSize="20px"
        height="40px"
        minWidth="40px"
        title={label}
        variant="ghost"
        width="40px"
        _active={{ backgroundColor: 'quiet.active' }}
        _hover={{ backgroundColor: 'quiet.hover', color: 'fg.emphasized' }}
        css={{
          '@media (hover: none)': {
            '&:hover': { backgroundColor: 'transparent' },
          },
          '&:focus:not(:focus-visible)': {
            borderColor: 'transparent',
            boxShadow: 'none',
          },
          '&:focus-visible': {
            ...FOCUS_RING_CSS,
            borderColor: 'var(--border-color-progressive--focus)',
          },
        }}
        {...props}
      />
    );
  },
);

export default RailButton;
