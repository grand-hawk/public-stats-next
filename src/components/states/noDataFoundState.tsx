import { Group } from '@chakra-ui/react';
import React from 'react';
import { MdWarning } from 'react-icons/md';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

import type { ButtonProps } from '@/components/ui/button';

export default function NoDataFoundState({ ...props }: ButtonProps) {
  return (
    <EmptyState icon={<MdWarning />} title="No data found">
      <Group>
        <Button {...props}>Refetch</Button>
      </Group>
    </EmptyState>
  );
}
