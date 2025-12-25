import { IconButton } from '@chakra-ui/react';
import React from 'react';
import { LuBug } from 'react-icons/lu';

import { useDevelopmentStore } from '@/stores/development';

export default function ModuleIdSelect({ moduleId }: { moduleId?: string }) {
  const isOverlayOpen = useDevelopmentStore((s) => s.isOverlayOpen);
  const setHighlightedModule = useDevelopmentStore(
    (s) => s.setHighlightedModule,
  );

  if (process.env.NODE_ENV !== 'development') return null;
  if (!isOverlayOpen) return null;
  if (!moduleId) return null;

  return (
    <IconButton onClick={() => setHighlightedModule(moduleId)} size="xs">
      <LuBug />
    </IconButton>
  );
}
