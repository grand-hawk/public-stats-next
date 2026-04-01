import { Box } from '@chakra-ui/react';
import React from 'react';

import SectionLabel from '@/components/ui/sectionLabel';

export default function SidebarFilterGroup({
  children,
  hasActive,
  onClear,
  paddingBottom = 2,
  title,
}: {
  children: React.ReactNode;
  hasActive: boolean;
  onClear: () => void;
  paddingBottom?: number;
  title: string;
}) {
  return (
    <Box paddingBottom={paddingBottom}>
      <SectionLabel
        accent="orange"
        hasActive={hasActive}
        title={title}
        onClear={onClear}
      />

      <Box display="grid" gap={1} gridTemplateColumns="1fr 1fr" paddingX={3}>
        {children}
      </Box>
    </Box>
  );
}
