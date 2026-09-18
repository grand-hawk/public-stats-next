import { HStack, Span, VisuallyHidden } from '@chakra-ui/react';
import React from 'react';

import { ToggleTip } from '@/components/ui/toggle-tip';

export default function Feature({
  description,
  icon,
  name,
}: {
  icon?: React.ReactNode;
  name: string;
  description?: string;
}) {
  const content = (
    <HStack
      color="fg"
      gap={1.5}
      width="fit-content"
      css={{
        backgroundColor: 'var(--color-surface-3)',
        borderColor: 'var(--border-color-base)',
        borderRadius: '4px',
        borderWidth: '1px',
        fontSize: '12px',
        fontWeight: 500,
        lineHeight: '20px',
        padding: '2px 8px',
      }}
    >
      {icon}
      <Span>
        <VisuallyHidden>Feature: </VisuallyHidden>
        {name}
      </Span>
    </HStack>
  );

  return description ? (
    <ToggleTip closeDelay={50} content={description} openDelay={50}>
      {content}
    </ToggleTip>
  ) : (
    content
  );
}
