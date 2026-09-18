import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

export default function KeyboardHint({
  keys,
  label,
}: {
  keys: string[];
  label: string;
}) {
  return (
    <Flex alignItems="center" gap="8px">
      <Flex alignItems="center" flex="none" gap="3px">
        {keys.map((key) => (
          <Box
            key={key}
            as="kbd"
            color="fg.muted"
            css={{
              display: 'inline-block',
              minWidth: '1.7em',
              padding: '0.1em 0.4em',
              fontSize: '0.75rem',
              fontWeight: 500,
              lineHeight: 1.4,
              textAlign: 'center',
              textTransform: 'capitalize',
              backgroundColor: 'var(--background-color-interactive-subtle)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--border-color-base)',
              borderRadius: '4px',
              boxShadow: '0 1px 0 var(--border-color-base)',
              unicodeBidi: 'isolate',
              direction: 'ltr',
            }}
          >
            {key}
          </Box>
        ))}
      </Flex>
      <Text as="span">{label}</Text>
    </Flex>
  );
}
