import { Tooltip as ChakraTooltip, Portal } from '@chakra-ui/react';
import React from 'react';

export interface TooltipProps extends ChakraTooltip.RootProps {
  content: React.ReactNode;
}

const CONTENT_CSS = {
  padding: '4px 8px',
  backgroundColor: 'var(--color-surface-3)',
  borderWidth: '1px',
  borderColor: 'border',
  borderRadius: '4px',
  boxShadow: 'large',
  color: 'fg.emphasized',
  fontSize: '0.8125rem',
  fontWeight: 500,
  lineHeight: '1.25rem',
} as const;

export function Tooltip({ children, content, ...props }: TooltipProps) {
  return (
    <ChakraTooltip.Root closeDelay={0} openDelay={150} {...props}>
      <ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
      <Portal>
        <ChakraTooltip.Positioner>
          <ChakraTooltip.Content css={CONTENT_CSS}>
            {content}
          </ChakraTooltip.Content>
        </ChakraTooltip.Positioner>
      </Portal>
    </ChakraTooltip.Root>
  );
}
