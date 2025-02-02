import { Group } from '@chakra-ui/react';
import React from 'react';
import { BiErrorAlt } from 'react-icons/bi';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

import type { ButtonProps } from '@/components/ui/button';

export default function ErrorState({
  error,
  ...props
}: ButtonProps & { error: string }) {
  return (
    <EmptyState description={error} icon={<BiErrorAlt />} title="Error">
      <Group>
        <Button variant="surface" {...props}>
          Retry
        </Button>
      </Group>
    </EmptyState>
  );
}
