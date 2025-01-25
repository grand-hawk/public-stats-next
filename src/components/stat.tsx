import { Box } from '@chakra-ui/react';
import React from 'react';

import { StatLabel, StatRoot, StatValueText } from '@/components/ui/stat';

import type { StatValueTextProps } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';

export default function Stat({
  label,
  children,
  ...props
}: PropsWithChildren<{ label: string }> & StatValueTextProps) {
  return (
    <StatRoot>
      <StatLabel color="unset" fontWeight="medium">
        {label}
      </StatLabel>
      <Box alignItems="center" display="flex" height="100%">
        <StatValueText {...props}>{children}</StatValueText>
      </Box>
    </StatRoot>
  );
}
