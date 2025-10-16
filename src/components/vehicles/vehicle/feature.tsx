import { HStack, Span, VisuallyHidden } from '@chakra-ui/react';
import React from 'react';

import { Tooltip } from '@/components/ui/tooltip';

export default function VehicleFeature({
  description,
  icon,
  name,
}: {
  icon?: React.ReactNode;
  name: string;
  description?: string;
}) {
  const content = (
    <HStack borderWidth="1px" paddingX={4} paddingY={2} width="fit-content">
      {icon}
      <Span fontSize="sm">
        <VisuallyHidden>Feature: </VisuallyHidden>
        {name}
      </Span>
    </HStack>
  );

  return description ? (
    <Tooltip closeDelay={50} content={description} openDelay={50}>
      {content}
    </Tooltip>
  ) : (
    content
  );
}
