import { Box, Text } from '@chakra-ui/react';
import React from 'react';

import {
  LABEL_CSS,
  LABEL_ROW_CSS,
  SECTION_CSS,
} from '@/components/features/tools/armor/controls/styles';

interface ControlSectionProps {
  action?: React.ReactNode;
  children: React.ReactNode;
  label: string;
  tour?: string;
}

export function ControlSection({
  action,
  children,
  label,
  tour,
}: ControlSectionProps) {
  return (
    <Box css={SECTION_CSS} data-tour={tour}>
      <Box css={LABEL_ROW_CSS}>
        <Text as="span" css={LABEL_CSS}>
          {label}
        </Text>
        {action}
      </Box>
      {children}
    </Box>
  );
}
