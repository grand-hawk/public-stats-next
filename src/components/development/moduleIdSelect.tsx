import { IconButton } from '@chakra-ui/react';
import React from 'react';
import { LuBug } from 'react-icons/lu';

import { useDebugEnabled } from '@/hooks/useDebugEnv';
import { useDevelopmentStore } from '@/stores/development';

import type { IconButtonProps } from '@chakra-ui/react';

export default function ModuleIdSelect({
  moduleId,
  ...props
}: { moduleId?: string } & IconButtonProps) {
  const debugEnabled = useDebugEnabled();
  const isOverlayOpen = useDevelopmentStore((s) => s.isOverlayOpen);
  const setHighlightedModule = useDevelopmentStore(
    (s) => s.setHighlightedModule,
  );

  if (!debugEnabled || !isOverlayOpen || !moduleId) return null;

  return (
    <IconButton
      size="2xs"
      marginLeft={2}
      variant="ghost"
      height="4"
      _hover={{
        backgroundColor: 'unset',
      }}
      {...props}
      onClick={() => setHighlightedModule(moduleId)}
    >
      <LuBug />
    </IconButton>
  );
}
