import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

import { ProgressBar, ProgressRoot } from '@/components/ui/progress';

export function CanvasLoadingState({ progress }: { progress: number | null }) {
  return (
    <Flex
      alignItems="center"
      flexDirection="column"
      gap={4}
      height="100%"
      justifyContent="center"
      paddingX={8}
    >
      <ProgressRoot
        max={100}
        value={progress ?? undefined}
        width="100%"
        maxW="320px"
      >
        <ProgressBar borderRadius="9999px" overflow="hidden" />
      </ProgressRoot>
      <Text color="fg.muted" fontSize="0.875rem" lineHeight="1.375rem">
        Downloading armour data…
      </Text>
    </Flex>
  );
}

export function CanvasErrorState({ error }: { error: string }) {
  return (
    <Flex
      alignItems="center"
      direction="column"
      gap={2}
      height="100%"
      justifyContent="center"
      paddingInline="24px"
    >
      <Text color="fg.error" fontSize="0.875rem" lineHeight="1.375rem">
        {error}
      </Text>
    </Flex>
  );
}

export function CanvasEmptyState() {
  return (
    <Flex
      alignItems="center"
      direction="column"
      gap={2}
      height="100%"
      justifyContent="center"
    >
      <Text color="fg.muted" fontSize="0.875rem" lineHeight="1.375rem">
        Select a vehicle to get started
      </Text>
    </Flex>
  );
}
