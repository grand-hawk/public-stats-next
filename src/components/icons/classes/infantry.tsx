import { Icon } from '@chakra-ui/react';
import React from 'react';

import type { IconProps } from '@chakra-ui/react';

export default function InfantryIcon({ ...props }: IconProps) {
  return (
    <Icon {...props}>
      <svg viewBox="0 0 385 975">
        <path
          fill="currentColor"
          d="m0 7l2-5 5-2h3l5 4 10 23 21 24 43 61 21 81v10l-7 16 9 26 11 10-2 6 4 3 8 20 49 144 4 3 1-2-5-4 1-8-9-17 9-14 11-5 11 2 4 4 13-2 5 17-6 1-3 5 9 22-2 11 2 6 16-1 5 14v4l-6 3 4 3 5 14-1 11-6 9-9 4v3l29 81-5 10 13 35 3 44 12 14 4 30 16 43 11 16 1 13-7 14 32 63 12 2 13 7 10 14 5 14v18l-5 12-16 18-19 10-24 6h-5l-18-2-18-9-8-11-6-17-1-17 8-17 6-5-13-68-15-8-7-10-1-18-17-55-5-2-7-12 1-19-25-37-30-90-12-15-2-19 5-13-12-41-9-17-2-12 2-18-53-150-3-34-9-26-16-9-6-8-33-76-4-65 1-49-6-17z"
        />
      </svg>
    </Icon>
  );
}
