// https://www.chakra-ui.com/docs/components/input#floating-label

import { Box, Field, Input } from '@chakra-ui/react';
import React from 'react';

import { CloseButton } from '@/components/ui/close-button';
import { InputGroup } from '@/components/ui/input-group';

import type { InputProps } from '@chakra-ui/react';

export default function SearchInput({
  value,
  setValue,
  ...props
}: InputProps & { setValue: (value: string) => void }) {
  return (
    <Field.Root>
      <Box position="relative" width="100%">
        <InputGroup
          endElement={
            value !== '' && (
              <CloseButton
                aria-label="Clear search"
                focusRingWidth="2px"
                focusVisibleRing="inside"
                pointerEvents="auto"
                size="xs"
                variant="plain"
                onClick={() => setValue('')}
              />
            )
          }
          width="100%"
        >
          <Input
            className="peer"
            placeholder=""
            value={value}
            onChange={(e) => setValue(e.target.value)}
            {...props}
          />
        </InputGroup>

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
