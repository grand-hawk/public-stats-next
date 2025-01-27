// https://www.chakra-ui.com/docs/components/input#floating-label

import { Box, Field, Input } from '@chakra-ui/react';
import React from 'react';

import type { InputProps } from '@chakra-ui/react';

export default function SearchInput({ ...props }: InputProps) {
  return (
    <Field.Root>
      <Box position="relative" width="100%">
        <Input className="peer" placeholder="" {...props} />

        <Field.Label
          css={{
            pos: 'absolute',
            bg: 'bg',
            px: '0.5',
            top: '-3',
            insetStart: '2',
            fontWeight: 'normal',
            pointerEvents: 'none',
            transition: 'position',
            _peerPlaceholderShown: {
              color: 'fg.muted',
              top: '2.5',
              insetStart: '3',
            },
            _peerFocusVisible: {
              color: 'fg',
              top: '-3',
              insetStart: '2',
            },
          }}
        >
          Search
        </Field.Label>
      </Box>
    </Field.Root>
  );
}
