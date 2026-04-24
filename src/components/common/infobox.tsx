import { Box, Heading, Stack, Text } from '@chakra-ui/react';
import React from 'react';

export interface InfoboxRow {
  label: string;
  value: React.ReactNode;
}

export default function Infobox({
  rows,
  title,
}: {
  rows: InfoboxRow[];
  title?: string;
}) {
  return (
    <Box
      backgroundColor="bg.panel"
      borderRadius={0}
      borderWidth="1px"
      overflow="hidden"
    >
      {title && (
        <Stack
          alignItems="center"
          backgroundColor="bg.muted"
          borderBottomWidth="1px"
          gap={0}
          paddingX={3}
          paddingY={3}
        >
          <Heading
            as="p"
            fontWeight="semibold"
            letterSpacing="-0.01em"
            size="md"
            textAlign="center"
          >
            {title}
          </Heading>
        </Stack>
      )}
      <Box as="dl">
        {rows.map((row, i) => (
          <Box
            key={row.label}
            backgroundColor={i % 2 === 1 ? 'bg.subtle' : undefined}
            display="grid"
            gap={3}
            gridTemplateColumns="auto 1fr"
            paddingX={3}
            paddingY={2}
          >
            <Text as="dt" color="fg.muted" fontSize="xs" fontWeight="medium">
              {row.label}
            </Text>
            <Text as="dd" fontSize="xs" textAlign="right">
              {row.value}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
